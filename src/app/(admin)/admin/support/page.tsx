"use client"

import React from "react";
import useAdminAuth from "../use-admin-auth";
import AdminSupport from "./support"

const AdminSupportPage: React.FC = () => {
    const isAuthorized = useAdminAuth();

    if(!isAuthorized){
        return null;
    }

    return <AdminSupport />
    
}

export default AdminSupportPage;