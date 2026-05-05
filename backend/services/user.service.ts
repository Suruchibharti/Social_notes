import mongoose, { type Types } from "mongoose";
import Post from "../models/Post.model.ts";
import User from "../models/User.model.ts";
import { ApiError } from "../utils/apiError.ts";
import { validateEmail } from "../utils/validation.ts";
import { uploadFile } from "./storage.service.ts";

const publicUserFields = "-password";

interface UsersQuery {
  search?: unknown;
  page?: unknown;
  limit?: unknown;
}

const getStringParam = (value: unknown, name: string) => {
  if (typeof value !== "string") {
    throw new ApiError(400, `${name} is required`);
  }

  return value;
};

export const getCurrentUserProfile = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId)
    .select(publicUserFields)
    .populate("following", "username email profilePic")
    .populate("followers", "username email profilePic");

  return {
    message: "Profile fetched successfully.",
    user
  };
};

export const updateUserProfile = async (
  userId: Types.ObjectId,
  body: Record<string, string>,
  file?: Express.Multer.File
) => {
  const allowedFields = ["username", "email", "profilePic"];
  const updates: Record<string, string> = {};

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  }

  if (updates.email) {
    updates.email = updates.email.toLowerCase();
    validateEmail(updates.email);
  }

  if (file) {
    updates.profilePic = (await uploadFile(file, "profile-pictures")).url;
  }

  if (updates.username || updates.email) {
    const duplicateConditions = [];

    if (updates.username) {
      duplicateConditions.push({ username: updates.username });
    }

    if (updates.email) {
      duplicateConditions.push({ email: updates.email });
    }

    const existingUser = await User.findOne({
      _id: { $ne: userId },
      $or: duplicateConditions
    });

    if (existingUser) {
      if (updates.username && existingUser.username === updates.username) {
        throw new ApiError(409, "Username already exists");
      }

      throw new ApiError(409, "Email already exists");
    }
  }

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true
  }).select(publicUserFields);

  return {
    message: "Profile updated successfully.",
    user
  };
};

export const findUsers = async ({ search = "", page = 1, limit = 20 }: UsersQuery) => {
  const searchText = typeof search === "string" ? search : "";
  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(Math.max(Number(limit) || 20, 1), 50);
  const skip = (pageNumber - 1) * limitNumber;

  const query = searchText
    ? {
        $or: [
          { username: { $regex: searchText, $options: "i" } },
          { email: { $regex: searchText, $options: "i" } }
        ]
      }
    : {};

  const [users, total] = await Promise.all([
    User.find(query).select(publicUserFields).sort({ username: 1 }).skip(skip).limit(limitNumber),
    User.countDocuments(query)
  ]);

  return {
    message: "Users fetched successfully.",
    users,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      pages: Math.ceil(total / limitNumber)
    }
  };
};

export const findUserProfileById = async (id: unknown) => {
  const userId = getStringParam(id, "User id");

  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  const user = await User.findById(userId)
    .select(publicUserFields)
    .populate("following", "username profilePic")
    .populate("followers", "username profilePic");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const posts = await Post.find({ author: user._id })
    .populate("author", "username profilePic")
    .sort({ createdAt: -1 });

  return {
    message: "User profile fetched successfully.",
    user,
    posts
  };
};

export const followUserById = async (currentUserId: Types.ObjectId, targetId: unknown) => {
  const targetUserId = getStringParam(targetId, "User id");

  if (!mongoose.isValidObjectId(targetUserId)) {
    throw new ApiError(400, "Invalid user id");
  }

  if (targetUserId === currentUserId.toString()) {
    throw new ApiError(400, "You cannot follow yourself");
  }

  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    throw new ApiError(404, "User not found");
  }

  await Promise.all([
    User.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUserId } }),
    User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUserId } })
  ]);

  return {
    message: "User followed successfully."
  };
};

export const unfollowUserById = async (currentUserId: Types.ObjectId, targetId: unknown) => {
  const targetUserId = getStringParam(targetId, "User id");

  if (!mongoose.isValidObjectId(targetUserId)) {
    throw new ApiError(400, "Invalid user id");
  }

  await Promise.all([
    User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } }),
    User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } })
  ]);

  return {
    message: "User unfollowed successfully."
  };
};

export const getUserFollowing = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId)
    .select("following")
    .populate("following", "username email profilePic");

  return {
    message: "Following list fetched successfully.",
    following: user?.following || []
  };
};

export const getUserFollowers = async (id: unknown) => {
  const userId = getStringParam(id, "User id");

  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  const user = await User.findById(userId)
    .select("followers")
    .populate("followers", "username email profilePic");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return {
    message: "Followers fetched successfully.",
    followers: user.followers
  };
};
