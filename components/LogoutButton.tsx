"use client"

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const LogoutButton = () => {

    const [isLoading, setIsLoading] = useState<Boolean>(false)

    const router = useRouter()
    const handleLogout = async () => {
        try {
            setIsLoading(true)
            let response = await fetch("/api/auth/logout", {
                method: "GET",
                headers: {
                    "authorization": process.env.NEXT_PUBLIC_AUTHORIZATION_SECRET_KEY!
                }
            });
            let result = await response.json();
            if (result.success) {
                toast.success("Logout Successfully")
                router.push("/sign-in")
            }
            if (result.error) {
                toast.error("SomeThing Want Wrong!")
            }

            setIsLoading(false)
        } catch (error) {
            console.log(error);
            setIsLoading(false)
            toast.error("SomeThing Want Wrong!")

        }
    }

    return (
        <button className='cursor-pointer text-xl p-3 rounded-md bg-blue-600 text-white'
            onClick={handleLogout}
        >{isLoading ? "Loading..." : "Logout"}</button>
    )
}

export default LogoutButton