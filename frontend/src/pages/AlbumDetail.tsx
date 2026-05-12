import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSongData } from "../context/SongContext";
import { FaPlay } from "react-icons/fa";

const AlbumDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { albumSong, albumData, fetchAlbumsongs, loading, setSelectedSong, setIsPlaying, isAuthenticated, showNotification } = useSongData();

  useEffect(() => {
    if (id) {
      fetchAlbumsongs(id);
    }
  }, [id, fetchAlbumsongs]);

  const handlePlaySong = (songId: string) => {
    if (!isAuthenticated) {
      showNotification("Login to play songs");
      return;
    }
    setSelectedSong(songId);
    setIsPlaying(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white" />
      </div>
    );
  }

  return (
    <div className="pb-6">
      <div className="flex items-end gap-6 mb-8 pt-4">
        <img
          src={albumData?.thumbnail}
          alt={albumData?.title}
          className="w-56 h-56 rounded-lg shadow-2xl object-cover"
        />
        <div className="flex flex-col">
          <p className="text-xs uppercase font-bold text-[#b3b3b3] tracking-wider mb-2">Album</p>
          <h1 className="text-4xl font-bold mb-3 leading-tight">{albumData?.title}</h1>
          <p className="text-sm text-[#b3b3b3] mb-1">{albumData?.description}</p>
          <p className="text-sm text-[#b3b3b3]">
            <span className="text-white font-medium">{albumSong?.length} songs</span>
          </p>
        </div>
      </div>

      <div className="border-t border-[#ffffff1a] pt-4">
        {albumSong?.map((song, i) => (
          <div
            key={song.id}
            className="group grid grid-cols-[40px_40px_1fr] gap-4 items-center p-2 rounded-md hover:bg-[#ffffff1a] cursor-pointer transition-colors"
            onClick={() => handlePlaySong(song.id)}
          >
            <span className="text-[#b3b3b3] text-sm text-center group-hover:hidden">{i + 1}</span>
            <FaPlay className="hidden group-hover:block text-white justify-self-center" size={10} />
            <img
              src={song.thumbnail}
              alt={song.title}
              className="w-10 h-10 rounded object-cover"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{song.title}</p>
              <p className="text-xs text-[#b3b3b3] truncate">{song.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumDetail;
