import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  profilePic: string;
  following: Types.ObjectId[];
  followers: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    profilePic: {
      type: String,
      default: ""
    },
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    timestamps: true
  }
);

userSchema.index({ username: "text", email: "text" });

export default mongoose.model<IUser>("User", userSchema);
