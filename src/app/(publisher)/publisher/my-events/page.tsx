"use client"

import React from "react";
import MyEvents from "./myevents";
import usePublisherAuth from "../use-publisher-auth";

const MyEventsPage: React.FC = () => {
    const isAuthorized = usePublisherAuth();
    
    if(!isAuthorized){
        return null;
    }
    return <MyEvents />
       
}

export default MyEventsPage;