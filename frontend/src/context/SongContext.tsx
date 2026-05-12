import axios from "axios";
import React, {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const songServer = "http://localhost:3003";
const userServer = "http://localhost:3001";

export interface Song {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  audio: string;
  album_id: string;
}

export interface Album {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  libraries: Array<{ name: string; songs: string[] }>;
}

export interface Library {
  name: string;
  songs: string[];
}

interface SongContextType {
  songs: Song[];
  song: Song | null;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  loading: boolean;
  selectedSong: string | null;
  setSelectedSong: (id: string) => void;
  albums: Album[];
  fetchSingleSong: () => Promise<void>;
  nextSong: () => void;
  prevSong: () => void;
  albumSong: Song[];
  albumData: Album | null;
  fetchAlbumsongs: (id: string) => Promise<void>;
  fetchSongs: () => Promise<void>;
  fetchAlbums: () => Promise<void>;
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  searchResults: Song[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  performSearch: (query: string) => void;
  notification: string | null;
  showNotification: (message: string) => void;
  libraries: Library[];
  createLibrary: (name: string) => Promise<void>;
  addSongToLibrary: (libraryName: string, songId: string) => Promise<void>;
  removeSongFromLibrary: (libraryName: string, songId: string) => Promise<void>;
  deleteLibrary: (name: string) => Promise<void>;
  showCreateLibraryModal: boolean;
  setShowCreateLibraryModal: (show: boolean) => void;
  libraryModalSong: { id: string; title: string } | null;
  setLibraryModalSong: (song: { id: string; title: string } | null) => void;
}

const SongContext = createContext<SongContextType | undefined>(undefined);

interface SongProviderProps {
  children: ReactNode;
}

export const SongProvider: React.FC<SongProviderProps> = ({ children }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSong, setSelectedSong] = useState<string | null>(
    () => localStorage.getItem("lastSongId") || null,
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(
    () => localStorage.getItem("lastIsPlaying") === "true",
  );
  const [albums, setAlbums] = useState<Album[]>([]);
  const [song, setSong] = useState<Song | null>(null);
  const [index, setIndex] = useState<number>(0);
  const [albumSong, setAlbumSong] = useState<Song[]>([]);
  const [albumData, setAlbumData] = useState<Album | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [notification, setNotification] = useState<string | null>(null);
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [showCreateLibraryModal, setShowCreateLibraryModal] = useState(false);
  const [libraryModalSong, setLibraryModalSong] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const isAuthenticated = !!token && !!user;

  const showNotification = useCallback((message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${songServer}/api/v1/song/all`);
      const songsData: Song[] = Array.isArray(data) ? data : data.songs;
      setSongs(songsData);
      if (songsData.length > 0) {
        const storedId = localStorage.getItem("lastSongId");
        const songExists = storedId && songsData.some((s) => s.id.toString() === storedId);
        if (!songExists) {
          setSelectedSong(songsData[0].id.toString());
          setIsPlaying(false);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSingleSong = useCallback(async () => {
    if (!selectedSong) return;
    try {
      const { data } = await axios.get(
        `${songServer}/api/v1/song/${selectedSong}`,
      );
      setSong(data);
    } catch (error) {
      console.log(error);
    }
  }, [selectedSong]);

  const fetchAlbums = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${songServer}/api/v1/album/all`);
      const albumsData: Album[] = Array.isArray(data) ? data : data.albums;
      setAlbums(albumsData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const nextSong = useCallback(() => {
    if (index === songs.length - 1) {
      setIndex(0);
      setSelectedSong(songs[0]?.id.toString());
    } else {
      setIndex((prevIndex) => prevIndex + 1);
      setSelectedSong(songs[index + 1]?.id.toString());
    }
  }, [index, songs]);

  const prevSong = useCallback(() => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
      setSelectedSong(songs[index - 1]?.id.toString());
    }
  }, [index, songs]);

  const fetchAlbumsongs = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get<{ songs: Song[]; album: Album }>(
        `${songServer}/api/v1/album/${id}`,
      );
      setAlbumData(data.album);
      setAlbumSong(data.songs);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await axios.post(`${userServer}/api/v1/user/login`, {
      email,
      password,
    });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    setLibraries(data.user.libraries || []);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { data } = await axios.post(
        `${userServer}/api/v1/user/register`,
        { name, email, password },
      );
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      setLibraries(data.user.libraries || []);
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("lastSongId");
    localStorage.removeItem("lastIsPlaying");
    localStorage.removeItem("lastPosition");
    setToken(null);
    setUser(null);
    setLibraries([]);
    setIsPlaying(false);
    setSong(null);
  }, []);

  const performSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }
      const lower = query.toLowerCase();
      const results = songs.filter(
        (s) =>
          s.title.toLowerCase().includes(lower) ||
          s.description.toLowerCase().includes(lower),
      );
      setSearchResults(results);
    },
    [songs],
  );

  const createLibrary = useCallback(
    async (name: string) => {
      if (!token) return;
      try {
        const { data } = await axios.post(
          `${userServer}/api/v1/user/library/create`,
          { name },
          { headers: { token } },
        );
        setUser(data.user);
        setLibraries(data.user.libraries || []);
        showNotification(`Library "${name}" created ✓`);
      } catch (e: any) {
        showNotification(e.response?.data?.message || "Failed to create library");
      }
    },
    [token, showNotification],
  );

  const addSongToLibrary = useCallback(
    async (libraryName: string, songId: string) => {
      if (!token) return;
      try {
        const { data } = await axios.post(
          `${userServer}/api/v1/user/library/add`,
          { libraryName, songId },
          { headers: { token } },
        );
        setUser(data.user);
        setLibraries(data.user.libraries || []);
        showNotification(`Added to ${libraryName} ✓`);
      } catch (e: any) {
        showNotification(e.response?.data?.message || "Failed to add song");
      }
    },
    [token, showNotification],
  );

  const removeSongFromLibrary = useCallback(
    async (libraryName: string, songId: string) => {
      if (!token) return;
      try {
        const { data } = await axios.post(
          `${userServer}/api/v1/user/library/remove`,
          { libraryName, songId },
          { headers: { token } },
        );
        setUser(data.user);
        setLibraries(data.user.libraries || []);
        showNotification(`Removed from ${libraryName}`);
      } catch (e: any) {
        showNotification(e.response?.data?.message || "Failed to remove song");
      }
    },
    [token, showNotification],
  );

  const deleteLibrary = useCallback(
    async (name: string) => {
      if (!token) return;
      try {
        const { data } = await axios.delete(
          `${userServer}/api/v1/user/library/delete`,
        { headers: { token }, data: { name } },
      );
      setUser(data.user);
      setLibraries(data.user.libraries || []);
      } catch (e: any) {
        showNotification(e.response?.data?.message || "Failed to delete library");
      }
    },
    [token],
  );

  useEffect(() => {
    fetchSongs();
    fetchAlbums();
  }, []);

  useEffect(() => {
    if (token) {
      axios
        .get(`${userServer}/api/v1/user/me`, { headers: { token } })
        .then(({ data }) => {
          setUser(data);
          setLibraries(data.libraries || []);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
        });
    }
  }, [token]);

  useEffect(() => {
    if (selectedSong) {
      localStorage.setItem("lastSongId", selectedSong);
    }
  }, [selectedSong]);

  useEffect(() => {
    localStorage.setItem("lastIsPlaying", String(isPlaying));
  }, [isPlaying]);

  return (
    <SongContext.Provider
      value={{
        songs,
        selectedSong,
        setSelectedSong,
        isPlaying,
        setIsPlaying,
        loading,
        albums,
        fetchSingleSong,
        song,
        nextSong,
        prevSong,
        fetchAlbumsongs,
        albumData,
        albumSong,
        fetchSongs,
        fetchAlbums,
        user,
        token,
        isAuthenticated,
        login,
        register,
        logout,
        searchResults,
        searchQuery,
        setSearchQuery,
        performSearch,
        notification,
        showNotification,
        libraries,
        createLibrary,
        addSongToLibrary,
        removeSongFromLibrary,
        deleteLibrary,
        showCreateLibraryModal,
        setShowCreateLibraryModal,
        libraryModalSong,
        setLibraryModalSong,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSongData = (): SongContextType => {
  const context = useContext(SongContext);
  if (!context) {
    throw new Error("useSongData must be used within a songProvider");
  }
  return context;
};
