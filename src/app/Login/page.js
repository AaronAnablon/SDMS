"use client"

import { useState, useEffect } from "react";
import { useSession, signIn } from 'next-auth/react';
import Link from "next/link";
import Layout from "@/components/Layout";
import AccountModal from "@/utils/AccountModal";
import ConfirmationModal from "@/utils/ConfirmationModal";
import useLoading from "@/utils/Loading";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false)
  const route = useRouter()



  // const { data: session, status } = useSession();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    await signIn('credentials', {
      email: email,
      password: password
    });

  };

  useEffect(() => {
    if (session) {
      const timer = setTimeout(() => {
        setLoading(false)
        console.log(session)
        setSuccess(true);
        route.push('/')
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [session]);

  return (
    <Layout>
      <AccountModal>
        <div className="bg-white p-6 shadow-lg z-10">
          <div className="mx-4">
            <div className="flex flex-col text-xs justify-center">
              <h2 className="text-2xl text-center font-semibold">Login</h2>
              <h4 className="italic py-4 text-center">Please enter the needed information below</h4>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 text-sm">
                <input
                  type="email"
                  className="w-full text-xs px-3 py-2 border border-black"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="EMAIL"
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  className="w-full text-xs px-3 py-2 border border-black"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="PASSWORD"
                />
                <div className="text-blue-500 text-xs text-end">Forgot your password? Click here.</div>
              </div>
              <button
                type="submit"
                className={`w-full py-2 my-4 ${loading && 'bg-gray'} px-4 bg-fuchsia-950 text-white hover:bg-blue-600`}
                disabled={loading}
              >
                Log In
              </button>
              <Link href="/Register" className="text-blue-500 cursor-pointer text-xs text-end">
                Don't have an account? Register here.
              </Link>
            </form>
          </div>
        </div>

        {success && (
          <ConfirmationModal>
            <div className="flex flex-col justify-center p-7 justify-center">
              <div className="text-2xl font-bold whitespace-normal text-center ">
                {session ? 'LOGIN SUCCESSFUL!': 'LOG OUT SUCCESSFUL!'}
              </div>
              <div className="text-center italic text-sm">Redirecting you now to the home page.</div>
              <span className="loader" />
            </div>
          </ConfirmationModal>
        )}
      </AccountModal>
    </Layout>
  );
}

export default Login;
