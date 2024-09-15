"use client";

import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export interface CustomJwtPayload {
  authorities: string[],
  exp: number
}

const useAdminAuth = () => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      const userAuthorities = decodedToken.authorities;
      const tokenExpirationDate = new Date(decodedToken.exp * 1000);
      
      if(tokenExpirationDate < new Date()){
              toast({
                variant: "destructive",
                title: "Error",
                description: "Your session has expired. Please login again.",
                })
        setTimeout(()=> {
          router.push("/login")
        }, 2000);
        return; 
      }

      if (userAuthorities.includes("user:delete")) {
        setIsAuthorized(true);
      } else {
        router.push("/access-denied");
      }
    } catch (error: any) {
      console.error("Authorization error:", error.message);
      router.push("/login");
    }
  }, [router, toast]);

  return isAuthorized;
};

export default useAdminAuth;
