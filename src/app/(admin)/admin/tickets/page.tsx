"use client"

import React from 'react'
import useAdminAuth from '../use-admin-auth'
import Tickets from './tickets';

const TicketsPage = () => {
  const isAuthorized = useAdminAuth();

  if (!isAuthorized){
    return null;
  } else {
    return <Tickets />
  }

}

export default TicketsPage;

