import React from 'react';
import Lottie from 'lottie-react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

import errorAnimation from "../ui/errorAnimation.json"

interface ErrorPageProps {
  message: string;
}

const ErrorPaymentComfirmationPage: React.FC<ErrorPageProps> = ({ message }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col items-center justify-center px-6">
      <div className="w-64 h-64 mb-8">
        <Lottie animationData={errorAnimation} loop={true} />
      </div>
      <h1 className="text-2xl font-bold text-center mb-4">Oops! Something went wrong</h1>
      <p className="text-lg mb-8 text-center">{message}</p>
      <Button
        onClick={() => router.push('/')}
        className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-2 rounded-md"
      >
        Return to Home
      </Button>
    </div>
  );
};

export default ErrorPaymentComfirmationPage;