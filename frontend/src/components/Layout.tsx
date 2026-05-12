import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Player from "./Player";
import LibraryModal from "./LibraryModal";
import { Outlet } from "react-router-dom";
import { useSongData } from "../context/SongContext";
import { FaTimes } from "react-icons/fa";

const Layout = () => {
  const { notification, showCreateLibraryModal, setShowCreateLibraryModal, createLibrary, libraryModalSong } = useSongData();
  const [newLibName, setNewLibName] = useState("");

  const handleCreateLib = async () => {
    if (!newLibName.trim()) return;
    await createLibrary(newLibName.trim());
    setNewLibName("");
    setShowCreateLibraryModal(false);
  };

  return (
    <div className="h-screen relative overflow-hidden">
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-[#1ed760] text-black px-6 py-3 rounded-full font-bold text-sm shadow-2xl flex items-center gap-2 animate-fadeIn pointer-events-auto">
          <span>{notification}</span>
        </div>
      )}

      {showCreateLibraryModal && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
          onClick={() => setShowCreateLibraryModal(false)}
        >
          <div
            className="bg-[#282828] rounded-xl p-6 w-80 shadow-2xl border border-[#ffffff1a]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold text-lg">Create Library</h2>
              <button
                onClick={() => setShowCreateLibraryModal(false)}
                className="text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
              >
                <FaTimes size={16} />
              </button>
            </div>
            <input
              autoFocus
              value={newLibName}
              onChange={(e) => setNewLibName(e.target.value)}
              placeholder="Library name"
              className="w-full px-4 py-3 rounded-md bg-[#3e3e3e] text-white text-sm border border-[#535353] focus:outline-none focus:border-white transition-colors placeholder:text-[#535353] mb-5"
              onKeyDown={(e) => e.key === "Enter" && handleCreateLib()}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowCreateLibraryModal(false)}
                className="px-5 py-2 text-sm font-bold text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateLib}
                disabled={!newLibName.trim()}
                className="px-5 py-2 text-sm font-bold text-black bg-white rounded-full hover:bg-[#e6e6e6] transition-colors disabled:opacity-50 cursor-pointer"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {libraryModalSong && <LibraryModal />}

      <div className="h-[90%] flex">
        <Sidebar />
        <div className="flex-1 m-2 px-6 pt-4 rounded-lg bg-[#121212] text-white overflow-y-auto overflow-x-hidden min-w-0">
          <Navbar />
          <Outlet />
        </div>
      </div>
      <Player />
    </div>
  );
};

export default Layout;
