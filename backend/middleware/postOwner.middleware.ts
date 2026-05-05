import Post from "../models/Post.model.ts";
import { ApiError } from "../utils/apiError.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

export const authorizePostOwner = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (!req.user || post.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only modify your own posts");
  }

  next();
});
