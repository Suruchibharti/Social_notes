import {
  findUserProfileById,
  findUsers,
  followUserById,
  getCurrentUserProfile,
  getUserFollowers,
  getUserFollowing,
  unfollowUserById,
  updateUserProfile
} from "../services/user.service.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

export const getCurrentProfile = asyncHandler(async (req, res) => {
  const result = await getCurrentUserProfile(req.user!._id);
  res.json({ success: true, message: result.message, user: result.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const result = await updateUserProfile(req.user!._id, req.body, req.file);
  res.json({ success: true, message: result.message, user: result.user });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const result = await findUsers(req.query);
  res.json({
    success: true,
    message: result.message,
    users: result.users,
    pagination: result.pagination
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const result = await findUserProfileById(req.params.id);
  res.json({
    success: true,
    message: result.message,
    user: result.user,
    posts: result.posts
  });
});

export const followUser = asyncHandler(async (req, res) => {
  const result = await followUserById(req.user!._id, req.params.userId);
  res.json({ success: true, message: result.message });
});

export const unfollowUser = asyncHandler(async (req, res) => {
  const result = await unfollowUserById(req.user!._id, req.params.userId);
  res.json({ success: true, message: result.message });
});

export const getFollowing = asyncHandler(async (req, res) => {
  const result = await getUserFollowing(req.user!._id);
  res.json({ success: true, message: result.message, following: result.following });
});

export const getFollowers = asyncHandler(async (req, res) => {
  const result = await getUserFollowers(req.params.userId);
  res.json({ success: true, message: result.message, followers: result.followers });
});
