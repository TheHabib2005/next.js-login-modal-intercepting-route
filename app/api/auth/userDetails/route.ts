import conncetToDb from "@/db/config/conncetToDB";
import User from "@/db/models/user.model";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { ApiResponseType } from "../register/route";

conncetToDb();
export const POST = async (req: Request) => {
  let apiResponse = {
    success: false,
    status: 200,
    message: "",
    data: null,
    error: false,
    errorMessage: "",
  } as ApiResponseType;
  const { userId } = await req.json();
  const isUserExisting = await User.findById({ _id: userId });

  if (!isUserExisting) {
    apiResponse = {
      success: false,
      status: 200,
      message: "user not found",
      data: null,
      error: false,
      errorMessage: "user not found",
    };
    return NextResponse.json(apiResponse);
  }

  let user = await User.findById({ _id: userId }).select(["-password"]);
  const hashedUserInfo = jwt.sign(
    {
      userDetails: {
        userEmail: user.email,
        verificationCode: user.verificationCode,
      },
    },
    process.env.NEXT_PUBLIC_TOKEN_SECRET!,
    {
      expiresIn: "1d",
    }
  );
  apiResponse = {
    success: true,
    status: 200,
    message: "user found",
    data: {
      token: hashedUserInfo,
    },
    error: false,
    errorMessage: "user  found",
  };
  return NextResponse.json(apiResponse);
};
