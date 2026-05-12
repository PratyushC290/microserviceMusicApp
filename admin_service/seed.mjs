import { neon } from "@neondatabase/serverless";
import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const sql = neon(process.env.DB_URI);

async function clearRedis() {
  try {
    const client = createClient({
      password: process.env.REDIS_PW,
      socket: {
        host: "redis-11200.c245.us-east-1-3.ec2.cloud.redislabs.com",
        port: 11200,
      },
    });
    await client.connect();
    await client.del("songs");
    await client.del("albums");
    await client.quit();
    console.log("  Redis cache cleared");
  } catch (e) {
    console.log("  Redis not available, skipping cache clear");
  }
}

async function seed() {
  console.log("\nSeeding database...\n");

  await sql`DELETE FROM songs`;
  await sql`DELETE FROM albums`;
  console.log("  Cleared existing data\n");

  const albums = [
    { title: "Chill Vibes", description: "Relaxing tunes for your day", thumbnail: "https://picsum.photos/seed/chillvibes/300/300" },
    { title: "Workout Energy", description: "High energy beats to keep you moving", thumbnail: "https://picsum.photos/seed/workout/300/300" },
    { title: "Late Night Jazz", description: "Smooth jazz classics", thumbnail: "https://picsum.photos/seed/jazz/300/300" },
    { title: "Electronic Dreams", description: "Ambient electronic soundscapes", thumbnail: "https://picsum.photos/seed/electronic/300/300" },
    { title: "Acoustic Sessions", description: "Stripped down acoustic performances", thumbnail: "https://picsum.photos/seed/acoustic/300/300" },
  ];

  const albumIds = [];
  for (const album of albums) {
    const result = await sql`
      INSERT INTO albums (title, description, thumbnail) 
      VALUES (${album.title}, ${album.description}, ${album.thumbnail})
      RETURNING id
    `;
    albumIds.push(result[0].id);
    console.log(`  Album: ${album.title} (ID: ${result[0].id})`);
  }

  const songsData = [
    { title: "Sunset Dreams", desc: "Warm ambient vibes", audio: "SoundHelix-Song-1.mp3", album: 0 },
    { title: "Ocean Waves", desc: "Calm seaside melodies", audio: "SoundHelix-Song-2.mp3", album: 0 },
    { title: "Cloud Nine", desc: "Floating through the sky", audio: "SoundHelix-Song-3.mp3", album: 0 },
    { title: "Golden Hour", desc: "Warm evening light", audio: "SoundHelix-Song-4.mp3", album: 0 },
    { title: "Moonlight", desc: "Nighttime serenity", audio: "SoundHelix-Song-5.mp3", album: 0 },
    { title: "Power Up", desc: "Get ready to move", audio: "SoundHelix-Song-6.mp3", album: 1 },
    { title: "Push Hard", desc: "Keep going", audio: "SoundHelix-Song-7.mp3", album: 1 },
    { title: "Maximum Speed", desc: "Full throttle", audio: "SoundHelix-Song-8.mp3", album: 1 },
    { title: "Iron Will", desc: "Unbreakable", audio: "SoundHelix-Song-9.mp3", album: 1 },
    { title: "Victory Lap", desc: "You did it", audio: "SoundHelix-Song-10.mp3", album: 1 },
    { title: "Blue Note", desc: "Classic jazz vibes", audio: "SoundHelix-Song-11.mp3", album: 2 },
    { title: "Smoky Room", desc: "Intimate jazz club", audio: "SoundHelix-Song-12.mp3", album: 2 },
    { title: "Midnight Sax", desc: "Soulful saxophone", audio: "SoundHelix-Song-13.mp3", album: 2 },
    { title: "Velvet Touch", desc: "Smooth as silk", audio: "SoundHelix-Song-14.mp3", album: 2 },
    { title: "After Hours", desc: "Late night unwind", audio: "SoundHelix-Song-15.mp3", album: 2 },
    { title: "Neon Lights", desc: "City nightscape", audio: "SoundHelix-Song-16.mp3", album: 3 },
    { title: "Digital Horizon", desc: "Endless possibilities", audio: "SoundHelix-Song-1.mp3", album: 3 },
    { title: "Binary Stars", desc: "Cosmic dance", audio: "SoundHelix-Song-2.mp3", album: 3 },
    { title: "Circuit Board", desc: "Tech rhythms", audio: "SoundHelix-Song-3.mp3", album: 3 },
    { title: "Pixel Rain", desc: "Digital droplets", audio: "SoundHelix-Song-4.mp3", album: 3 },
    { title: "Morning Dew", desc: "Fresh start", audio: "SoundHelix-Song-5.mp3", album: 4 },
    { title: "Campfire Tales", desc: "Stories under stars", audio: "SoundHelix-Song-6.mp3", album: 4 },
    { title: "Open Road", desc: "Journey ahead", audio: "SoundHelix-Song-7.mp3", album: 4 },
    { title: "Simple Life", desc: "Back to basics", audio: "SoundHelix-Song-8.mp3", album: 4 },
    { title: "Sunshine", desc: "Bright and cheerful", audio: "SoundHelix-Song-9.mp3", album: 4 },
  ];

  const baseUrl = "https://www.soundhelix.com/examples/mp3";

  for (const song of songsData) {
    const albumId = albumIds[song.album];
    const audioUrl = `${baseUrl}/${song.audio}`;
    const thumbSeed = song.title.toLowerCase().replace(/\s+/g, "");
    const thumbnail = `https://picsum.photos/seed/${thumbSeed}/300/300`;

    await sql`
      INSERT INTO songs (title, description, thumbnail, audio, album_id)
      VALUES (${song.title}, ${song.desc}, ${thumbnail}, ${audioUrl}, ${albumId})
    `;
  }

  console.log(`\n  Seeded ${songsData.length} songs across ${albums.length} albums`);
}

seed()
  .then(() => clearRedis())
  .then(() => {
    console.log("\n✓ Seed complete!\n");
    process.exit(0);
  })
  .catch((e) => {
    console.error("\n✗ Seed failed:", e.message, "\n");
    process.exit(1);
  });
