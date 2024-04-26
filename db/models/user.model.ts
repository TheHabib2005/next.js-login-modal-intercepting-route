import mongoose, { Schema } from "mongoose";
import { string } from "yup";
interface userTypes {
  username: string;
  email: string;
  password: string;
  isVerifyed: boolean;
  verificationCode: string;
  resetPasswordCode: number;
  orderHistory: [];
  wishLists: [];
  cart: [];
  accessToken: string;
}
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
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
    isVerifyed: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      required: true,
    },
    resetPasswordCode: {
      type: Number,
      default: null,
    },
    cart: [],
    wishLists: [],
    orderHistory: [],
    accessToken: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
