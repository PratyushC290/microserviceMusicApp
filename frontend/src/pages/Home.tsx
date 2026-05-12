import AlbumCard from "../components/AlbumCard";
import SongCard from "../components/SongCard";
import { useSongData } from "../context/SongContext";

const Home = () => {
  const { albums, songs, loading } = useSongData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white" />
      </div>
    );
  }

  return (
    <div className="pb-8">
      <div className="mb-8">
        <h1 className="my-5 font-bold text-2xl tracking-tight">Featured Charts</h1>
        <div className="flex gap-2 overflow-auto pb-2 scrollbar-thin">
          {albums?.map((e, i) => (
            <AlbumCard
              key={i}
              image={e.thumbnail}
              name={e.title}
              desc={e.description}
              id={e.id}
            />
          ))}
        </div>
      </div>
      <div>
        <h1 className="my-5 font-bold text-2xl tracking-tight">Today's Biggest Hits</h1>
        <div className="flex gap-2 overflow-auto pb-2 scrollbar-thin">
          {songs?.map((e, i) => (
            <SongCard
              key={i}
              image={e.thumbnail}
              name={e.title}
              desc={e.description}
              id={e.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
