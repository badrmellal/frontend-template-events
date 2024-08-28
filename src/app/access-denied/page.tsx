"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AccessDenied: React.FC = () => {
  const router = useRouter();
  const redirectToLogin = () =>{
    localStorage.removeItem("token");
    setTimeout(() => router.push("/login"), 3000)
  }

  useEffect(()=> {
    redirectToLogin();
  },[])
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <h1 className="text-4xl text-gray-200">Access Denied</h1>
      </div>
    );
  };
  
  export default AccessDenied;
  