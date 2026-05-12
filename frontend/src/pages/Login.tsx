import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSongData } from "../context/SongContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useSongData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-[#121212] to-black flex items-center justify-center">
      <div className="bg-[#121212] p-10 rounded-xl w-full max-w-sm border border-[#ffffff1a]">
        <h1 className="text-white text-2xl font-bold text-center mb-8">
          Log in to Spotify
        </h1>

        {error && (
          <p className="bg-red-500/10 text-red-400 text-sm text-center py-2 px-4 rounded-lg mb-4 border border-red-500/20">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[#b3b3b3] text-xs font-bold uppercase tracking-wider block mb-2">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md bg-[#2a2a2a] text-white text-sm border border-[#535353] focus:outline-none focus:border-white transition-colors placeholder:text-[#535353]"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="text-[#b3b3b3] text-xs font-bold uppercase tracking-wider block mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md bg-[#2a2a2a] text-white text-sm border border-[#535353] focus:outline-none focus:border-white transition-colors placeholder:text-[#535353]"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-[#1ed760] text-black font-bold rounded-full hover:bg-[#1fdf64] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#ffffff1a]">
          <p className="text-[#b3b3b3] text-sm text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-white font-bold hover:text-[#1ed760] hover:underline transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
