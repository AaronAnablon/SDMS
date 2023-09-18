"use client"

import AdminAccountModal from "@/utils/AdminAccountModal";
import ConfirmationModal from "@/utils/ConfirmationModal";
import useLoading from "@/utils/Loading";
import { useProfileData } from "@/app/libs/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { url, headers } from "@/app/libs/api"
import Layout from "@/components/Layout";


const Page = () => {
    const [email, setEmail] = useState("");
    const { profileData } = useProfileData();
    const { loading, startLoading, stopLoading } = useLoading();
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("")


    const emailData = {
        email,
        subject: "Change password link",
        message: `Greetings! This is your password link. Please keep it private and do not share it with other students.`,
        html: `<p>Greetings! This is your password link. Please keep it private and do not share it with other students.</p>
                <a href="${url}/Admin/AdminSettings/AdminAccount/EnterPassword?email=${email}">Click this.</a> 
                <p>Ticket Number:</p>`,
    };

    useEffect(() => {
        if (profileData && profileData.id !== " ") {
            setEmail(profileData.email)
        }
    }, [])

    const handleSendCode = async (e) => {
        e.preventDefault();
        startLoading();
        try {

            // const response = await axios.get(`${url}/api/findByEmail/${email}`, { headers });
            // console.log(response)
            // if (response.data !== null) {
            const sendCode = await axios.post(`${url}/api/Mailer`, emailData, { headers });
            setSent(true);
            // } else {
            //     setError("No email found!")
            // }

        } catch (error) {
            setError("Something went wrong!")
            console.error('Error:', error);
        } finally {
            stopLoading();
        }
    };

    return (
        <Layout>
            <AdminAccountModal>
                <div className="grid justify-center items-center py-6 bg-white px-10">
                    {error !== "" &&
                        <ConfirmationModal>
                            <div className="p-10 grid justify-center gap-4 items-center">
                                <div>
                                    {error}
                                </div>
                                <button onClick={() => setError("")} className="bg-amber-300 px-4 py-2 rounded-lg">Okay</button>
                            </div>
                        </ConfirmationModal>
                    }
                    <div className="font-bold text-center text-2xl">
                        {profileData.id !== " " ? 'Change Password' : 'Forgot Password'}
                    </div>
                    <div className="text-xs text-center italic py-4">
                        {sent ? 'Please verify if it is you' :
                            `Please ${profileData.id !== " " ? "enter" : "correct"} the needed information below.`}
                    </div>
                    {sent && <div className="whitespace-normal my-2 text-center text-xs rounded-[2rem] bg-green-300 p-2">
                        Reset link has been sent to your <p>email! Please check.</p> </div>}
                    <form className="grid gap-5" onSubmit={handleSendCode}>
                        <input
                            type="email"
                            className="w-full text-xs px-3 py-2 border"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email"
                            required
                        ></input>
                        <button
                            type="submit"
                            className={`text-white py-2 w-full ${loading ? 'bg-gray-600' : "bg-purple-600"}`}
                        >
                            {sent ? 'Resend verification link' : 'Submit'}
                        </button>
                    </form>
                </div>
            </AdminAccountModal>
        </Layout>
    );
};

export default Page;
