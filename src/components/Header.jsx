"use client"

import Image from "next/image";
import Logo from "../../public/Logo.png"
import { useEffect, useState } from "react";
import LoginButton from "@/utils/LoginButton";
import RegisterButton from "@/utils/RegisterButton";
import AboutButton from "@/utils/AboutButton";
import ContactButton from "@/utils/ContactButton";
import Homebutton from "@/utils/Homebutton";
import Menu from "@/utils/Menu";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useProfileData } from "@/app/libs/store";

const Header = ({ setViewPort }) => {
    //login or register forms for active to display
    const [active, setActive] = useState('')
    const [isopen, setIsOpen] = useState(false);
    const [header, setHeader] = useState(false);
    const { data: session } = useSession()
    const router = useRouter()
    const { getProfileData, profileData } = useProfileData()

    const currentPath = usePathname();

    useEffect(() => {
        if (currentPath === "/Login") {
            setActive('button1');
            setHeader(false);
        } else if (currentPath === "/Register") {
            setActive('button2');
            setHeader(false);
        } else if (currentPath.includes("/Admin")) {
            setHeader(true);
        } else if (currentPath === "/Admin/AdminLogin") {
            setHeader(true);
        }
    }, []);

    useEffect(() => {
        if (session && session.id) {
            getProfileData(session.id)
        }
    }, [session])


    // const handleDeleteFile = async () => {
    //     try {
    //         const response = await axios.delete(`${url}/api/removeFile`, {
    //             data: {
    //                 fileName: ['file3.jsx'],
    //                 // fileDir: 'fileToDelete',
    //                 fileDir: 'src/components',
    //             },
    //         });
    //         console.log(response.data.message);
    //     } catch (error) {
    //         console.error('Error deleting file:', error);
    //     }

    // };

    // const tenMinutes = 3 * 60 * 1000;
    // useEffect(() => {
    //     const time = setTimeout(handleDeleteFile, tenMinutes);
    //     return () => clearTimeout(time);
    // }, []);


    return (
        <div className="fixed top-0 w-screen bg-red-900 overflow-hidden h-16 flex font-serif justify-between z-50">
            <div className="flex justify-start items-center">
                <div className="w-16 flex p-3 overflow h-full">
                    <Image width={400} height={300} className="object-cover" src={Logo} alt="Logo" />
                </div>
                {/* font-romanesco */}
                <span className=" text-white md:flex hidden text-2xl items-center">Bulacan State University</span>
            </div>
            {header ?
                <div className="flex italic text-white pr-4 text-2xl items-center justify-end">
                    <div className="overflow-hidden flex relative items-center h-16">
                        <div className={`h-0 w-0 border-y-[4rem] border-y-red-900 border-r-[6rem] ${active === "button1" ? 'border-[#ebac85]' : 'border-orange-300'}`}></div>
                        <div className={`h-0 w-0 absolute left-11 z-10 border-y-[4rem] border-y-transparent border-r-[6rem] ${active === "button1" ? 'border-r-[#ebac85]' : 'border-r-red-900'}`}></div>
                    </div>
                    <div>Prefect of Discipline
                    </div>
                </div>
                : <>
                    <div className="flex w-full md:hidden cursor-pointer text-white pr-4 text-2xl items-center justify-end">
                        <div onClick={() => setIsOpen(!isopen)}>
                            <GiHamburgerMenu size={32} />
                        </div>

                        {isopen &&
                            <div className="fixed inset-0 top-16 z-20">
                                {session && session.status === "Registered" && session.role === "user" ?
                                    <div className="bg-red-900 flex flex-col gap-3 p-8 h-screen">
                                        <Homebutton setViewPort={setViewPort} />
                                        <ContactButton setViewPort={setViewPort} />
                                        <AboutButton setViewPort={setViewPort} />
                                        <Menu profile={profileData.profile} />
                                    </div>
                                    :
                                    <>
                                        <LoginButton active={active} />
                                        <RegisterButton active={active} />
                                    </>}
                            </div>

                        }

                    </div>
                    <div className="md:flex hidden cursor-pointer text-white text-2xl items-center justify-end">
                        {session && session.role === "user" ?
                            <>
                                <Homebutton setViewPort={setViewPort} />
                                <ContactButton setViewPort={setViewPort} />
                                <AboutButton setViewPort={setViewPort} />
                                <Menu profile={profileData.profile} />
                            </>
                            :
                            <>
                                <LoginButton active={active} />
                                <RegisterButton active={active} />
                            </>
                        }
                    </div>
                </>
            }
        </div>
    );
}

export default Header;