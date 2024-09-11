"use client"

import usePublisherAuth from "../use-publisher-auth";
import Analytics from "./analytics"

const AnalyticsPage = () => {
    const isAuthorized = usePublisherAuth();

    if(!isAuthorized){
     return null;
    } else {
    return(
        <Analytics />
    )
}
}

export default AnalyticsPage;