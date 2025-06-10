"use client";

import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/Basic/Button";
import Image from "next/image";
import { Coins } from "lucide-react";

const LoginForm = () => {
    const { data } = useSession();

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

    return (
        <div className="flex flex-col md:flex-row h-screen">
            {/* Left Side: Image */}
            <div
                className="w-full md:w-1/2 h-1/3 md:h-full"
                style={{
                    backgroundImage:
                        "url('https://plus.unsplash.com/premium_photo-1681469490747-8926a02f901e?q=80&w=2958&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                }}
            ></div>

            {/* Right Side: Login Form */}
            <div className="flex items-center justify-center w-full md:w-1/2 h-2/3 md:h-full bg-white">
                <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md mx-4">
                    <div className="flex flex-col items-center space-y-4">
                        <Coins className="w-10 h-10 text-black mb-4" />
                        <div className="items-center px-6">
                            <h1 className="text-2xl md:text-4xl font-bold text-black text-center">My Budget Buddy Personal Finance Dashboard</h1>
                        </div>
                        <p className="text-center text-slate-700">Unlock a bird&apos;s eye view of your finances</p>
                        <Button
                            onClick={() => signIn("google", { callbackUrl })}
                            className="flex items-center justify-center w-full gap-2 px-4 py-2 mt-6 transition duration-150 border rounded-lg border-slate-200 text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow"
                            type={undefined}
                            disabled={undefined}
                            name={undefined}
                            href={undefined}
                        >
                            <Image
                                className={`${data?.user && "mr-2"} h-8 w-8 rounded-full`}
                                src={data?.user?.image || "https://www.svgrepo.com/show/475656/google-color.svg"}
                                loading="lazy"
                                width={14}
                                height={14}
                                alt="google logo"
                            />
                            <div className={data?.user ? "text-sm" : "text-md"}>
                                {data?.user && <p className="text-xs">{data?.user?.name}</p>}
                                Continue with Google
                            </div>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
