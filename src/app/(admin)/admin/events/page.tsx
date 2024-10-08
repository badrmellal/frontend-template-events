"use client"

import React from "react";
import useAdminAuth from "../use-admin-auth";
import AdminEvents from "./events";


const EventsDashboardPage: React.FC = () => {
    const isAuthorized = useAdminAuth();

    if(!isAuthorized){
        return null;
    }
    return <AdminEvents />
}

export default EventsDashboardPage;