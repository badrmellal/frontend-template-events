import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";


export const handleAuthRedirect = (router: AppRouterInstance, currentPath: string) => {
    localStorage.setItem('redirectAfterLogin', currentPath);
    router.push('/login');
  };