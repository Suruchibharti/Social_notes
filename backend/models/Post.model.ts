import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPost extends Document {
  author: Types.ObjectId;
  title: string;
  content: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
  
    },
    image: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true
  }
);

postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ title: "text", content: "text" });

export default mongoose.model<IPost>("Post", postSchema);
