import { useSongData } from "../context/SongContext";
import SongCard from "../components/SongCard";
import { FaSearch } from "react-icons/fa";

const Search = () => {
  const { searchQuery, setSearchQuery, performSearch, searchResults } = useSongData();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    performSearch(query);
  };

  return (
    <div className="pb-8">
      <h1 className="text-2xl font-bold mb-6 tracking-tight">Search</h1>
      <div className="relative mb-8 max-w-md">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b3b3b3]" size={14} />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="What do you want to listen to?"
          className="w-full pl-10 pr-4 py-3 rounded-full bg-[#2a2a2a] text-white placeholder-[#b3b3b3] text-sm focus:outline-none focus:ring-2 focus:ring-white transition-shadow"
        />
      </div>

      {searchQuery && searchResults.length === 0 && (
        <p className="text-[#b3b3b3] text-center py-16 text-sm">
          No results found for "{searchQuery}"
        </p>
      )}

      {!searchQuery && (
        <p className="text-[#b3b3b3] text-center py-16 text-sm">
          Start typing to search songs
        </p>
      )}

      {searchResults.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-4">Songs</h2>
          <div className="flex flex-wrap gap-2">
            {searchResults.map((song) => (
              <SongCard
                key={song.id}
                image={song.thumbnail}
                name={song.title}
                desc={song.description}
                id={song.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
