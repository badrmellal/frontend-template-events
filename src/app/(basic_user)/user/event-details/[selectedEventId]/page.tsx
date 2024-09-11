"use client"

import React from "react";
import { useParams } from 'next/navigation';
import EventDetails from "./event-details"

const EventDetailsPage: React.FC = () => {
    const params = useParams();
    const eventId = params.selectedEventId as string;

    console.log('EventDetailsPage rendering, eventId:', eventId);

    return(
        <EventDetails eventId={eventId} />
    )
}

export default EventDetailsPage;