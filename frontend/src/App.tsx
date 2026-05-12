import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Home from "./pages/Home.tsx";
import AlbumDetail from "./pages/AlbumDetail.tsx";
import Playlist from "./pages/Playlist.tsx";
import Search from "./pages/Search.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/album/:id" element={<AlbumDetail />} />
          <Route path="/playlist" element={<Playlist />} />
          <Route path="/search" element={<Search />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
