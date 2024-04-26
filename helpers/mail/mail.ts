import nodemailer from "nodemailer";

export const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: "mdwear2005@gmail.com",
    pass: process.env.NEXT_PUBLIC_GOOGLE_SECRET_KEY,
  },
});
