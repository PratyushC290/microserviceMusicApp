import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import adminRoutes from "./route.js";
import cloudinary from "cloudinary";
import redis from "redis";
import cors from "cors";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.Cloud_Name as string,
  api_key: process.env.Cloud_Api_Key as string,
  api_secret: process.env.Cloud_Api_Secret as string,
});

export const redisClient = redis.createClient({
  password: process.env.REDIS_PW as string,
  socket: {
    host: "redis-15644.crce217.ap-south-1-1.ec2.cloud.redislabs.com",
    port: 15644,
  },
});

redisClient
  .connect()
  .then(() => {
    console.log("Connected to redis");
  })
  .catch(console.error);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3002;

async function initDB() {
  try {
    await sql`
        CREATE TABLE IF NOT EXISTS albums(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            thumbnail VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;
    await sql`
        CREATE TABLE IF NOT EXISTS songs(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            thumbnail VARCHAR(255),
            audio VARCHAR(255) NOT NULL,
            album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;

    console.log("Database initialised successfully");
  } catch (error) {
    console.log("Error initDB", error);
  }
}

app.use("/api/v1", adminRoutes);

initDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
