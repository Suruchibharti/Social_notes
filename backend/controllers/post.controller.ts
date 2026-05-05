import {
  createUserPost,
  deleteUserPost,
  findPostById,
  getPersonalizedFeed,
  updateUserPost
} from "../services/post.service.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

export const getFeed = asyncHandler(async (req, res) => {
  const result = await getPersonalizedFeed(req.user!._id, req.query);
  res.json({
    success: true,
    message: result.message,
    posts: result.posts,
    pagination: result.pagination
  });
});

export const createPost = asyncHandler(async (req, res) => {
  const result = await createUserPost(req.user!._id, req.body, req.file);
  res.status(201).json({ success: true, message: result.message, post: result.post });
});

export const updatePost = asyncHandler(async (req, res) => {
  const result = await updateUserPost(req.params.id, req.body, req.file);
  res.json({ success: true, message: result.message, post: result.post });
});

export const deletePost = asyncHandler(async (req, res) => {
  const result = await deleteUserPost(req.params.id);
  res.json({ success: true, message: result.message });
});

export const getPostById = asyncHandler(async (req, res) => {
  const result = await findPostById(req.params.id);
  res.json({ success: true, message: result.message, post: result.post });
});
