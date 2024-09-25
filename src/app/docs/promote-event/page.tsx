'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { motion, useAnimation, Variants, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Megaphone, TrendingUp, Users, Globe, DollarSign, Zap, BarChart, Calendar, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from 'next/image'
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { NavigationMenuHome } from '@/app/components/navbar-home'
import { JwtPayload, jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FaUserCircle } from 'react-icons/fa'
import { MdSupportAgent } from 'react-icons/md'
import { Icons } from '@/components/ui/icons'


interface CustomJwtPayload extends JwtPayload {
  authorities: string[],
  exp: number
}


const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
}

interface HoverEffectProps {
  items: React.ReactNode[];
  className?: string;
}

const HoverEffect: React.FC<HoverEffectProps> = ({ items, className }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  return (
    <div className={cn("grid gap-6", className)}>
      {items.map((item, idx) => (
        <HoverCard
          key={`hover-card-${idx}`}
          index={idx}
          isHovered={hoveredIndex === idx}
          onHover={() => setHoveredIndex(idx)}
          onLeave={() => setHoveredIndex(null)}
        >
          {item}
        </HoverCard>
      ))}
    </div>
  );
};

interface HoverCardProps {
  children: React.ReactNode;
  className?: string;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

const HoverCard: React.FC<HoverCardProps> = ({ children, className, index, isHovered, onHover, onLeave }) => {
  const [ref, isInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={cn("relative group block p-2 h-full w-full", className)}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.span
            className="absolute inset-0 h-full w-full bg-amber-500/[0.8] block rounded-3xl"
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
      <div className="rounded-2xl h-full w-full p-4 overflow-hidden bg-gray-800 border border-transparent dark:border-white/[0.2] group-hover:border-amber-500/50 relative z-20">
        <div className="relative z-50">
          <div className="p-4">{children}</div>
        </div>
      </div>
    </motion.div>
  );
};

const PromoteYourEvents: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn , setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'basic' | 'publisher' | 'admin' | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const handleStepClick = useCallback((index: number) => {
    setActiveStep(index);
  }, []);


  const howItWorks = [
    { 
      title: "Choose Your Plan",
      description: "Select the promotion level that suits your event and budget",
      image: "https://images.unsplash.com/photo-1573164713347-df1f7d6aeb03?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      details: "Browse through our range of promotion packages and select the one that best fits your event's needs and your budget constraints."
    },
    { 
      title: "Set Duration",
      description: "Decide how long you want your event to be promoted",
      image: "https://images.unsplash.com/photo-1541232876724-6e25c6dfa788?q=80&w=2946&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      details: "Choose the duration for your promotion. Longer durations can lead to increased visibility and ticket sales."
    },
    { 
      title: "Go Live",
      description: "Your event gets instant visibility boost across our platform",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      details: "Once you've set up your promotion, it goes live immediately. Your event will start appearing in featured sections across our platform."
    },
    { 
      title: "Track Performance",
      description: "Monitor your promotion's impact with real-time analytics",
      image: "https://images.unsplash.com/photo-1625834318071-f28f0e51449b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      details: "Access real-time analytics to track how your promotion is performing. Measure views, clicks, and ticket sales attributed to your promotion."
    },
  ];

  const benefits = [
    { icon: TrendingUp, title: "5x More Visibility", description: "Get featured prominently on our homepage" },
    { icon: Users, title: "Reach Larger Audience", description: "Connect with thousands of potential attendees" },
    { icon: Globe, title: "Wider Reach", description: "Expand your event's visibility across regions" },
    { icon: Zap, title: "Boost Ticket Sales", description: "Increase your chances of selling out faster" },
    { icon: BarChart, title: "Performance Tracking", description: "Get detailed insights on your promotion's performance" },
    { icon: Calendar, title: "Flexible Duration", description: "Choose promotion duration that fits your needs" },
  ]

  const promotionLevels = [
    { name: "Basic Boost", price: 0.5, duration: "per day", features: ["Homepage visibility", "Search result priority", "Social media mention"] },
    { name: "Premium Spotlight", price: 1.5, duration: "per day", features: ["5x Homepage visibility", "Top search results", "Featured in newsletter", "Dedicated social media post"] },
    { name: "Ultimate Promotion", price: 3, duration: "per day", features: ["10x Homepage visibility", "#1 in search results", "Featured in newsletter", "Multiple social media posts", "Push notification to relevant users"] },
  ]

  const faqItems = [
    {
      question: "How does the 5x visibility on the homepage work?",
      answer: "With our promotion service, your event will be featured more prominently and frequently on our homepage. This means it will appear in larger slots, in prime positions, and will be shown more often than non-promoted events, resulting in up to 5 times more visibility to our site visitors."
    },
    {
      question: "Can I change my promotion plan after it starts?",
      answer: "Yes, you can upgrade or downgrade your promotion plan at any time. Changes will take effect immediately, and your billing will be adjusted accordingly. However, we recommend starting with the plan that best suits your needs to maximize your event's exposure from the beginning."
    },
    {
      question: "How do I track the performance of my promoted event?",
      answer: "We provide a comprehensive analytics dashboard for all promoted events. You can track metrics such as views, click-through rates, ticket sales attributed to the promotion, and more. This data is updated in real-time, allowing you to gauge the effectiveness of your promotion instantly."
    },
    {
      question: "Is there a minimum duration for event promotion?",
      answer: "The minimum duration for event promotion is one day. However, we recommend promoting your event for at least a week to maximize its visibility and reach. You can choose any duration that fits your event timeline and budget."
    },
    {
      question: "Can I target my promotion to a specific audience or region?",
      answer: "Yes, we offer targeting options for Premium Spotlight and Ultimate Promotion plans. You can target your promotion based on user interests, location, and past event attendance. This ensures your event reaches the most relevant audience, increasing the chances of ticket sales."
    },
    {
      question: "What happens if my event sells out during the promotion period?",
      answer: "If your event sells out during the promotion period, we'll automatically adjust your promotion to focus on building a waitlist or promoting your next upcoming event, if available. You can also choose to end the promotion early, and we'll prorate any unused promotion time."
    }
  ]

