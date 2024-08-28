import SidebarAdmin from "@/app/components/sidebar-admin";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Headset, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DashboardAdmin = ()=> {
    const router = useRouter();

    const handleLogOut = () => {
        localStorage.removeItem("token");
        window.location.reload();
    }

    return (
        <div className="bg-black min-h-screen">
            <SidebarAdmin />
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
                <DropdownMenuItem><Headset className="h-4 w-4 mx-1" /> Support</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogOut}> <LogOut className="h-4 w-4 mx-1" /> Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </div>
            <div className="flex flex-col justify-center items-center">
                <h1 className="font-extralight text-4xl text-white text-center mb-40 mt-16">Welcome Admin</h1>
              <div className="flex flex-row justify-center items-center space-x-8">
                <Link href="/admin/events">
                        <button 
                        className="px-4 py-2 bg-transparent rounded-md border border-white text-gray-100 hover:text-black hover:bg-white transition-colors duration-150 ease-in-out font-semibold">
                            View all events
                        </button>             
                </Link>
                <Link href="/admin/users">
                        <button 
                        className="px-4 py-2 bg-transparent rounded-md border border-white text-gray-100 hover:text-black hover:bg-white transition-colors duration-150 ease-in-out font-semibold">
                            View all users
                        </button>             
                </Link>
              </div>
            </div>
        </div>
    )
}
export default DashboardAdmin;