import mongoose, { type Types } from "mongoose";
import Post from "../models/Post.model.ts";
import User from "../models/User.model.ts";
import { ApiError } from "../utils/apiError.ts";
import { uploadFile } from "./storage.service.ts";

const postPopulate = [
  { path: "author", select: "username profilePic" }
];

interface FeedQuery {
  page?: unknown;
  limit?: unknown;
}

interface PostInput {
  title?: string;
  content?: string;
  image?: string;
}

const getStringParam = (value: unknown, name: string) => {
  if (typeof value !== "string") {
    throw new ApiError(400, `${name} is required`);
  }

  return value;
};

export const getPersonalizedFeed = async (userId: Types.ObjectId, { page = 1, limit = 10 }: FeedQuery) => {
  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 30);
  const skip = (pageNumber - 1) * limitNumber;

  const currentUser = await User.findById(userId).select("following");

  if (!currentUser) {
    throw new ApiError(401, "User not found");
  }

  const authors = [...currentUser.following, currentUser._id];
  const query = { author: { $in: authors } };

  const [posts, total] = await Promise.all([
    Post.find(query).populate(postPopulate).sort({ createdAt: -1 }).skip(skip).limit(limitNumber),
    Post.countDocuments(query)
  ]);

  return {
    message: "Feed fetched successfully.",
    posts,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      pages: Math.ceil(total / limitNumber),
      hasNextPage: pageNumber * limitNumber < total
    }
  };
};

export const createUserPost = async (
  authorId: Types.ObjectId,
  body: PostInput,
  file?: Express.Multer.File
) => {
  const { title, content, image = "" } = body;

  if (!title || !content) {
    throw new ApiError(400, "Title and content are required");
  }

  const imageUrl = file ? (await uploadFile(file, "post-images")).url : image;

  const post = new Post({
    author: authorId,
    title,
    content,
    image: imageUrl
  });

  await post.save();
  await post.populate(postPopulate);

  return {
    message: "Post created successfully.",
    post
  };
};

export const updateUserPost = async (
  id: unknown,
  body: PostInput,
  file?: Express.Multer.File
) => {
  const postId = getStringParam(id, "Post id");
  const updates: Record<string, unknown> = {};
  const allowedFields = ["title", "content", "image"];

  for (const field of allowedFields) {
    if (body[field as keyof PostInput] !== undefined) {
      updates[field] = body[field as keyof PostInput];
    }
  }

  if (file) {
    updates.image = (await uploadFile(file, "post-images")).url;
  }

  const post = await Post.findByIdAndUpdate(postId, updates, {
    new: true,
    runValidators: true
  }).populate(postPopulate);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return {
    message: "Post updated successfully.",
    post
  };
};

export const deleteUserPost = async (id: unknown) => {
  const postId = getStringParam(id, "Post id");

  const post = await Post.findByIdAndDelete(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return {
    message: "Post deleted successfully."
  };
};

export const findPostById = async (id: unknown) => {
  const postId = getStringParam(id, "Post id");

  if (!mongoose.isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid post id");
  }

  const post = await Post.findById(postId).populate(postPopulate);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return {
    message: "Post fetched successfully.",
    post
  };
};
