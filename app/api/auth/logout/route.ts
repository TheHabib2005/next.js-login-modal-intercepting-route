import conncetToDb from "@/db/config/conncetToDB";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { ApiResponseType } from "../login/route";
conncetToDb();
export const GET = async (req: Request) => {
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
    apiResponse = {
      success: true,
      status: 200,
      message: "user Logout successful",
      data: null,
      error: false,
      errorMessage: "",
    };
    const response = NextResponse.json(apiResponse);
    response.cookies.delete("auth_token");
    return response;
  } catch (error) {
    apiResponse = {
      success: false,
      status: 400,
      message: "Something went wrong in Logout User",
      data: null,
      error: true,
      errorMessage: "Something went wrong in Logout User",
    };
    return NextResponse.json(apiResponse);
  }
};
