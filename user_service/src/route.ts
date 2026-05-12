import express from "express";
import {
  loginUser,
  myProfile,
  registerUser,
  createLibrary,
  addToLibrary,
  removeFromLibrary,
  deleteLibrary,
} from "./controller.js";
import { isAuth } from "./middleware.js";

const router = express.Router();

router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.get("/user/me", isAuth, myProfile);

router.post("/user/library/create", isAuth, createLibrary);
router.post("/user/library/add", isAuth, addToLibrary);
router.post("/user/library/remove", isAuth, removeFromLibrary);
router.delete("/user/library/delete", isAuth, deleteLibrary);

export default router;
