import { FaMusic } from "react-icons/fa";
import { useSongData } from "../context/SongContext";

const PlaylistCard = () => {
  const { isAuthenticated, libraries } = useSongData();

  const totalSongs = libraries.reduce((sum, lib) => sum + lib.songs.length, 0);

  return (
    <div className="flex items-center gap-3 px-4 py-3 mx-2 rounded-md cursor-pointer hover:bg-[#ffffff1a] transition-colors">
      <div className="w-12 h-12 bg-[#282828] rounded flex items-center justify-center shrink-0 shadow-lg">
        <FaMusic className="text-[#b3b3b3] text-lg" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-white truncate">
          {isAuthenticated ? `Your Libraries` : "My Library"}
        </p>
        <p className="text-xs text-[#b3b3b3] truncate">
          {isAuthenticated
            ? `${libraries.length} libraries • ${totalSongs} songs`
            : "Login to create libraries"}
        </p>
      </div>
    </div>
  );
};

export default PlaylistCard;
