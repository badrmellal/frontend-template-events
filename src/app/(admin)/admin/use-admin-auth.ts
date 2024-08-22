"use client";

import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CustomJwtPayload {
  authorities: string[];
}

const useAdminAuth = () => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      const userAuthorities = decodedToken.authorities;

      if (userAuthorities.includes("user:delete")) {
        setIsAuthorized(true);
      } else {
        router.push("/access-denied");
      }
    } catch (error) {
      console.error("Authorization error:", error.message);
      router.push("/login");
    }
  }, [router]);

  return isAuthorized;
};

export default useAdminAuth;
