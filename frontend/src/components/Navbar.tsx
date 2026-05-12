import { useNavigate } from "react-router-dom";
import { useSongData } from "../context/SongContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useSongData();

  return (
    <>
      <div className="w-full flex justify-between items-center font-semibold">
        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 bg-black/60 hover:bg-black/80 backdrop-blur rounded-full flex items-center justify-center cursor-pointer transition-colors"
            onClick={() => navigate(-1)}
          >
            <img src="/left_arrow.png" className="w-4" alt="" />
          </button>
          <button
            className="w-8 h-8 bg-black/60 hover:bg-black/80 backdrop-blur rounded-full flex items-center justify-center cursor-pointer transition-colors"
            onClick={() => navigate(1)}
          >
            <img src="/right_arrow.png" className="w-4" alt="" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="px-3 py-1 text-sm font-bold text-white bg-[#282828] hover:bg-[#3e3e3e] rounded-full cursor-pointer transition-colors">
                {user?.name}
              </div>
              <button
                className="px-4 py-1.5 text-sm font-bold text-black bg-white hover:bg-[#e6e6e6] rounded-full transition-colors"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="px-4 py-1.5 text-sm font-bold text-[#b3b3b3] hover:text-white hover:scale-105 transition-all"
                onClick={() => navigate("/login")}
              >
                Log In
              </button>
              <button
                className="px-5 py-1.5 text-sm font-bold text-black bg-white hover:bg-[#e6e6e6] rounded-full transition-colors"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
