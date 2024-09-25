'use client'

import React, { useEffect, useState } from 'react'
import { motion, useAnimation, Variants, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { QrCode, Smartphone, Mail, User, CheckCircle, XCircle, Camera, Shield, Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image'
import { cn } from "@/lib/utils"
import { ExpandableImage } from '@/app/components/expanded-image'
import { NavigationMenuHome } from '@/app/components/navbar-home'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { JwtPayload, jwtDecode } from 'jwt-decode'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FaUserCircle } from 'react-icons/fa'
import { MdSupportAgent } from 'react-icons/md'
import { Icons } from '@/components/ui/icons'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

type Step = {
  icon: React.ElementType;
  title: string;
  description: string;
}

type TabContentProps = {
  steps: Step[];
  title: string;
  description: string;
  buttonText: string;
}

interface HoverCardProps {
  children: React.ReactNode;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

interface CustomJwtPayload extends JwtPayload {
    authorities: string[],
    exp: number
  }

type UserType = 'attendees' | 'publishers'

const AnimatedTitle: React.FC<{ text: string }> = ({ text }) => {
  return (
    <motion.h1 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-5xl font-bold mb-4"
    >
      {text}
    </motion.h1>
  )
}

const cardVariants: Variants = {
  offscreen: {
    y: 50,
    opacity: 0
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8
    }
  }
}

const containerVariants: Variants = {
  offscreen: {
    opacity: 0
  },
  onscreen: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const HoverCard: React.FC<HoverCardProps> = ({ children, isHovered, onHover, onLeave }) => (
  <motion.div
    variants={cardVariants}
    className="relative group"
    onMouseEnter={onHover}
    onMouseLeave={onLeave}
  >
    <AnimatePresence>
      {isHovered && (
        <motion.span
          className="absolute -inset-2 bg-amber-500/[0.8] rounded-xl"
          layoutId="hoverBackground"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.15 },
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.15, delay: 0.2 },
          }}
        />
      )}
    </AnimatePresence>
    {children}
  </motion.div>
)

interface StepCardProps extends Step {
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

const StepCard: React.FC<StepCardProps> = ({ icon: Icon, title, description, isHovered, onHover, onLeave }) => (
  <HoverCard isHovered={isHovered} onHover={onHover} onLeave={onLeave}>
    <Card className={cn(
      "bg-gray-800 border-gray-600 h-full relative z-20",
      isHovered && "border-amber-500/50"
    )}>
      <CardHeader>
        <Icon className="h-8 w-8 mb-2 text-amber-500" />
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300">{description}</p>
      </CardContent>
    </Card>
  </HoverCard>
)

const TabContent: React.FC<TabContentProps> = ({ steps, title, description, buttonText }) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  React.useEffect(() => {
    if (inView) {
      controls.start("onscreen")
    }
  }, [controls, inView])

  return (
    <Card className="bg-transparent border-0 mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-amber-400">{title}</CardTitle>
        <CardDescription className="text-gray-300">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          ref={ref}
          initial="offscreen"
          animate={controls}
          variants={containerVariants}
        >
          {steps.map((step, index) => (
            <StepCard 
              key={index} 
              {...step} 
              isHovered={hoveredIndex === index}
              onHover={() => setHoveredIndex(index)}
              onLeave={() => setHoveredIndex(null)}
            />
          ))}
        </motion.div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}


const QRCodeDemo: React.FC<{ userType: UserType }> = ({ userType }) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  React.useEffect(() => {
    if (inView) {
      controls.start("onscreen")
    }
  }, [controls, inView])

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-semibold mb-8 text-center">QR Code Demo</h2>
      <motion.div 
        className="flex flex-col md:flex-row items-center justify-center gap-8"
        ref={ref}
        initial="offscreen"
        animate={controls}
        variants={containerVariants}
      >
        <HoverCard
          isHovered={hoveredIndex === 0}
          onHover={() => setHoveredIndex(0)}
          onLeave={() => setHoveredIndex(null)}
        >
          <Card className={cn(
            "bg-gray-800 border-gray-500 w-full md:w-80 relative z-20",
            hoveredIndex === 0 && "border-amber-500/50"
          )}>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-amber-400">
                {userType === 'attendees' ? 'Your QR Code' : 'Scanning QR Code'}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ExpandableImage
                src={userType === 'attendees' 
                  ? "https://cdn.pixabay.com/photo/2015/03/21/09/34/qr-683354_1280.png" 
                  : "https://images.unsplash.com/photo-1705544363579-2116d47ddceb?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                alt={userType === 'attendees' ? 'Sample QR Code' : 'Scanning QR Code'}
                width={200}
                height={200}
              />
            </CardContent>
            <CardFooter className="text-center text-gray-300">
              {userType === 'attendees' 
                ? 'This is an example of how your QR code will look' 
                : 'Use your device to scan attendee QR codes'}
            </CardFooter>
          </Card>
        </HoverCard>
        <HoverCard
          isHovered={hoveredIndex === 1}
          onHover={() => setHoveredIndex(1)}
          onLeave={() => setHoveredIndex(null)}
        >
          <Card className={cn(
            "bg-gray-800 border-gray-500 w-full md:w-80 relative z-20",
            hoveredIndex === 1 && "border-amber-500/50"
          )}>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-amber-400">Mobile View</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ExpandableImage
                src={userType === 'attendees'
                  ? "https://cdn.pixabay.com/photo/2020/07/18/13/52/alipay-5417257_1280.jpg"
                  : "https://images.unsplash.com/photo-1571867424488-4565932edb41?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                alt="Mobile QR Code View"
                width={200}
                height={400}
              />
            </CardContent>
            <CardFooter className="text-center text-gray-300">
              {userType === 'attendees'
                ? 'How the QR code appears on your mobile device'
                : 'Publisher view for scanning and managing entries'}
            </CardFooter>
          </Card>
        </HoverCard>
      </motion.div>
    </section>
  )
}

const FAQSection: React.FC = () => {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-semibold mb-8 text-center">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What if I lose my QR code?</AccordionTrigger>
          <AccordionContent>
            If you lose your QR code, you can easily access it by logging into your account. You can also find a copy in your registered email.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Can I share my QR code with others?</AccordionTrigger>
          <AccordionContent>
            No, your QR code is unique to you and should not be shared. Each QR code can only be used once for event entry.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>What if my QR code doesn&apos;t scan?</AccordionTrigger>
          <AccordionContent>
            If your QR code doesn&apos;t scan, please see an event staff member for assistance. They can manually check you in.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  )
}






const QRCodeGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<UserType>('attendees')
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn , setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'basic' | 'publisher' | 'admin' | null>(null);
  const router = useRouter();
  const { toast } = useToast();


  const attendeeSteps: Step[] = [
    { icon: QrCode, title: "QR Code Generation", description: "When you purchase a ticket, a unique QR code is automatically generated for you." },
    { icon: User, title: "Account Storage", description: "The QR code is securely saved to your user account for easy access." },
    { icon: Mail, title: "Email Delivery", description: "A copy of your QR code is also sent to your registered email address." },
    { icon: Smartphone, title: "Mobile Access", description: "Access your QR codes anytime by logging into your account on any device." },
    { icon: CheckCircle, title: "Event Entry", description: "Present your QR code at the event for quick and easy entry." },
  ]

  const publisherSteps: Step[] = [
    { icon: Camera, title: "Scan QR Codes", description: "Use your mobile device's camera to scan attendee QR codes at entry points." },
    { icon: Shield, title: "Verify Authenticity", description: "Our system instantly verifies the authenticity of each scanned QR code." },
    { icon: User, title: "Check-In Process", description: "Once verified, you can check in the attendee with a single tap." },
    { icon: XCircle, title: "One-Time Use", description: "After check-in, the QR code becomes invalid to prevent multiple uses." },
    { icon: Clock, title: "Real-Time Updates", description: "Get instant updates on attendance and entry statistics." },
  ]

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
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8"> 
        <div className="flex justify-between items-center pb-14">
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

        <section className="text-center mb-16">
          <AnimatedTitle text="QR Code System Guide" />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400 mb-8"
          >
            Learn how our QR code system streamlines event entry for attendees and publishers
          </motion.p>
        </section>

        <Tabs defaultValue="attendees" className="w-full mb-16" onValueChange={(value) => setActiveTab(value as UserType)}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="attendees">For Attendees</TabsTrigger>
            <TabsTrigger value="publishers">For Event Publishers</TabsTrigger>
          </TabsList>
          <TabsContent value="attendees">
            <TabContent 
              steps={attendeeSteps}
              title="How It Works for Attendees"
              description="Follow these steps to use your QR code for event entry"
              buttonText="View My QR Codes"
            />
          </TabsContent>
          <TabsContent value="publishers">
            <TabContent 
              steps={publisherSteps}
              title="How It Works for Publishers"
              description="Efficiently manage event entry with our QR code system"
              buttonText="Access QR Scanner"
            />
          </TabsContent>
        </Tabs>

        <QRCodeDemo userType={activeTab} />

        <FAQSection />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <section className="text-center mb-16">
            <h2 className="text-3xl font-semibold mb-4">
              {activeTab === 'attendees' 
                ? "Ready to Streamline Your Event Entry?" 
                : "Ready to Optimize Your Event Management?"}
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              {activeTab === 'attendees'
                ? "Experience the convenience of our QR code system for your next event"
                : "Enhance your event management with our efficient QR code scanning system"}
            </p>
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
              {activeTab === 'attendees' ? "Get Your QR Code" : "Set Up QR Scanning"}
            </Button>
          </section>
        </motion.div>
      </main>
    </div>
  )
}

export default QRCodeGuide;