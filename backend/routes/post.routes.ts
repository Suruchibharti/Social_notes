import { Router } from "express";
import {
  createPost,
  deletePost,
  getFeed,
  getPostById,
  updatePost
} from "../controllers/post.controller.ts";
import { protect } from "../middleware/auth.middleware.ts";
import { authorizePostOwner } from "../middleware/postOwner.middleware.ts";
import { upload } from "../middleware/upload.middleware.ts";

const router = Router();

router.get("/feed", protect, getFeed);
router.post("/", protect, upload.single("image"), createPost);
router.get("/:id", protect, getPostById);
router.put("/:id", protect, authorizePostOwner, upload.single("image"), updatePost);
router.delete("/:id", protect, authorizePostOwner, deletePost);

export default router;
