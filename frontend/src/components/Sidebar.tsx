import { useNavigate, useLocation } from "react-router-dom";
import PlaylistCard from "./PlaylistCard";
import { useSongData } from "../context/SongContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setShowCreateLibraryModal, isAuthenticated, showNotification } = useSongData();

  const isActive = (path: string) => location.pathname === path;

  const handleCreateLibrary = () => {
    if (!isAuthenticated) {
      showNotification("Login to create libraries");
      return;
    }
    setShowCreateLibraryModal(true);
  };

  return (
    <div className="w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex">
      <div className="bg-[#121212] rounded-lg flex flex-col gap-1 p-2">
        <div
          className={`flex items-center gap-4 px-5 py-3 rounded-md cursor-pointer transition-colors ${
            isActive("/") ? "bg-[#ffffff1a]" : "hover:bg-[#ffffff1a]"
          }`}
          onClick={() => navigate("/")}
        >
          <img src="/home.png" className="w-6 opacity-80" alt="" />
          <p className="font-bold text-sm">Home</p>
        </div>
        <div
          className={`flex items-center gap-4 px-5 py-3 rounded-md cursor-pointer transition-colors ${
            isActive("/search") ? "bg-[#ffffff1a]" : "hover:bg-[#ffffff1a]"
          }`}
          onClick={() => navigate("/search")}
        >
          <img src="/search.png" className="w-6 opacity-80" alt="" />
          <p className="font-bold text-sm">Search</p>
        </div>
      </div>

      <div className="bg-[#121212] rounded-lg flex-1 flex flex-col">
        <div className="p-4 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer hover:text-white transition-colors"
            onClick={() => navigate("/playlist")}
          >
            <img src="/stack.png" className="w-6 opacity-70" alt="" />
            <p className="font-semibold text-sm text-[#b3b3b3]">Your Library</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateLibrary}
              className="w-8 h-8 rounded-full hover:bg-[#ffffff1a] flex items-center justify-center transition-colors cursor-pointer"
              title="Create library"
            >
              <img src="/plus.png" className="w-5 opacity-70" alt="" />
            </button>
            <button
              onClick={() => navigate("/playlist")}
              className="w-8 h-8 rounded-full hover:bg-[#ffffff1a] flex items-center justify-center transition-colors cursor-pointer"
              title="View all libraries"
            >
              <img src="/arrow.png" className="w-5 opacity-70" alt="" />
            </button>
          </div>
        </div>
        <div
          className="cursor-pointer"
          onClick={() => navigate("/playlist")}
        >
          <PlaylistCard />
        </div>

      </div>
    </div>
  );
};

export default Sidebar;
