import Link from "next/link";

const DashboardPublisher = ()=> {

    return (
        <div className="bg-black min-h-screen">
            <div className="flex flex-col justify-center items-center">
                <h1 className="font-extralight text-4xl text-white text-center mb-40 mt-16">Welcome Publisher</h1>
               <Link href="/publisher/create-event">
                    <button 
                    className="px-4 py-2 bg-transparent rounded-md border border-white text-gray-100 hover:text-black hover:bg-white transition-colors duration-150 ease-in-out font-semibold">
                        create event
                    </button>             
               </Link>
            </div>
        </div>
    )
}
export default DashboardPublisher;