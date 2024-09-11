"use client"

import usePublisherAuth from "../use-publisher-auth";
import Tickets from "./tickets"

const TicketsPage = () =>{
    const isAuthorized = usePublisherAuth();

    if(!isAuthorized){
     return null;
    } else {
    return(
        <Tickets />
    )
}
}

export default TicketsPage;