import mongoose, { Document, Schema } from "mongoose";

export interface ILibrary {
  name: string;
  songs: string[];
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  libraries: ILibrary[];
}

const librarySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    songs: [
      {
        type: String,
      },
    ],
  },
  { _id: false },
);

const schema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    libraries: {
      type: [librarySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model<IUser>("User", schema);
