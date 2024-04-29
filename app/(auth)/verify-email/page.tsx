"use client"
import OtpInput from '@/components/OtpInput'
import { useSearchParams } from 'next/navigation'
import { useEffect, useLayoutEffect, useState } from 'react'


const VerifyEmail = () => {
    const searchParams = useSearchParams()
    const params = new URLSearchParams(searchParams);
    let userId = params.get("id")
    const [isLoading, setIsLoading] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const fetchUser = async () => {
        try {
            setIsLoading(true);
            let response = await fetch(`api/auth/userDetails`, {
                method: "POST",
                headers: {
                    "authorization": "admin"
                },
                body: JSON.stringify({ userId })
            });

          let result = await response.json();
           



            setIsLoading(false);


        } catch (error) {
            setIsLoading(false)
            console.log(error);

        }
    };

    useEffect(() => {
        fetchUser()
    }, [])



    return (
        <>
            {/* component */}
            <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12">
                <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
                    <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
                        <div className="flex flex-col items-center justify-center text-center space-y-2">
                            <div className="font-semibold text-3xl">
                                <p>Email Verification</p>
                            </div>
                            <div className="flex flex-row text-sm font-medium text-gray-400">
                                <p>We have sent a code to your email ba**@dipainhouse.com</p>
                            </div>
                        </div>
                        <div>
                            <OtpInput />
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default VerifyEmail