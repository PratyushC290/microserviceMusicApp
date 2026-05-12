import type { AuthenticatedRequest } from "./middleware.js";
import { User } from "./model.js";
import TryCatch from "./TryCatch.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = TryCatch(async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });

  if (user) {
    res.status(400).json({
      message: "User already exists",
    });
    return;
  }

  const hashPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name: name,
    email: email,
    password: hashPassword,
  });

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC as string, {
    expiresIn: "7d",
  });

  res.status(201).json({
    message: "User registered",
    user,
    token,
  });
});

export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({
      message: "User does not exist",
    });
    return;
  }

  const isMatched = await bcrypt.compare(password, user.password);

  if (!isMatched) {
    res.status(400).json({
      message: "Invalid Password",
    });
    return;
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC as string, {
    expiresIn: "7d",
  });

  res.status(200).json({
    message: "User logged in",
    user,
    token,
  });
});

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;
  res.json(user);
});

export const createLibrary = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user!;
    const { name } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ message: "Library name is required" });
      return;
    }

    const libs = user.libraries || [];
    const exists = libs.find((l) => l.name === name.trim());
    if (exists) {
      res.status(400).json({ message: "Library already exists" });
      return;
    }

    if (!user.libraries) {
      user.libraries = [];
    }
    user.libraries.push({ name: name.trim(), songs: [] });
    user.markModified("libraries");
    await user.save();

    res.json({ message: "Library created", user });
  },
);

export const addToLibrary = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user!;
    const { libraryName, songId } = req.body;

    if (!libraryName || !songId) {
      res
        .status(400)
        .json({ message: "Library name and song ID are required" });
      return;
    }

    const library = user.libraries.find((l) => l.name === libraryName);
    if (!library) {
      res.status(404).json({ message: "Library not found" });
      return;
    }

    if (!library.songs.includes(songId)) {
      library.songs.push(songId);
      user.markModified("libraries");
      await user.save();
    }

    res.json({ message: "Song added to library", user });
  },
);

export const removeFromLibrary = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user!;
    const { libraryName, songId } = req.body;

    const library = (user.libraries || []).find((l) => l.name === libraryName);
    if (!library) {
      res.status(404).json({ message: "Library not found" });
      return;
    }

    library.songs = library.songs.filter((id) => id !== songId);
    user.markModified("libraries");
    await user.save();

    res.json({ message: "Song removed from library", user });
  },
);

export const deleteLibrary = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user!;
    const { name } = req.body;

    const idx = (user.libraries || []).findIndex((l) => l.name === name);
    if (idx === -1) {
      res.status(404).json({ message: "Library not found" });
      return;
    }

    user.libraries.splice(idx, 1);
    user.markModified("libraries");
    await user.save();

    res.json({ message: "Library deleted", user });
  },
);
