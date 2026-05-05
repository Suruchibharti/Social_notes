import { Router } from "express";
import {
  followUser,
  getAllUsers,
  getCurrentProfile,
  getFollowers,
  getFollowing,
  getUserById,
  unfollowUser,
  updateProfile
} from "../controllers/user.controller.ts";
import { protect } from "../middleware/auth.middleware.ts";
import { upload } from "../middleware/upload.middleware.ts";

const router = Router();

router.get("/profile", protect, getCurrentProfile);
router.put("/profile", protect, upload.single("profilePic"), updateProfile);
router.get("/users", protect, getAllUsers);
router.get("/users/:id", protect, getUserById);
router.post("/follow/:userId", protect, followUser);
router.delete("/follow/:userId", protect, unfollowUser);
router.get("/following", protect, getFollowing);
router.get("/followers/:userId", protect, getFollowers);

export default router;
