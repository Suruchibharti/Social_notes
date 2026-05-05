import { ImageKit } from "@imagekit/nodejs";
import { ApiError } from "../utils/apiError.ts";

const getFileExtension = (fileName: string) => {
  const extension = fileName.split(".").pop();
  return extension ? `.${extension}` : ".jpg";
};

const getImageKitClient = () => {
  if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    throw new ApiError(500, "Image upload service is not configured");
  }

  return new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
  });
};

export const uploadFile = async (file: Express.Multer.File, folder: string) => {
  const imagekit = getImageKitClient();
  const fileName = `${folder}-${Date.now()}${getFileExtension(file.originalname)}`;

  const result = await imagekit.files.upload({
    file: file.buffer.toString("base64"),
    fileName,
    folder: `/social-notes/${folder}`
  });

  if (!result.url) {
    throw new ApiError(500, "Image upload failed");
  }

  return {
    ...result,
    url: result.url
  };
};
