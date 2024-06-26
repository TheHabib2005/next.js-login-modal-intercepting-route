import conncetToDb from "@/db/config/conncetToDB";
import User from "@/db/models/user.model";

import { NextResponse } from "next/server";
import { ApiResponseType } from "../register/route";

import { AES } from "crypto-js";
import { headers } from "next/headers";

conncetToDb();
export const POST = async (req: Request) => {
  let authorizationRole = process.env.NEXT_PUBLIC_AUTHORIZATION_SECRET_KEY!;
  let apiResponse = {
    success: false,
    status: 200,
    message: "",
    data: null,
    error: false,
    errorMessage: "",
  } as ApiResponseType;
  const header = headers();
  if (!header.get("authorization")?.startsWith(authorizationRole)) {
    apiResponse = {
      success: false,
      status: 200,
      message: "unAuthorized User",
      data: null,
      error: false,
      errorMessage: "unAuthorized User",
    };
    return NextResponse.json(apiResponse);
  }
  try {
    const { userId } = await req.json();
    const encryptData = (data: any, secretKey: any): string => {
      const encryptedData = AES.encrypt(
        JSON.stringify(data),
        secretKey
      ).toString();
      return encryptedData;
    };
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

    // const hashedUserInfo = jwt.sign(
    //   {
    //     userDetails: {
    //       // userEmail: user.email,
    //       // verificationCode: user.verificationCode,
    //       name: "generated",
    //     },
    //   },
    //   process.env.NEXT_PUBLIC_TOKEN_SECRET!,
    //   {
    //     expiresIn: "1d",
    //   }
    // );

    const userDetails = {
      userEmail: user.email,
      verificationCode: user.verificationCode,
    };

    let userData = encryptData(
      userDetails,
      process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY
    );

    apiResponse = {
      success: true,
      status: 200,
      message: "user found",
      data: {
        userData,
      },
      error: false,
      errorMessage: "user  found",
    };

    return NextResponse.json(apiResponse);
  } catch (error) {
    apiResponse = {
      success: false,
      status: 400,
      message: "something went wrong",
      data: null,
      error: true,
      errorMessage: "something went wrong",
    };
    return NextResponse.json(apiResponse);
  }
};
