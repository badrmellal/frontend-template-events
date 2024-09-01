"use client"

import React from "react";
import usePublisherAuth from "../use-publisher-auth";
import SettingPublisher from "./settings";

const SettingsPublisherPage: React.FC = () => {
    const isAuthorized = usePublisherAuth();
    
    if(!isAuthorized){
        return null;
    }
    return <SettingPublisher />
       
}

export default SettingsPublisherPage;