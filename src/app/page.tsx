"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NavigationMenuHome } from "./components/navbar-home";

export default function Home() {

  const [events, setEvents] = useState("Loading...");

  useEffect(()=>{
    axios.get("http://localhost:8080/events/home")
    .then((response) => {setEvents(response.data)})
    .catch((error) => {setEvents("Failed to get message from backend.")
      console.log(error);
    }); 
  
  },[])
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-black text-white p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between  text-sm lg:flex">
          <NavigationMenuHome />
        <p className="fixed left-0 top-0 font-mono flex w-full justify-center border-b border-white bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl  lg:static lg:w-auto text-gray-800 lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4">
          This page will be&nbsp;
          <code className="font-mono font-bold">edited later.</code>
        </p>
      </div>
      <div className="flex justify-center items-center text-center text-4xl mb-6 font-bold">
        {events}
      </div>
      <div className="flex justify-center items-center font-lg text-xl">
        <Link href={"/login"}>
          <button className="rounded-lg shadow-md px-4 py-2 font-montserrat font-bold text-white border border-gray-300 hover:text-black hover:bg-white">
            Login
          </button>
        </Link>
        </div>
    
    </main>
  );
}
