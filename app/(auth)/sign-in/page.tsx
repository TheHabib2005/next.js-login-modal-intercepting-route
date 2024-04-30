import SignInComponent from "@/components/sign-in";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import React from "react";


const LoginPage = () => {
  return (
    <SignInComponent />
  );
};

export default LoginPage;
