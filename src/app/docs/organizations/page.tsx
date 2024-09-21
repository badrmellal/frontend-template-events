'use client'

import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, CreditCard, FileCheck, ShieldCheck, Ticket, Building, Globe, DollarSign, BarChart, Clock, Zap, PlusCircle, MinusCircle, Smartphone, Tag, CheckCircle, TrendingUp, Award, Users, ChevronRight, Scale, Music, Cpu, Dumbbell, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from 'next/image'
import { Progress } from '@/components/ui/progress'
import { FeaturesSection } from './features'
import PricingSection from './pricing-section'
import { NavigationMenuHome } from '@/app/components/navbar-home'
import { useRouter } from 'next/navigation'
import { JwtPayload, jwtDecode } from 'jwt-decode'
import { useToast } from '@/components/ui/use-toast'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FaUserCircle } from 'react-icons/fa'
import { MdAdminPanelSettings } from 'react-icons/md'
import { Icons } from '@/components/ui/icons'


interface CustomJwtPayload extends JwtPayload {
    authorities: string[],
    exp: number
  }

const TicketSellingInfoForOrganizations: React.FC = () => {
  const [showQuickStart, setShowQuickStart] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn , setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'basic' | 'publisher' | 'admin' | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const quickStartSteps = [
    { step: "Register Organization", description: "Set up your organization profile in minutes" },
    { step: "Event Portfolio", description: "Create multiple events under your organization" },
    { step: "Team Management", description: "Invite team members and assign roles" },
    { step: "Go Live", description: "Publish your events and start selling!" },
  ]

  const journeySteps = [
    {
      step: "Organization Setup",
      icon: Building,
      description: "Register your organization and set up your profile.",
      details: [
        "Provide organization details",
        "Verify organization credentials",
        "Set up billing information"
      ],
      image: "https://images.pexels.com/photos/5439488/pexels-photo-5439488.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      step: "Event Portfolio",
      icon: CalendarDays,
      description: "Create and manage multiple events under your organization.",
      details: [
        "Set up event templates",
        "Customize branding for each event",
        "Manage event calendars"
      ],
      image: "https://images.unsplash.com/photo-1551469346-aab7ab51bafd?q=80&w=2785&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      step: "Team Management",
      icon: Users,
      description: "Invite team members and assign roles for efficient collaboration.",
      details: [
        "Define user roles and permissions",
        "Invite team members",
        "Set up approval workflows"
      ],
      image: "https://images.pexels.com/photos/5685756/pexels-photo-5685756.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      step: "Advanced Ticketing",
      icon: Ticket,
      description: "Set up complex ticketing strategies for your events.",
      details: [
        "Create tiered pricing structures",
        "Set up group and corporate packages",
        "Implement dynamic pricing"
      ],
      image: "https://i.postimg.cc/5ttvY1jm/Screenshot-2024-09-20-at-22-49-21.png"
    },
    {
      step: "Go Live and Scale",
      icon: Globe,
      description: "Launch your events and scale your ticketing operations.",
      details: [
        "Publish events across multiple channels",
        "Monitor real-time sales and analytics",
        "Scale operations with automated processes"
      ],
      image: "https://images.unsplash.com/photo-1493225774800-a08bb7034783?q=80&w=2926&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
  ]

  const handleNextStep = () => {
    setActiveStep((prevStep) => (prevStep + 1) % journeySteps.length)
  }

  const handlePrevStep = () => {
    setActiveStep((prevStep) => (prevStep - 1 + journeySteps.length) % journeySteps.length)
  }

  const verificationBenefits = [
    { 
      id: 1, 
      text: 'Establish credibility and trust with attendees and partners',
      icon: ShieldCheck
    },
    { 
      id: 2, 
      text: 'Access advanced features and higher transaction limits',
      icon: TrendingUp
    },
    { 
      id: 3, 
      text: 'Ensure compliance with legal and financial regulations',
      icon: Scale
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
                <span>My Dashboard</span>
              </DropdownMenuItem>
              {userRole === 'admin' && (
                <DropdownMenuItem onClick={() => router.push('/admin/dashboard')}>
                  <MdAdminPanelSettings className="mr-2 h-4 w-4 text-gray-500" />
                  <span>Admin Dashboard</span>
                </DropdownMenuItem>
              )}
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
            Empower Your Organization&apos;s Event Management
          </motion.h2>
          <p className="text-xl text-gray-400 mb-8">Streamlined ticketing solutions for organizations of all sizes</p>
          <div className="flex sm:flex-row flex-col justify-center space-y-6 sm:space-y-0 sm:space-x-4">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
              Register Your Organization
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
              <AlertTitle>Quick Start Guide for Organizations</AlertTitle>
              <AlertDescription>Follow these steps to set up your organization and start managing events:</AlertDescription>
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


        {/* Enhanced Your Organization's Event Journey Section */}
        <section className="mb-24 py-16 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center">Your Organization&apos;s Event Journey</h2>
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
                      height={200}
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

                {/* Pricing Section */}
                <PricingSection />

        <div className="my-14 max-w-3xl mx-auto">
          <h2 className="text-3xl text-center font-bold mb-6 text-gray-100">Organization Verification</h2>
          <Card className="bg-gray-800 border-gray-700 shadow-md shadow-gray-500">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-semibold text-gray-100">Why we verify organizations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-400 font-medium">Our organization verification process helps to:</p>
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
                Learn More About Organization Verification
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* FAQ Section */}
        <section className="mb-16">
          <h3 className="text-3xl font-semibold mb-8">Frequently Asked Questions</h3>
          <Accordion type="single" collapsible className="w-full">
            {[
              { question: "How do I set up multiple events under my organization?", answer: "Our platform allows you to create and manage multiple events from a single dashboard. You can set up event templates, customize branding for each event, and manage them all in one place." },
              { question: "Can I assign different roles to my team members?", answer: "Yes, you can invite team members and assign specific roles and permissions. This allows for efficient collaboration and task management across your organization." },
              { question: "What kind of analytics are available for organizations?", answer: "We provide comprehensive analytics across all your events, including ticket sales, attendee demographics, revenue reports, and more. You can access real-time data and generate custom reports." },
              { question: "How does bulk ticketing work for large events?", answer: "Our bulk ticketing feature allows you to create and manage large volumes of tickets efficiently. You can set up group packages, corporate deals, and even integrate with your CRM for seamless management." },
              { question: "Is there a limit to the number of events we can manage?", answer: "There's no limit to the number of events you can manage under your organization. Our platform is designed to scale with your needs, whether you're running a few events or hundreds." },
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
          <h3 className="text-3xl font-semibold mb-4">Ready to Elevate Your Organization&apos;s Event Management?</h3>
          <p className="text-xl text-gray-400 mb-8">Join leading organizations and streamline your event ticketing process</p>
          <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
            Register Your Organization Now
          </Button>
          <p className="mt-6 text-gray-400">
            Need help? <a href="/support" className="text-amber-400 hover:underline">Contact our support team</a>
          </p>
        </section>
      </main>
    </div>
  )
}

export default TicketSellingInfoForOrganizations