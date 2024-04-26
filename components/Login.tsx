"use client"
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useFormik } from "formik"
import { number } from 'yup';
import { SignInValidactionSchema } from '@/yup-schema';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
interface initialValuesType {

    email: string;
    password: string | number;

}
const LoginComponent = () => {


    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState([])
    const router = useRouter()

    let initialValues: initialValuesType = {

        email: "",
        password: "",

    }


    const handleLogin = async (userInfo: initialValuesType) => {

        try {
            setLoading(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/authentication/signin/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userInfo)
            });
            const data = await response.json();
            if (data.success) {
                toast.success(data.message);
                console.log(data.savedUser);
                setUserData(data.savedUser)
                router.push("/userDetails")
            }
            if (data.error) {
                toast.error(data.error);
            }

            setLoading(false)
        } catch (error) {
            console.log(error);
        }
    }



    const { handleSubmit, handleChange, handleReset, values, errors } = useFormik({
        initialValues,
        validationSchema: SignInValidactionSchema,
        onSubmit: (value) => {
            handleLogin(value)
            handleReset({
                username: "",
                email: "",
                password: "",
            });
        },
        onReset: () => {
            initialValues = {

                email: "",
                password: "",
            }
        }
    })



    return (
        <div
            className=" bg-primary overflow-y-auto  overflow-x-hidden fixed top-0 right-0 left-0 z-50 h-full items-center justify-center flex"
        >
            <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                <div className="relative bg-secendery rounded-lg shadow">
                    <div className="p-5">
                        <h3 className="text-xl mb-3 font-medium text-center text-white"> Wellcome to CDX-SHOP</h3>

                        <div className="text-center">
                            <p className="mb-3 text-xl font-semibold leading-5 text-white">
                                Login in Your Account
                            </p>
                            <p className="mt-2 text-sm leading-4 text-white">
                                You must be logged in to perform this action.
                            </p>
                        </div>

                        <div className="mt-7 flex flex-col gap-2">

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


                        </div>

                        <div className="flex w-full items-center gap-2 py-6 text-sm text-white">
                            <div className="h-px w-full bg-slate-200"></div>
                            OR
                            <div className="h-px w-full bg-slate-200"></div>
                        </div>

                        <form onSubmit={handleSubmit}>

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

                            <p className="mb-3 mt-2 text-sm text-gray-500">
                                <a
                                    href="/forgot-password"
                                    className="text-blue-800 hover:text-blue-600"
                                >
                                    Reset your password?
                                </a>
                            </p>
                            <button
                                type="submit"
                                className="inline-flex w-full items-center justify-center rounded-lg bg-black p-2 py-3 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-gray-400"
                                disabled={loading}
                            >
                                Login
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-white">
                            Already Have a Account ?
                            <Link href="/signup" className="font-medium text-[#4285f4]">
                                {" "}create account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginComponent