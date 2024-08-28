"use client"

import SidebarUser from "@/app/components/sidebar-user";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import axios from "axios";
import { Headset, LogOut } from "lucide-react";
import Image from "next/image";
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

    const handleLogOut = () => {
        localStorage.removeItem("token");
        window.location.reload();
    }

    return(
        <div className="min-h-screen flex items-center justify-center bg-black">
            <SidebarUser />
            <div className="absolute top-3 right-3">
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full"
                >
                    <Image
                    src="/profile_avatar.png"
                    width={36}
                    height={36}
                    alt="Avatar"
                    className="overflow-hidden rounded-full"
                    />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><Headset className="h-4 w-4 mx-1 text-gray-500" /> Support</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogOut}> <LogOut className="h-4 w-4 mx-1 text-gray-500" /> Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </div>
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

