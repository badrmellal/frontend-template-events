import SidebarPublisher from "@/app/components/sidebar-publisher";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Headset, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const DashboardPublisher = ()=> {
    const handleLogOut = () => {
        localStorage.removeItem("token");
        window.location.reload();
    }
    
    return (
        <div className="bg-black min-h-screen">
            <SidebarPublisher />
            <div className="flex justify-end pt-3 pr-3">
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
            <div className="flex flex-col justify-center items-center">
                <h1 className="font-extralight text-4xl text-white text-center mb-40 mt-16">Welcome Publisher</h1>
               <Link href="/publisher/create-event">
                    <button 
                    className="px-4 py-2 bg-transparent rounded-md border border-white text-gray-100 hover:text-black hover:bg-white transition-colors duration-150 ease-in-out font-semibold">
                        create event
                    </button>             
               </Link>
               <h2 className="font-semibold text-white text-2xl text-center mt-20">List of all events created</h2>
               
            </div>
        </div>
    )
}
export default DashboardPublisher;