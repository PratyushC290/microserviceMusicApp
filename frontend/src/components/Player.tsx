import { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeDown, FaVolumeMute } from "react-icons/fa";
import { useSongData } from "../context/SongContext";

const Player = () => {
  const { song, isPlaying, setIsPlaying, selectedSong, nextSong, prevSong, fetchSingleSong, isAuthenticated, showNotification } = useSongData();
  const audioRef = useRef<HTMLAudioElement>(null);
  const restored = useRef(false);
  const isInitialMount = useRef(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (selectedSong) {
      fetchSingleSong();
    }
  }, [selectedSong, fetchSingleSong]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying && song) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, song]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.removeItem("lastPosition");
    restored.current = false;
  }, [selectedSong]);

  useEffect(() => {
    if (!audioRef.current || !song || restored.current) return;
    const storedPos = localStorage.getItem("lastPosition");
    if (storedPos) {
      const pos = parseFloat(storedPos);
      if (!isNaN(pos) && pos > 0 && audioRef.current.duration > pos) {
        audioRef.current.currentTime = pos;
      }
    }
    restored.current = true;
  }, [song]);

  useEffect(() => {
    if (!isPlaying || !audioRef.current) return;
    const interval = setInterval(() => {
      if (audioRef.current) {
        localStorage.setItem("lastPosition", String(audioRef.current.currentTime));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      localStorage.setItem("lastPosition", String(time));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
      audioRef.current.muted = false;
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handlePlayPause = () => {
    if (!isAuthenticated) {
      showNotification("Login to play songs");
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (!isAuthenticated) {
      showNotification("Login to play songs");
      return;
    }
    nextSong();
  };

  const handlePrev = () => {
    if (!isAuthenticated) {
      showNotification("Login to play songs");
      return;
    }
    prevSong();
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const VolumeIcon = isMuted || volume === 0 ? FaVolumeMute : volume < 0.5 ? FaVolumeDown : FaVolumeUp;
  const progressPct = duration ? (currentTime / duration) * 100 : 0;
  const volumePct = isMuted ? 0 : volume * 100;

  if (!song) {
    return (
      <div className="h-[10%] bg-gradient-to-t from-[#1a1a1a] to-[#121212] border-t border-[#282828] flex items-center justify-between px-4 min-w-0">
        <div className="flex items-center gap-3 w-[30%] min-w-0">
          <div className="w-14 h-14 bg-[#282828] rounded-lg shrink-0" />
          <div className="min-w-0">
            <p className="text-[#b3b3b3] text-sm font-medium">No song selected</p>
            <p className="text-[#535353] text-xs">Select a song to play</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 w-[40%]">
          <div className="flex items-center gap-5">
            <FaStepBackward className="text-[#535353]" size={16} />
            <div className="bg-[#535353] text-[#282828] p-2.5 rounded-full">
              <FaPlay size={14} />
            </div>
            <FaStepForward className="text-[#535353]" size={16} />
          </div>
        </div>
        <div className="w-[30%]" />
      </div>
    );
  }

  return (
    <div className="h-[10%] bg-gradient-to-t from-[#1a1a1a] to-[#121212] border-t border-[#282828] px-4 flex items-center justify-between min-w-0">
      <div className="flex items-center gap-3 w-[30%] min-w-0">
        <img src={song.thumbnail} alt={song.title} className="w-14 h-14 rounded-lg object-cover shadow-lg shrink-0" />
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold truncate max-w-36 hover:underline cursor-pointer">
            {song.title}
          </p>
          <p className="text-[#b3b3b3] text-xs truncate max-w-36 cursor-pointer hover:underline">
            {song.description}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 w-[40%] max-w-[600px]">
        <div className="flex items-center gap-5">
          <button onClick={handlePrev} className="text-[#b3b3b3] hover:text-white transition-colors" title="Previous">
            <FaStepBackward size={16} />
          </button>
          <button
            onClick={handlePlayPause}
            className="bg-white text-black p-2.5 rounded-full hover:scale-105 transition-transform shadow-lg shadow-black/30"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} className="ml-0.5" />}
          </button>
          <button onClick={handleNext} className="text-[#b3b3b3] hover:text-white transition-colors" title="Next">
            <FaStepForward size={16} />
          </button>
        </div>
        <div className="flex items-center gap-2 w-full">
          <span className="text-[#b3b3b3] text-[11px] font-mono w-10 text-right tabular-nums">{formatTime(currentTime)}</span>
          <div className="relative w-full h-1 group cursor-pointer">
            <div className="absolute inset-0 w-full h-full bg-[#535353] rounded-full" />
            <div
              className="absolute h-full bg-white rounded-full group-hover:bg-[#1ed760] transition-colors"
              style={{ width: `${progressPct}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              style={{ left: `${progressPct}%`, marginLeft: "-7px" }}
            />
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>
          <span className="text-[#b3b3b3] text-[11px] font-mono w-10 tabular-nums">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 w-[30%] justify-end">
        <button onClick={toggleMute} className="text-[#b3b3b3] hover:text-white transition-colors" title={isMuted ? "Unmute" : "Mute"}>
          <VolumeIcon size={16} />
        </button>
        <div className="relative w-24 h-1 group cursor-pointer">
          <div className="absolute inset-0 w-full h-full bg-[#535353] rounded-full" />
          <div
            className="absolute h-full bg-white rounded-full group-hover:bg-[#1ed760] transition-colors"
            style={{ width: `${volumePct}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            style={{ left: `${volumePct}%`, marginLeft: "-7px" }}
          />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={song.audio}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNext}
      />
    </div>
  );
};

export default Player;
