import React from "react";
import { FaBookmark, FaPlay, FaRegBookmark } from "react-icons/fa";
import { useSongData } from "../context/SongContext";

interface SongCardProps {
  image: string;
  name: string;
  desc: string;
  id: string;
}

const SongCard: React.FC<SongCardProps> = ({ image, name, desc, id }) => {
  const { setSelectedSong, setIsPlaying, isAuthenticated, showNotification, libraries, setLibraryModalSong } = useSongData();

  const isInAnyLibrary = libraries.some((lib) => lib.songs.includes(id));

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      showNotification("Login to play songs");
      return;
    }
    setSelectedSong(id);
    setIsPlaying(true);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      showNotification("Login to save songs");
      return;
    }
    setLibraryModalSong({ id, title: name });
  };

  return (
    <div className="group min-w-44 p-3 rounded-md cursor-pointer hover:bg-[#ffffff1a] transition-all duration-300">
      <div className="relative mb-3">
        <img src={image} className="w-full aspect-square object-cover rounded-md shadow-lg" alt={name} />
        <div className="absolute bottom-2 right-2 flex gap-2">
          <button
            className="bg-[#1ed760] text-black p-3 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:scale-105 hover:bg-[#1fdf64] cursor-pointer"
            onClick={handlePlay}
          >
            <FaPlay className="ml-0.5" size={14} />
          </button>
          <button
            className={`p-3 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:scale-105 cursor-pointer ${
              isInAnyLibrary ? "bg-[#1ed760] text-black" : "bg-[#282828] text-white hover:bg-[#3e3e3e]"
            }`}
            onClick={handleBookmark}
          >
            {isInAnyLibrary ? <FaBookmark size={14} /> : <FaRegBookmark size={14} />}
          </button>
        </div>
      </div>
      <p className="font-bold text-sm text-white truncate">{name}</p>
      <p className="text-[#b3b3b3] text-sm truncate">{desc}</p>
    </div>
  );
};

export default SongCard;
