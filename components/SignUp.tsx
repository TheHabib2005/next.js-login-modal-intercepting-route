"use client"
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import CryptoJS, { AES } from 'crypto-js';
import { useFormik } from "formik"
import { SignUpValidactionSchema } from '@/yup-schema';
import bcrypt from "bcrypt"
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { delay } from '@/helpers';
interface initialValuesType {
    username: string;
    email: string;
    password: string | number;

}
const SignupComponent = () => {


    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState([])
    const [error, setError] = useState(false)
    const router = useRouter()

    let initialValues: initialValuesType = {
        username: "",
        email: "",
        password: "",

    }

    const encryptData = (data: any, secretKey: any): string => {
        const encryptedData = AES.encrypt(JSON.stringify(data), secretKey).toString();
        return encryptedData;
    };

    console.log(process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY);





    const createAccount = async (userInfo: initialValuesType) => {

        const payload = {
            username: userInfo.username,
            email: userInfo.email,
            password: userInfo.password
        };

        let userData = encryptData(payload, process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY);

        try {
            setLoading(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            const { apiResponse } = await response.json();

            if (apiResponse.success) {
                setUserData(apiResponse.data)
                toast.success("User Created Successfully!")
                await delay(1000);
                router.push(`/verify-email?id=${apiResponse.data.userId}`)

            }

            if (apiResponse.error) {
                setError(true)
                toast.error("Something went wrong")
            }

            setLoading(false)
        } catch (error) {
            console.log(error);
            setError(true)
            setLoading(false)
        }
    }



    const { handleSubmit, handleChange, handleReset, values, isSubmitting, errors } = useFormik({
        initialValues,
        validationSchema: SignUpValidactionSchema,
        onSubmit: (value) => {
            createAccount(value)
            handleReset({
                username: "",
                email: "",
                password: "",
            });
        },
        onReset: () => {
            initialValues = {
                username: "",
                email: "",
                password: "",
            }
        }
    })


    return (
        <div
            className="relative h-screen items-center justify-center flex"
        >

            {loading && <div className='absolute top-0 left-0 bg-gray-800/60 z-50 w-full  flex items-center justify-center h-screen'>
                <svg className='w-20 h-20' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><linearGradient id="a11"><stop offset="0" stop-color="#000000" stop-opacity="0"></stop><stop offset="1" stop-color="#000000"></stop></linearGradient><circle fill="none" stroke="url(#a11)" stroke-width="15" stroke-linecap="round" stroke-dasharray="0 44 0 44 0 44 0 44 0 360" cx="100" cy="100" r="70" transform-origin="center"><animateTransform type="rotate" attributeName="transform" calcMode="discrete" dur="2" values="360;324;288;252;216;180;144;108;72;36" repeatCount="indefinite"></animateTransform></circle></svg>
            </div>}
            <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                <div className="relative bg-secendery rounded-lg shadow">
                    <div className="p-5">
                        <h3 className="text-xl mb-3 font-medium text-center text-black"> Wellcome to CDX-SHOP</h3>

                        <div className="text-center">
                            <p className="mb-3 text-xl font-semibold leading-5 text-black">
                                Create New Account
                            </p>
                            <p className="mt-2 text-sm leading-4 text-black">
                                You must be logged in to perform this action.
                            </p>
                        </div>

                        <div className="mt-7 flex flex-col gap-2">
                            <button className="inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60">
                                <Image
                                    src="https://www.svgrepo.com/show/512317/github-142.svg"
                                    alt="GitHub"
                                    className="h-[18px] w-[18px] "
                                    height={100}
                                    width={100}
                                />
                                Continue with GitHub
                            </button>

                            <button className="inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60">
                                <Image
                                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                                    alt="Google"
                                    className="h-[18px] w-[18px] "
                                    height={100}
                                    width={100}
                                />
                                Continue with Google
                            </button>

                            {/* <button className="inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60">
                                <Image
                                    src="https://www.svgrepo.com/show/448234/linkedin.svg"
                                    alt="Google"
                                    className="h-[18px] w-[18px] "
                                    width={100}
                                    height={100}
                                />
                                Continue with LinkedIn
                            </button> */}
                        </div>

                        <div className="flex w-full items-center gap-2 py-6 text-sm text-black">
                            <div className="h-px w-full bg-slate-200"></div>
                            OR
                            <div className="h-px w-full bg-slate-200"></div>
                        </div>
                        {error && <div>Something Want Wrong!</div>}
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="username" className="sr-only">
                                    username
                                </label>
                                <input
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 text-black focus:ring-black  focus:ring-offset-1 mb-2"
                                    placeholder="Enter your username..."
                                    onChange={handleChange}
                                    value={values.username}
                                />
                                {errors.username && <p className='text-red-600 mb-2'>{errors.username}</p>}
                            </div>
                            <div>
                                <label htmlFor="email" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 text-black focus:ring-black focus:ring-offset-1"
                                    placeholder="Email Address"
                                    onChange={handleChange}
                                    value={values.email}

                                />
                                {errors.email && <p className='text-red-600 mb-2'>{errors.email}</p>}

                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 text-black focus:ring-black focus:ring-offset-1"
                                    placeholder="Password"
                                    onChange={handleChange}
                                    value={values.password}

                                />
                                {errors.password && <p className='text-red-600 mb-2'>{errors.password}</p>}

                            </div>


                            <button
                                type="submit"
                                className="inline-flex w-full items-center justify-center  mt-3 rounded-lg bg-black p-2 py-3 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-gray-400"
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Create Account"}
                            </button>
                        </form>
                        <div className="mt-6 text-center text-sm text-black">
                            Already Have a Account ?
                            <Link href="/login" className="font-medium text-[#4285f4]">
                                {" "}Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupComponent