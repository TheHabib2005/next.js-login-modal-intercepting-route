"use client";
import OtpInput from "@/components/OtpInput";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useLayoutEffect, useState } from "react";
import jwt from "jsonwebtoken";
import CryptoJS, { AES } from 'crypto-js';
import conncetToDb from "@/db/config/conncetToDB";
import toast from "react-hot-toast";
conncetToDb();
const VerifyEmail = () => {
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);
    const router = useRouter()
    let userId = params.get("id");
    const [isLoading, setIsLoading] = useState(false);
    const [userInfo, setUserInfo] = useState<any>({});
    const [responseError, setResponseError] = useState({
        error: false,
        message: ""
    });
    const fetchUser = async () => {
        let authorizationRole = process.env.NEXT_PUBLIC_AUTHORIZATION_SECRET_KEY!
        try {
            setIsLoading(true);
            let response = await fetch(`api/auth/userDetails`, {
                method: "POST",
                headers: {
                    authorization: authorizationRole,
                },
                body: JSON.stringify({ userId }),
            });
            let result = await response.json();
            if (result.error) {
                setResponseError({
                    error: true,
                    message: result.errorMessage
                })
            } else {
                setResponseError({
                    error: false,
                    message: ""
                })
            }

            const decryptData = (encryptedData: string, secretKey: string) => {
                const decryptedData = AES.decrypt(encryptedData, secretKey).toString(
                    CryptoJS.enc.Utf8
                );
                return JSON.parse(decryptedData);
            };
            const decodeResult = decryptData(
                result.data.userData,
                process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY!
            );
            setUserInfo(decodeResult);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setResponseError({
                error: true,
                message: "something went wrong"
            })
            console.log(error);
        }
    };

    useLayoutEffect(() => {
        fetchUser();


    }, []);




    if (responseError.error) {
        return <div className="w-full h-screen flex items-center justify-center flex-col gap-y-5">
            <p className="text-2xl capitalize"> {responseError.message}</p>
            <button
                className="p-3 bg-rose-600 capitalize text-xl text-white rounded-md cursor-pointer"
                onClick={() => {
                    router.refresh()
                }}>try again</button>
        </div>
    }

    return (
        <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12">
            {isLoading ? <div className='absolute top-0 left-0 bg-gray-800/60 z-50 w-full  flex items-center justify-center h-screen'>
                <svg className='w-20 h-20' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><linearGradient id="a11"><stop offset="0" stop-color="#000000" stop-opacity="0"></stop><stop offset="1" stop-color="#000000"></stop></linearGradient><circle fill="none" stroke="url(#a11)" stroke-width="15" stroke-linecap="round" stroke-dasharray="0 44 0 44 0 44 0 44 0 360" cx="100" cy="100" r="70" transform-origin="center"><animateTransform type="rotate" attributeName="transform" calcMode="discrete" dur="2" values="360;324;288;252;216;180;144;108;72;36" repeatCount="indefinite"></animateTransform></circle></svg>
            </div> : <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
                <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
                    <div className="flex flex-col items-center justify-center text-center space-y-2">
                        <div className="font-semibold text-3xl">
                            <p>Email Verification</p>
                        </div>
                        <div className="flex flex-row text-sm font-medium text-gray-400">
                            <p>We have sent a code to your email {userInfo && userInfo?.userEmail}</p>
                        </div>
                    </div>
                    <div>
                        <OtpInput userOtp={userInfo?.verificationCode} />
                    </div>
                </div>
            </div>}

        </div>
    );
};

export default VerifyEmail;
