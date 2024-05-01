import { check, validationResult } from "express-validator";
import { NextRequest, NextResponse } from "next/server";
import CryptoJS, { AES } from "crypto-js";
import bcrypt from "bcrypt";
import User from "@/db/models/user.model";
import { transport } from "@/helpers/mail/mail";
import conncetToDb from "@/db/config/conncetToDB";
import { headers } from "next/headers";
conncetToDb();
export interface ApiResponseType {
  success: boolean;
  status: number;
  message: string;
  data: any;
  error: boolean;
  errorMessage: string;
}
export const POST = async (req: Request) => {
  const encryptData = (data: any, secretKey: any): string => {
    const encryptedData = AES.encrypt(
      JSON.stringify(data),
      secretKey
    ).toString();
    return encryptedData;
  };

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
  // Place the 'decryptData' function in your project
  try {
    let body = await req.json();

    const decryptData = (encryptedData: string, secretKey: string) => {
      const decryptedData = AES.decrypt(encryptedData, secretKey).toString(
        CryptoJS.enc.Utf8
      );
      return JSON.parse(decryptedData);
    };
    const result = decryptData(
      body,
      process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY!
    );

    let { username, email, password } = result;
    if (!email || !password) {
      apiResponse = {
        success: false,
        status: 400,
        message: "",
        data: null,
        error: true,
        errorMessage: "please fill the form",
      };
      return NextResponse.json(apiResponse);
    }
    //send email

    const user = await User.findOne({ email: email });
    if (!user) {
      apiResponse = {
        success: false,
        status: 400,
        message: "User not exists",
        data: null,
        error: true,
        errorMessage: "User not exists",
      };
      return NextResponse.json(apiResponse);
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      apiResponse = {
        success: false,
        status: 400,
        message: "you credentials is wrong!",
        data: null,
        error: true,
        errorMessage: "you credentials is wrong!",
      };
      return NextResponse.json(apiResponse);
    }
    let auth_token = encryptData(
      user._id,
      process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY
    );
    apiResponse = {
      success: true,
      status: 200,
      message: "user login successful",
      data: null,
      error: false,
      errorMessage: "",
    };
    const response = NextResponse.json(apiResponse);
    response.cookies.set("auth_token", auth_token, {
      httpOnly: true,
    });
    return response;
  } catch (error) {
    apiResponse = {
      success: false,
      status: 500,
      message: "",
      data: null,
      error: true,
      errorMessage: "error from backend",
    };
    return NextResponse.json(apiResponse);
  }
};
