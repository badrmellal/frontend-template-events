"use client";

import axios from "axios";
import { useEffect, useState } from "react";

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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          This page will be&nbsp;
          <code className="font-mono font-bold">edited later.</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://google.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <h1>The most talented devs in Morocco.</h1>
          </a>
        </div>
      </div>
      <div className="flex justify-center items-center text-center text-4xl font-bold">
        {events}
      </div>
      <div className="flex justify-center items-center font-lg text-xl">
          We will make it happen.
        </div>
    
    </main>
  );
}
