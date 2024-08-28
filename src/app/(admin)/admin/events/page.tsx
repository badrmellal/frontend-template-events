"use client"

import React from "react";
import useAdminAuth from "../use-admin-auth";
import EventDashboard from "./events";


const EventsDashboardPage: React.FC = () => {
    const isAuthorized = useAdminAuth();

    if(!isAuthorized){
        return null;
    }
    return <EventDashboard />
}

export default EventsDashboardPage;