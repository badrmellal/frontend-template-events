"use client"

import useOrganizationAuth from "../use-organization-auth"
import OrganizationDashboard from "./dashboard";

const OrganizationDashboardPage = ()=> {
    const isAuthorized = useOrganizationAuth();
    if(!isAuthorized){
        return null;
    }
    return <OrganizationDashboard />
}

export default OrganizationDashboardPage;