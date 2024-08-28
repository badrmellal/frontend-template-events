"use client"

import React from "react";
import DashboardAdmin from "./dashboard";
import useAdminAuth from "../use-admin-auth";

const DashboardAdminPage: React.FC = () => {
  const isAuthorized = useAdminAuth();

  if (!isAuthorized) {
    return null;
  }
  return <DashboardAdmin />
};

export default DashboardAdminPage;
