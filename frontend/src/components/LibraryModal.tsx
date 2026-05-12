import { useState } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";
import { useSongData } from "../context/SongContext";

const LibraryModal = () => {
  const { libraryModalSong, setLibraryModalSong, libraries, addSongToLibrary, createLibrary } = useSongData();
  const [newName, setNewName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  if (!libraryModalSong) return null;

  const songId = libraryModalSong.id;

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await createLibrary(newName.trim());
    await addSongToLibrary(newName.trim(), songId);
    setNewName("");
    setIsCreating(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      onClick={() => { setLibraryModalSong(null); setIsCreating(false); setNewName(""); }}
    >
      <div
        className="bg-[#282828] rounded-xl p-6 w-80 shadow-2xl border border-[#ffffff1a]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">Add to Library</h2>
          <button
            onClick={() => { setLibraryModalSong(null); setIsCreating(false); setNewName(""); }}
            className="text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
          >
            <FaTimes size={16} />
          </button>
        </div>
        <p className="text-[#b3b3b3] text-sm mb-5 truncate">{libraryModalSong.title}</p>

        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto mb-4">
          {libraries.length === 0 && (
            <p className="text-[#535353] text-sm text-center py-4">
              No libraries yet. Create one below.
            </p>
          )}
          {libraries.map((lib) => (
            <button
              key={lib.name}
              onClick={() => addSongToLibrary(lib.name, songId)}
              className="w-full text-left p-3 rounded-md hover:bg-[#ffffff1a] transition-colors cursor-pointer"
            >
              <span className="text-white text-sm font-medium">{lib.name}</span>
            </button>
          ))}
        </div>

        {isCreating ? (
          <div className="flex gap-2">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Library name"
              className="flex-1 px-3 py-2.5 rounded-md bg-[#3e3e3e] text-white text-sm border border-[#535353] focus:outline-none focus:border-white transition-colors placeholder:text-[#535353]"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            <button
              onClick={handleCreate}
              disabled={!newName.trim()}
              className="px-4 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-[#e6e6e6] transition-colors disabled:opacity-50 cursor-pointer"
            >
              Create
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 text-[#b3b3b3] hover:text-white text-sm font-medium transition-colors cursor-pointer"
          >
            <FaPlus size={12} />
            Create new library
          </button>
        )}
      </div>
    </div>
  );
};

export default LibraryModal;
