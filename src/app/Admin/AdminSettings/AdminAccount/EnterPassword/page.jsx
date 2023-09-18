"use client"

import { useState, useEffect } from "react";
import { url, headers } from "@/app/libs/api"
import axios from "axios";
import useLoading from "@/utils/Loading";
import ConfirmationModal from "@/utils/ConfirmationModal";
import { useRouter, useSearchParams } from 'next/navigation'
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import AdminAccountModal from "@/utils/AdminAccountModal";
const Page = () => {
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const { loading, startLoading, stopLoading } = useLoading()
    const [message, setMessage] = useState()
    const [responseData, setResponseData] = useState()
    const route = useRouter()
    const [notPassword, setNotPassword] = useState(false)
    const { data: session } = useSession()

    const searchParams = useSearchParams()
    const emailParams = searchParams.get('email')

    const handlePassword = async (e) => {
        e.preventDefault()
        startLoading()
        try {
            const response = await axios.get(`${url}/api/findByEmail/${emailParams}`, { headers });
            console.log(response)
            if (response) {
                const changed = await axios.put(`${url}/api/changePassword/${response.data[0].id}`, {
                    password
                }, { headers });
                setResponseData("success")
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setResponseData("failed")
        } finally {
            stopLoading()
        }
    };

    useEffect(() => {
        if (password !== confirmPassword) {
            setNotPassword(true)
        }
        if (password === confirmPassword) {
            setNotPassword(false)
        }
    }, [confirmPassword, password])


    useEffect(() => {
        if (responseData === "success") {
            const timer = setTimeout(() => {
                setMessage(true)
                if (!session) {
                    signIn('credentials', {
                        email: emailParams,
                        password: confirmPassword,
                        redirect: false,
                    });
                }
                route.push('/Admin/AdminDashboard')
            }, 1000);
            return () => {
                clearTimeout(timer);
            };
        }
    }, [responseData]);


    return (
        <Layout>
            <AdminAccountModal>
                <div className="grid bg-white py-5 px-12">
                    {responseData === "success" && <ConfirmationModal>
                        <div>
                            <div className="flex flex-col justify-center p-7 justify-center">
                                <div className="text-2xl font-bold whitespace-normal text-center ">
                                    SUCCESSFULLY CHANGED PASSWORD!
                                </div>
                                <div className="text-center italic text-sm">Redirecting you now to the home page.</div>
                                <span className="loader" />
                            </div>
                        </div>
                    </ConfirmationModal>}

                    {responseData === "failed" && <ConfirmationModal>
                        <div>
                            <div className="flex flex-col justify-center p-7 justify-center">
                                <div className="text-2xl font-bold whitespace-normal text-center ">
                                    PASSWORD CHANGE FAILED!
                                </div>
                                <button onClick={() => setResponseData("")} className="bg-amber-300 py-2 px-4 rounded-lg">Okay</button>
                            </div>
                        </div>
                    </ConfirmationModal>}

                    <div className="text-2xl text-center font-bold">New Password</div>
                    <div className="text-sm text-center italic">Change your password</div>
                    <form className="grid my-4 gap-5" onSubmit={handlePassword}>
                        <input type="password"
                            className="border p-2 text-sm border-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="password" required />
                        <input type="password"
                            placeholder="confirm password"
                            className={`border ${notPassword && "border-red-600"} p-2 text-sm border-2`}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required />
                        <button type="submit"
                            disabled={notPassword}
                            className={`py-2 text-white px-4 ${loading ? "bg-gray-600" : "bg-purple-800"} `}>
                            {loading ? "Submiting" : "Submit"}
                        </button>
                    </form>
                </div>

            </AdminAccountModal>
        </Layout>
    );
}

export default Page;