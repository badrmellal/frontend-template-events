"use client"

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, CreditCard, FileCheck, ShieldCheck, Ticket, User, Globe, DollarSign, BarChart, Clock, Zap, PlusCircle, MinusCircle, Smartphone, Tag, CheckCircle, TrendingUp, Award, Users, ChevronRight, Scale, Music, Cpu, Dumbbell, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { FeaturesSection } from './features';
import { SuccessStoriesSection } from './success-stories';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { NavigationMenuHome } from '@/app/components/navbar-home';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FaUserCircle } from 'react-icons/fa';
import { MdAdminPanelSettings, MdSupportAgent } from 'react-icons/md';
import { Icons } from '@/components/ui/icons';
import PricingSection from './pricing-section';


interface CustomJwtPayload extends JwtPayload {
  authorities: string[],
  exp: number
}

const TicketSellingInfoForIndividuals: React.FC = () => {
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn , setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'basic' | 'publisher' | 'admin' | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const quickStartSteps = [
    { step: "Sign Up", description: "Create your account in under 2 minutes" },
    { step: "Event Details", description: "Add your event name, date, and location" },
    { step: "Set Ticket Price", description: "Choose your ticket type and price" },
    { step: "Go Live", description: "Publish your event and start selling!" },
  ];


  const journeySteps = [
    {
      step: "Create Account",
      icon: User,
      description: "Sign up and join our community of event creators. It only takes a minute to get started.",
      details: [
        "Provide basic information",
        "Verify your email address",
        "Set up your organizer profile"
      ],
      image: "https://images.unsplash.com/photo-1470434767159-ac7bf1b43351?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      step: "Set Up Event",
      icon: CalendarDays,
      description: "Bring your event to life with all the essential details. Our intuitive interface makes it easy.",
      details: [
        "Choose event type and category",
        "Set date, time, and location",
        "Add event description and images"
      ],
      image: "https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?q=80&w=2815&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      step: "Configure Tickets",
      icon: Ticket,
      description: "Design your perfect ticket strategy with our flexible ticketing options.",
      details: [
        "Set up multiple ticket types",
        "Configure pricing and availability",
        "Add custom fields for attendees"
      ],
      image: "https://images.unsplash.com/photo-1571867424488-4565932edb41?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      step: "Verify Identity",
      icon: ShieldCheck,
      description: "We ensure the safety of all users with a quick and secure identity verification process.",
      details: [
        "Upload identification document",
        "Complete a short questionnaire",
        "Get verified within 5 minutes"
      ],
      image: "https://images.unsplash.com/photo-1713947506242-8fcae733d158?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      step: "Go Live!",
      icon: Globe,
      description: "Launch your event to the world and start selling tickets immediately.",
      details: [
        "Review and publish your event",
        "Share on social media platforms",
        "Monitor sales in real-time"
      ],
      image: "https://images.unsplash.com/photo-1578946956271-e8234ecaaadd?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
  ];

  const handleNextStep = () => {
    setActiveStep((prevStep) => (prevStep + 1) % journeySteps.length);
  };

  const handlePrevStep = () => {
    setActiveStep((prevStep) => (prevStep - 1 + journeySteps.length) % journeySteps.length);
  };

  const verificationBenefits = [
    { 
      id: 1, 
      text: 'Prevent fraud and protect both yourself and your attendees',
      icon: ShieldCheck
    },
    { 
      id: 2, 
      text: 'Comply with legal and financial regulations',
      icon: Scale
    },
    { 
      id: 3, 
      text: 'Build trust within our event community',
      icon: Users
    },
  ];


  const validateToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      return false;
    }

    try {
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        setIsLoggedIn(false);
        setUserRole(null);
        localStorage.removeItem('token');
        return false;
      }
      setIsLoggedIn(true);
      if (decodedToken.authorities.includes("user:delete")) {
        setUserRole('admin');
      } else if (decodedToken.authorities.includes("event:create")) {
        setUserRole('publisher');
      } else {
        setUserRole('basic');
      }
      return true;
    } catch (error) {
      console.error("Error decoding token:", error);
      setIsLoggedIn(false);
      setUserRole(null);
      localStorage.removeItem('token');
      return false;
    }
  };

  useEffect(()=> {
   validateToken();
  },[]);

  const handleLoginClick = () => {
    router.push("/sign-up");
  }

  const handleLogOut = () => {
    setIsLoading(true);
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsLoading(false);
    router.push('/login');
  };

  const handleDashboardClick = () => {
    switch (userRole) {
      case 'admin':
        router.push('/admin/dashboard');
        break;
      case 'publisher':
        router.push('/publisher/dashboard');
        break;
      case 'basic':
        router.push('/user/dashboard');
        break;
      default:
        toast({
          title: "Error",
          description: "Unable to determine user role.",
          variant: "destructive"
        });
    }
  };

  const handleSupportClick = () => {
    router.push("/support");
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
       <div className="w-full max-w-8xl pt-8 px-4 sm:px-6 lg:px-10">
            <div className="flex justify-between items-center mb-8">
            <NavigationMenuHome />
        {!isLoggedIn ? (
            <Button variant="outline" onClick={handleLoginClick} className="text-black border-white hover:bg-gray-100">
              Login / Register
            </Button>
          ) : (
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/profile_avatar.png" alt="Avatar" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDashboardClick}>
                <FaUserCircle className="mr-2 h-4 w-4 text-gray-500" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSupportClick}>
                <MdSupportAgent className="mr-2 h-4 w-4 text-gray-500" />
                <span>Support</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogOut}>
                <Icons.logOut className="mr-2 h-4 w-4" />
                <span>{isLoading ? 'Logging out...' : 'Log out'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          )}
        </div>
        </div>

      <main className="max-w-7xl mx-auto py-14 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold mb-4"
          >
            Start Selling Tickets in less than 10 Minutes
          </motion.h2>
          <p className="text-xl text-gray-400 mb-8">Quick and easy setup for events of any size</p>
          <div className="flex sm:flex-row flex-col justify-center space-y-6 sm:space-y-0 sm:space-x-4">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
              Create Your Event
            </Button>
            <Button size="lg" variant="secondary" onClick={() => setShowQuickStart(!showQuickStart)}>
              {showQuickStart ? "Hide" : "Show"} Quick Start Guide
            </Button>
          </div>
        </section>

        {/* Quick Start Guide */}
        {showQuickStart && (
          <motion.section 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-16"
          >
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertTitle>Quick Start Guide</AlertTitle>
              <AlertDescription>Follow these steps to start selling tickets in less than 10 minutes:</AlertDescription>
            </Alert>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickStartSteps.map((step, index) => (
                <Card key={index} className="bg-gray-800 border-gray-600">
                  <CardHeader>
                    <CardTitle className="flex text-gray-200 items-center">
                      <span className="bg-amber-500 text-black rounded-full w-8 h-8 flex items-center justify-center mr-2">
                        {index + 1}
                      </span>
                      {step.step}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        )}

        {/* Features Section */}
       <FeaturesSection />

       {/* Enhanced Your Journey to Successful Events Section */}
      <section className="mb-24 py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Your Journey to successful events</h2>
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="w-full lg:w-1/2 mb-8 lg:mb-0 lg:pr-8">
              <div className="space-y-6">
                {journeySteps.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-4 cursor-pointer transition-all duration-300 ${
                      index === activeStep ? 'scale-105' : 'opacity-50'
                    }`}
                    onClick={() => setActiveStep(index)}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      index === activeStep ? 'bg-amber-500' : 'bg-gray-700'
                    }`}>
                      {index < activeStep ? (
                        <CheckCircle className="h-6 w-6 text-white" />
                      ) : (
                        <item.icon className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <span className={`font-semibold text-lg ${index === activeStep ? 'text-amber-500' : 'text-gray-300'}`}>
                      {item.step}
                    </span>
                    {index < journeySteps.length - 1 && (
                      <ChevronRight className={`h-5 w-5 ${index < activeStep ? 'text-amber-500' : 'text-gray-500'}`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-lg">
                <Progress value={(activeStep / (journeySteps.length - 1)) * 100} className="h-2 bg-gray-500" />
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-900 rounded-lg p-8 shadow-lg"
                >
                  <Image
                    src={journeySteps[activeStep].image}
                    alt={journeySteps[activeStep].step}
                    width={300}
                    height={400}
                    className="w-full h-48 object-cover rounded-lg mb-6"
                  />
                  <h3 className="text-2xl font-bold mb-4 text-amber-500">{journeySteps[activeStep].step}</h3>
                  <p className="text-gray-300 mb-6">{journeySteps[activeStep].description}</p>
                  <ul className="space-y-2">
                    {journeySteps[activeStep].details.map((detail, index) => (
                      <li key={index} className="flex items-center text-gray-400">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-between mt-6">
                <Button
                  onClick={handlePrevStep}
                  variant="outline"
                  className="text-black border-transparent hover:bg-black hover:text-white"
                >
                  Previous Step
                </Button>
                <Button
                  onClick={handleNextStep}
                  className="bg-amber-500 hover:bg-amber-600 text-black"
                >
                  Next Step
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
 
        <PricingSection />

        <div className="my-14 max-w-3xl mx-auto">
        <h2 className="text-3xl text-center font-bold mb-6 text-gray-100">Identity Verification</h2>
        <Card className="bg-gray-800 border-gray-700 shadow-lg">
            <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold text-gray-100">Why we verify</CardTitle>
            </CardHeader>
            <CardContent>
            <p className="mb-4 text-gray-400 font-medium">Our identity verification process helps to:</p>
            <ul className="space-y-4 text-gray-400">
                {verificationBenefits.map((benefit) => (
                <li key={benefit.id} className="flex items-start">
                    <benefit.icon className="mr-3 h-6 w-6 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>{benefit.text}</span>
                </li>
                ))}
            </ul>
            </CardContent>
            <CardFooter className="pt-4">
            <Button variant="outline" className="w-full sm:w-auto">
                Learn More About Verification
            </Button>
            </CardFooter>
        </Card>
        </div>

       {/* New Section: Success Stories */}
       <SuccessStoriesSection />

        {/* FAQ Section */}
        <section className="mb-16">
          <h3 className="text-3xl font-semibold mb-8">Frequently Asked Questions</h3>
          <Accordion type="single" collapsible className="w-full">
            {[
              { question: "How quickly can I start selling tickets?", answer: "You can start selling tickets in as little as 10 minutes! Our streamlined setup process allows you to create an account, input your event details, set ticket prices, and go live quickly." },
              { question: "What payment methods can I accept?", answer: "We support a wide range of payment methods including credit cards, debit cards, PayPal, and popular digital wallets. The specific options may vary depending on your location." },
              { question: "Is there a limit to how many tickets I can sell?", answer: "There's no set limit on the number of tickets you can sell. Our platform scales with your needs, whether you're organizing a small meetup or a large conference." },
              { question: "Can I offer different types of tickets?", answer: "Yes! You can create multiple ticket types such as Early Bird, VIP, General Admission, and more. You can also set different prices and quantities for each type." },
              { question: "How do I handle refunds?", answer: "You can easily process refunds through our platform. You have the flexibility to set your own refund policy and manage refund requests directly from your event dashboard." },
            ].map((faq, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`} className="border-b border-gray-700">
                <AccordionTrigger className="text-left py-4">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-400 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h3 className="text-3xl font-semibold mb-4">Ready to Start Selling?</h3>
          <p className="text-xl text-gray-400 mb-8">Join thousands of event organizers and start selling tickets in minutes</p>
          <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
            Create Your Event Now
          </Button>
          <p className="mt-6 text-gray-400">
            Need help? <a href="/support" className="text-amber-400 hover:underline">Contact our support team</a>
          </p>
        </section>
      </main>

    </div>
  );
};

export default TicketSellingInfoForIndividuals;