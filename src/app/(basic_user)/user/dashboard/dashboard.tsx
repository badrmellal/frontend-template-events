"use client"

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Home = () =>{
    const router = useRouter();
    const [eventList, setEventList] = useState<string>('');

    
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if(!storedToken){
            router.push("/login");
        } else {
            //just for debugging 
            console.log("Stored Token: ", storedToken);

            axios.get("http://localhost:8080/events/authenticated-basic-user",
                {headers: {
                    Authorization: `Bearer ${storedToken}`
                }},
            ).then((response)=> {
               setEventList(response.data) ;
            }).catch((error)=> {
                console.log("Failed to get list of events.", error);
                localStorage.removeItem("token");
                router.push("/login");
            })
                                   
        }
    }, [router])

    return(
        <div className="min-h-screen flex items-center justify-center bg-black">
        {eventList ? (
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-3xl font-semibold text-center text-gray-800">
                         Welcome Home User
                    </h2>
                    <p className="mt-4 text-center text-gray-500">{eventList}</p>
                </div>
            ):(
                <div>
                    <p className="text-white text-3xl font-montserrat font-semibold">Loading...</p>
                </div>
            ) 
            
            }
        </div>
    )
}

export default Home;

