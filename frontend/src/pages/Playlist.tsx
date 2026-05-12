import { useState } from "react";
import { useSongData } from "../context/SongContext";
import { FaPlay, FaMusic, FaArrowLeft, FaTrash } from "react-icons/fa";

const Playlist = () => {
  const { isAuthenticated, libraries, songs, setSelectedSong, setIsPlaying, showNotification, deleteLibrary } = useSongData();
  const [selectedLibrary, setSelectedLibrary] = useState<string | null>(null);

  const handlePlaySong = (songId: string) => {
    if (!isAuthenticated) {
      showNotification("Login to play songs");
      return;
    }
    setSelectedSong(songId);
    setIsPlaying(true);
  };

  const handleDeleteLibrary = async (name: string) => {
    await deleteLibrary(name);
    if (selectedLibrary === name) {
      setSelectedLibrary(null);
    }
  };

  const currentLib = selectedLibrary
    ? libraries.find((l) => l.name === selectedLibrary)
    : null;

  const libSongs = currentLib
    ? songs.filter((s) => currentLib.songs.includes(s.id.toString()))
    : [];

  return (
    <div className="pb-6">
      {selectedLibrary && currentLib ? (
        <>
          <div className="flex items-center gap-4 mb-6 pt-2">
            <button
              onClick={() => setSelectedLibrary(null)}
              className="text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
            >
              <FaArrowLeft size={18} />
            </button>
            <div className="w-48 h-48 bg-gradient-to-br from-[#1ed760] to-[#169c46] rounded-lg shadow-2xl flex items-center justify-center shrink-0">
              <FaMusic className="text-white" size={48} />
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-[#b3b3b3] tracking-wider mb-2">Library</p>
              <h1 className="text-3xl font-bold mb-2">{currentLib.name}</h1>
              <p className="text-sm text-[#b3b3b3]">{libSongs.length} songs</p>
              <button
                onClick={() => handleDeleteLibrary(currentLib.name)}
                className="mt-3 text-[#b3b3b3] hover:text-red-400 transition-colors text-sm flex items-center gap-1 cursor-pointer"
              >
                <FaTrash size={12} /> Delete library
              </button>
            </div>
          </div>

          <div className="border-t border-[#ffffff1a] pt-4 mt-4">
            {libSongs.length === 0 && (
              <p className="text-[#b3b3b3] text-center py-16 text-sm">
                No songs in this library yet.
              </p>
            )}
            {libSongs.map((song, i) => (
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
        </>
      ) : (
        <>
          <div className="mb-6 pt-2">
            <h1 className="text-3xl font-bold mb-2">
              {isAuthenticated ? "Your Libraries" : "My Library"}
            </h1>
            <p className="text-sm text-[#b3b3b3]">
              {isAuthenticated
                ? `${libraries.length} libraries`
                : "Login to create libraries"}
            </p>
          </div>

          {!isAuthenticated && (
            <p className="text-[#b3b3b3] text-center py-16 text-sm">
              <a href="/login" className="text-white underline hover:text-[#1ed760]">
                Log in
              </a>{" "}
              to create and manage your music libraries
            </p>
          )}

          {isAuthenticated && libraries.length === 0 && (
            <p className="text-[#b3b3b3] text-center py-16 text-sm">
              No libraries yet. Click the + button in the sidebar to create your first library.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {libraries.map((lib) => {
              const songCount = songs.filter((s) =>
                lib.songs.includes(s.id.toString())
              ).length;
              return (
                <div
                  key={lib.name}
                  onClick={() => setSelectedLibrary(lib.name)}
                  className="group p-4 bg-[#242424] rounded-lg hover:bg-[#2a2a2a] cursor-pointer transition-colors"
                >
                  <div className="w-full aspect-square bg-gradient-to-br from-[#1ed760] to-[#169c46] rounded-md mb-3 flex items-center justify-center shadow-lg">
                    <FaMusic className="text-white" size={32} />
                  </div>
                  <p className="font-bold text-white truncate">{lib.name}</p>
                  <p className="text-sm text-[#b3b3b3]">{songCount} songs</p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Playlist;
