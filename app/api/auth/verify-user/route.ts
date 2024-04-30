import conncetToDb from "@/db/config/conncetToDB";
import User from "@/db/models/user.model";
import { NextResponse } from "next/server";
import { ApiResponseType } from "../register/route";
import CryptoJS, { AES } from "crypto-js";
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
    const body = await req.json();

    const decryptData = (encryptedData: string, secretKey: string) => {
      const decryptedData = AES.decrypt(encryptedData, secretKey).toString(
        CryptoJS.enc.Utf8
      );
      return JSON.parse(decryptedData);
    };

    const decodeResult = decryptData(
      body,
      process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY!
    );
    console.log(decodeResult);

    let userEmailverificationCode = decodeResult;

    const otpMatchUser = await User.findOne({
      verificationCode: userEmailverificationCode,
    });

    if (!otpMatchUser) {
      apiResponse = {
        success: false,
        status: 200,
        message: "you otp verification failed",
        data: null,
        error: false,
        errorMessage: "you otp verification failed",
      };
      return NextResponse.json(apiResponse);
    }

    otpMatchUser.isVerifyed = true;
    otpMatchUser.verificationCode = "0";
    await otpMatchUser.save();

    apiResponse = {
      success: true,
      status: 200,
      message: "email verification successful",
      data: null,
      error: false,
      errorMessage: "",
    };

    return NextResponse.json(apiResponse);
  } catch (error) {
    console.log(error);

    apiResponse = {
      success: false,
      status: 400,
      message: "something went wrong in email verification ",
      data: null,
      error: true,
      errorMessage: "something went wrong in email verification ",
    };
    return NextResponse.json(apiResponse);
  }
};