  const AnimatedSection: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });

    React.useEffect(() => {
      if (inView) {
        controls.start("visible");
      }
    }, [controls, inView]);

    return (
      <motion.section
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        className={className}
      >
        {children}
      </motion.section>
    );
  };

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
      <div className="flex justify-between items-center mb-12">
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

        <AnimatedSection className="text-center mb-16">
          <motion.h1 
            variants={itemVariants}
            className="text-5xl font-bold mb-4"
          >
            Supercharge Your Event Promotion
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-400 mb-8"
          >
            Reach a wider audience and boost your ticket sales with our powerful promotion tools
          </motion.p>
          <motion.div variants={itemVariants}>
            <Badge variant="secondary" onClick={() => {
                const element = document.getElementById("promotionLevels");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="text-lg cursor-pointer rounded-3xl px-4 py-2 bg-amber-500 text-black"
              >
              Starting at just $0.5 per day
            </Badge>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">Why Promote Your Event with Us?</h2>
          <HoverEffect
            items={benefits.map((benefit, index) => (
              <React.Fragment key={`benefit-${index}`}>
                <div className="mb-4">
                  <benefit.icon className="h-8 w-8 text-amber-500" />
                </div>
                <h4 className="text-zinc-100 font-bold tracking-wide mt-4">{benefit.title}</h4>
                <p className="mt-4 text-zinc-400 tracking-wide leading-relaxed text-sm">{benefit.description}</p>
              </React.Fragment>
            ))}
            className="md:grid-cols-2 lg:grid-cols-3"
          />
        </AnimatedSection>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              {howItWorks.map((step, index) => (
                <div
                  key={index} 
                  className={cn(
                    "w-full text-left cursor-pointer rounded-lg p-4",
                    activeStep === index ? "bg-amber-500 text-black" : "bg-gray-800 text-white"
                  )}
                  onClick={() => handleStepClick(index)} 
                >
                  <div className="flex items-center">
                    <div className="bg-amber-500 text-black rounded-full w-8 h-8 flex items-center justify-center mr-4">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="text-sm">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 md:mt-0">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-100">{howItWorks[activeStep].title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Image
                    src={howItWorks[activeStep].image}
                    alt={howItWorks[activeStep].title}
                    width={350}
                    height={200}
                    className="rounded-lg mb-4 mx-auto"
                  />
                  <p className="text-gray-300">{howItWorks[activeStep].details}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
 
        <AnimatedSection className="mb-16">
          <h2 id='promotionLevels' className="text-3xl font-semibold mb-8 text-center">Promotion Levels</h2>
          <HoverEffect
            items={promotionLevels.map((level, index) => (
              <Card key={`promotion-level-${index}`} className="bg-gray-800 border-gray-700 h-full relative z-20">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-amber-500">{level.name}</CardTitle>
                  <CardDescription className="text-3xl font-semibold text-white">
                    ${level.price} <span className="text-sm text-gray-400">{level.duration}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {level.features.map((feature, fIndex) => (
                      <li key={`feature-${index}-${fIndex}`} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                    Choose Plan
                  </Button>
                </CardFooter>
              </Card>
            ))}
            className="md:grid-cols-2 lg:grid-cols-3"
          />
        </AnimatedSection>

       
        <AnimatedSection className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">See the Difference</h2>
          <HoverEffect
            items={[
              <Card key="without-promotion" className="bg-gray-800 border-gray-700 w-full max-w-full sm:max-w-[90vw] relative z-20 overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-amber-400">Without Promotion</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Image
                    src="https://images.unsplash.com/photo-1524868857876-218cafbdda8b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Event listing without promotion"
                    width={350}
                    height={200}
                    className="rounded-lg w-full max-w-full"
                  />
                </CardContent>
              </Card>,
              <Card key="with-promotion" className="bg-gray-800 border-gray-700 w-full max-w-full sm:max-w-[90vw] relative z-20 overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-amber-400">With Promotion</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Image
                    src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Showtime Africa Event listing with promotion"
                    width={350}
                    height={200}
                    className="rounded-lg w-full max-w-full"
                  />
                </CardContent>
              </Card>
            ]}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          />
        </AnimatedSection>

        <AnimatedSection className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`} className="border-b border-gray-700">
                <AccordionTrigger className="text-left py-4 text-white">{item.question}</AccordionTrigger>
                <AccordionContent className="text-gray-400 pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedSection>

        <AnimatedSection className="text-center mb-16">
          <motion.h2 variants={itemVariants} className="text-3xl font-semibold mb-4">Ready to Amplify Your Event&apos;s Reach?</motion.h2>
          <motion.p variants={itemVariants} className="text-xl text-gray-400 mb-8">Start promoting your event today and watch your ticket sales soar!</motion.p>
          <motion.div variants={itemVariants}>
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
              Promote My Event Now
            </Button>
          </motion.div>
        </AnimatedSection>
      </main>
    </div>
  )
}

export default PromoteYourEvents