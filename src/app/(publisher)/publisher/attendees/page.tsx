"use client"

import usePublisherAuth from "../use-publisher-auth";
import Attendees from "./attendees"

const AttendeesPage = () => {
    const isAuthorized = usePublisherAuth();

    if(!isAuthorized){
     return null;
    } else {
    return(
        <Attendees />
    )
}
}

export default AttendeesPage;