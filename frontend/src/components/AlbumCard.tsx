import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";

interface AlbumCardProps {
  image: string;
  name: string;
  desc: string;
  id: string;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ image, name, desc, id }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/album/" + id)}
      className="group min-w-44 p-3 rounded-md cursor-pointer hover:bg-[#ffffff1a] transition-all duration-300"
    >
      <div className="relative mb-3">
        <img src={image} className="w-full aspect-square object-cover rounded-md shadow-lg" alt={name} />
        <div className="absolute bottom-2 right-2 bg-[#1ed760] text-black p-3 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-xl cursor-pointer">
          <FaPlay className="ml-0.5" size={14} />
        </div>
      </div>
      <p className="font-bold text-sm text-white truncate">{name}</p>
      <p className="text-[#b3b3b3] text-sm truncate">{desc}</p>
    </div>
  );
};

export default AlbumCard;
