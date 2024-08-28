"use client"

import DashboardPublisher from "./dashboard"
import usePublisherAuth from "../use-publisher-auth"



const DashboardPublisherPage = () => {
   const isAuthorized = usePublisherAuth();

   if(!isAuthorized){
    return null;
   } else {
    return <DashboardPublisher />
   }
    
}

export default DashboardPublisherPage;