import { check, validationResult } from "express-validator";
import { NextRequest, NextResponse } from "next/server";
import CryptoJS, { AES } from "crypto-js";
import bcrypt from "bcrypt";
import User from "@/db/models/user.model";
import { transport } from "@/helpers/mail/mail";
import conncetToDb from "@/db/config/conncetToDB";
// conncetToDb();
interface ApiResponseType {
  success: boolean;
  status: number;
  message: string;
  data: any;
  error: boolean;
  errorMessage: string;
}
export const POST = async (req: Request) => {
  let apiResponse = {
    success: false,
    status: 200,
    message: "",
    data: null,
    error: false,
    errorMessage: "",
  } as ApiResponseType;
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
    console.log(process.env.CRYPTO_SECRET_KEY);
    let { username, email, password } = result;
    if (!username || !email || !password) {
      apiResponse = {
        success: false,
        status: 400,
        message: "",
        data: null,
        error: true,
        errorMessage: "please fill the form",
      };
      return NextResponse.json({ apiResponse });
    }
    //send email
    const hashedpassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const mailOptions = {
      from: "mdwear2005@gmail.com",
      to: email,
      subjcet: "Verify your email",
      text: `your verification code is ${verificationCode}`,
    };

    // const user = await User.findOne({ email: email });

    // if (user) {
    //   // resend for email verify
    //   const mailresponse = await transport.sendMail(mailOptions);

    //   user.verificationCode = verificationCode;
    //   await user.save();
    //   apiResponse = {
    //     success: true,
    //     status: 200,
    //     message: "User already exists",
    //     data: {
    //       userId: user._id,
    //     },
    //     error: false,
    //     errorMessage: "",
    //   };
    //   return NextResponse.json({ apiResponse });
    // }

    // const newUser = new User({
    //   username,
    //   email,
    //   password: hashedpassword,
    //   verificationCode,
    // });

    // const saveduser = await newUser.save();

    // //send email ehwn user created for varify user
    // const mailresponse = await transport.sendMail(mailOptions);

    // const userid = saveduser._id;
    // if (mailOptions) {
    //   apiResponse = {
    //     success: true,
    //     status: 200,
    //     message: "User created",
    //     data: {
    //       userId: userid,
    //     },
    //     error: false,
    //     errorMessage: "",
    //   };
    // }

    apiResponse = {
      success: true,
      status: 200,
      message: "",
      data: { username, email, password },
      error: false,
      errorMessage: "",
    };

    return NextResponse.json({ apiResponse });
  } catch (error) {
    apiResponse = {
      success: false,
      status: 500,
      message: "",
      data: null,
      error: true,
      errorMessage: "error from backend",
    };
    return NextResponse.json({ apiResponse });
  }
};
