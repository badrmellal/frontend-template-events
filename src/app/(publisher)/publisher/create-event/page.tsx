"use client"

import React from "react";
import CreateEvent from "./create-event"
import usePublisherAuth from "../use-publisher-auth";

const CreateEventPage: React.FC = () => {
    const isAuthorized = usePublisherAuth();
    
    if(!isAuthorized){
        return null;
    }
    return <CreateEvent />

}

export default CreateEventPage;

