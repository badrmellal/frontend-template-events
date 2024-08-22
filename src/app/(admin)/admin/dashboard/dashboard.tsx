import Link from "next/link";

const DashboardAdmin = ()=> {

    return (
        <div className="bg-black min-h-screen">
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