import { log } from 'console';
import React, { useEffect, useRef, useState } from 'react'
import { clearInterval } from 'timers';

const OtpInput = ({ length = 6 }) => {

    const [successOtp, setSuccessOtp] = useState<boolean>(false)
    const [timeout, setTimeout] = useState<boolean>(false)
    const [timeTarget, settimeTarget] = useState(30)




    const userOtp = "123456";
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputRefs = useRef<HTMLInputElement[]>([]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleTimeout = () => {

        let time = timeTarget
        const interval = setInterval(() => {
            if (time > 0) {
                time = time - 1;
                settimeTarget(time);
            }
            return

        }, 1000);
    }

    useEffect(() => {

        timeTarget > 0 && handleTimeout()

    }, [timeTarget, settimeTarget])


    const handleChange = (index: number, e: any) => {
        const value = e.target.value;
        if (isNaN(value)) return;
        const newOtp = [...otp];




        // allow only one input
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // submit trigger
        const combinedOtp = newOtp.join("");
        if (combinedOtp.length === length && combinedOtp === userOtp) {
            setSuccessOtp(true)

        } else {
            setSuccessOtp(false)

        }
        // Move to next input if current field is filled
        if (value && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
        let isEmpty = newOtp.findIndex(item => item === "");
        console.log(isEmpty);

        if (isEmpty !== -1) {
            inputRefs.current[isEmpty].focus()
        } else {
            inputRefs.current[length - 1].focus()
        }

    };

    const handleClick = (index: any) => {
        inputRefs.current[index].setSelectionRange(1, 1);

        // optional
        if (index > 0 && !otp[index - 1]) {
            inputRefs.current[otp.indexOf("")].focus();
        }
    };

    const handleKeyDown = (index: any, e: any) => {
        if (
            e.key === "Backspace" &&
            !otp[index] &&
            index > 0 &&
            inputRefs.current[index - 1]
        ) {
            // Move focus to the previous input field on backspace
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerifyAccount = () => {
        alert("Verify account")
    }


    return (
        <div>
            <div className="flex flex-col space-y-16">

                <div className="flex flex-row items-center justify-between mx-auto w-full  gap-x-3">
                    {
                        otp.map((value, index) => {
                            return <div className="w-16 h-16 " key={index}>
                                <input
                                    className={`w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border  text-lg bg-white  ${successOtp ? "border-green-600 focus:border-green-600 focus:ring-1 ring-green-600" : "focus:bg-gray-50 focus:ring-1 ring-blue-700 border-gray-200"} 
                                    
                                    
                                    `}
                                    type="text"
                                    name="otp-input"
                                    autoComplete='false'
                                    value={value}
                                    disabled={successOtp}
                                    ref={(e) => inputRefs.current[index] = e}
                                    onChange={(e) => handleChange(index, e)}
                                    onClick={() => handleClick(index)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}

                                />
                            </div>


                        })
                    }
                </div>
                <div className="flex flex-col space-y-5">
                    <div>
                        {successOtp && <button className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm"
                            onClick={handleVerifyAccount}
                        >
                            Verify Account
                        </button>}
                    </div>
                    <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                        <p> dont recieve code?</p>
                        {
                            timeTarget > 0 ? <a
                                className="flex flex-row items-center text-gray-600 cursor-none"
                            >
                                Resend
                            </a> : <a
                                className="flex flex-row items-center text-blue-600 cursor-pointer"
                                onClick={() => {
                                    settimeTarget(30)
                                }}
                            >
                                Resend
                            </a>
                        }
                        <span className='ml-5'> {timeTarget > 0 && timeTarget}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OtpInput