"use client"

import React from "react";
import UsersDashboard from "./users";
import useAdminAuth from "../use-admin-auth";


const UsersDashboardPage: React.FC = () => {
    const isAuthorized = useAdminAuth();

    if(!isAuthorized){
        return null;
    }
    return <UsersDashboard />
}

export default UsersDashboardPage;