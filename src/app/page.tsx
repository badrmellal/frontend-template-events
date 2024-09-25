"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Slider from "react-slick";
import { usePathname, useRouter } from 'next/navigation';
import { NavigationMenuHome } from "./components/navbar-home";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Zap, X, Search, Minus, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatCurrency, africanCountries } from '@/app/api/currency/route';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/ui/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { JwtPayload, jwtDecode } from "jwt-decode";
import Link from "next/link";
import { motion } from "framer-motion"
import { handleAuthRedirect } from './components/auth-redirect'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { FaUserCircle } from "react-icons/fa";
import { MdAdminPanelSettings, MdOutlineWebhook, MdSupportAgent } from "react-icons/md";
import { FcSupport } from "react-icons/fc";


interface Event {
  id: number; 
  eventName: string;
  eventCategory: string;
  eventDescription: string;
  eventImages: string[];
  ticketTypes: TicketType[];
  eventVideo: string | null;
  eventPrice: number;
  eventCurrency: string;
  isFreeEvent: boolean;
  eventManagerUsername: string;
  eventDate: string;
  addressLocation: string;
  googleMapsUrl: string;
  isApproved: boolean;
  totalTickets: number;
  remainingTickets: number;
  countryCode: string;
}

interface TicketType {
  name: string;
  price: number;
  totalTickets: number;
  remainingTickets: number;
}

interface BookingDetails {
  eventId: number;
  ticketType: string;
  quantity: number;
  price: number;
  fees: number;
  vat: number;
  total: number;
}

export interface CustomJwtPayload extends JwtPayload {
  authorities: string[],
  exp: number
}

const eventCategories = [
  'Night Party',
  'Swimming Party',
  'Sport & Fitness',
  'Media & Films',
  'Government',
  'Concert',
  'Conference',
  'Startups & Business'
];

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState<TicketType | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [isLoggedIn , setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [userRole, setUserRole] = useState<'basic' | 'publisher' | 'admin' | null>(null);
  const {toast} = useToast();
  const router = useRouter();
  const pathname = usePathname();


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

  useEffect(() => {
    validateToken();
    const fetchData = async () => {
      try {
        const eventsResponse = await axios.get<Event[]>("http://localhost:8080/events/home");
        setEvents(eventsResponse.data);
        setFilteredEvents(eventsResponse.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch data from the backend.");
        setLoading(false);
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const results = events.filter(event =>
      (event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.eventCategory.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === "all" || event.eventCategory === selectedCategory) &&
      (selectedCountry === "all" || event.countryCode === selectedCountry)
    );
    setFilteredEvents(results);
  }, [searchTerm, events, selectedCategory, selectedCountry]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setSelectedTicketType(event.ticketTypes[0]); // Default to first ticket type
    setTicketQuantity(1);
    setIsSheetOpen(true)
    setIsDescriptionExpanded(false)
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded)
  }

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

  const handleBookNow = () => {

    if (!validateToken()) {
      toast({
        title: "Authentication required",
        description: "Please log in to continue.",
        variant: "default"
      });
      handleAuthRedirect(router, pathname);
      return;
    }
  
    if (selectedEvent && selectedTicketType) {
      const bookingDetails: BookingDetails = {
        eventId: selectedEvent.id,
        ticketType: selectedTicketType.name,
        quantity: ticketQuantity,
        price: selectedTicketType.price * ticketQuantity,
        fees: 2 * ticketQuantity,
        vat: selectedTicketType.price * ticketQuantity * 0.15,
        total: calculateTotal()
      };
      localStorage.setItem('currentBooking', JSON.stringify(bookingDetails));
      router.push(`user/event-details/${selectedEvent.id}`);
    } else {
      toast({
        title: "Error",
        description: "Select ticket type.",
        variant: "destructive"
      });
    }
  };

  const handleLoginClick = () => {
    router.push("/sign-up");
  }

  const handleTicketTypeChange = (value: string) => {
    const newSelectedTicketType = selectedEvent?.ticketTypes.find(t => t.name === value) || null;
    setSelectedTicketType(newSelectedTicketType);
    setTicketQuantity(1); 
  };

  const incrementTicketQuantity = () => {
    if (selectedTicketType && ticketQuantity < selectedTicketType.remainingTickets) {
      setTicketQuantity(prevQuantity => prevQuantity + 1);
    }
  };
  
  const decrementTicketQuantity = () => {
    if (ticketQuantity > 1) {
      setTicketQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const getTotalRemainingTickets = (event: Event) => {
    return event.ticketTypes.reduce((sum, t) => sum + t.remainingTickets, 0);
  };
  
  const calculateSubtotal = () => {
    return selectedTicketType ? selectedTicketType.price * ticketQuantity : 0;
  };
  
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const fees = 2 * ticketQuantity; // Example fee calculation
    const vat = subtotal * 0.15; // Example VAT calculation (15%)
    return subtotal + fees + vat;
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

   const handleLogOut = () => {
    setIsLoading(true);
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsLoading(false);
    router.push('/login');
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-gray-900 to-black text-white">
    <div className="w-full max-w-7xl pt-8 px-4 sm:px-6 lg:px-8">
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
                <Icons.logOut className="mr-2 h-4 w-4 text-gray-500" />
                <span>{isLoading ? 'Logging out...' : 'Log out'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          )}
        
      </div>
      <div className="text-center py-16 sm:py-20">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-600">
          Showtime Africa
        </h1>
        <p className="text-xl sm:text-2xl mb-8 text-gray-300">
          Discover and Experience the Best Events in Africa
        </p>
      </div>
      <div className="flex flex-col lg:flex-row justify-between items-start mb-8">
        <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full bg-white bg-opacity-10 text-white border-gray-600 focus:border-amber-500 focus:ring-amber-500 pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="w-full lg:w-auto flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <Select onValueChange={setSelectedCategory} value={selectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white bg-opacity-10 text-white border-gray-600">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {eventCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedCountry} value={selectedCountry}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white bg-opacity-10 text-white border-gray-600">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {africanCountries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-500"></div>
        </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {filteredEvents.map((event, index) => (
              <Card key={event.id} className="bg-white bg-opacity-5 border-none overflow-hidden hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer" onClick={() => handleEventClick(event)}>
                <CardContent className="p-0">
                  {event.eventImages && event.eventImages.length > 0 && (
                    event.eventImages.length === 1 ? (
                      <div className="h-48 relative">
                        <Image
                          src={event.eventImages[0]}
                          alt={`${event.eventName} - Image`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{ objectFit: "cover" }}
                          className="rounded-t-lg"
                          priority={index === 0}
                        />
                      </div>
                    ) : (
                      <Slider {...sliderSettings} className="h-48">
                        {event.eventImages.map((image, imageIndex) => (
                          <div key={imageIndex} className="h-48 relative">
                            <Image
                              src={image}
                              alt={`${event.eventName} - Image ${imageIndex + 1}`}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              style={{ objectFit: "cover" }}
                              className="rounded-t-lg"
                              priority={index === 0 && imageIndex === 0}
                            />
                          </div>
                        ))}
                      </Slider>
                    )
                  )}
                  <div className="p-4">
                    <div className="flex items-center text-sm text-gray-400 mb-2">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(event.eventDate)}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 mt-1 line-clamp-2">{event.eventName}</h3>
                    <p className="text-sm mb-2">
                    {event.isFreeEvent ? (
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">Free</span>
                    ) : (
                      <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        From {formatCurrency(Math.min(...event.ticketTypes.map(t => t.price)), event.eventCurrency)}
                      </span>
                    )}
                    </p>
                    <div className="flex items-center text-sm text-gray-400 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="truncate">{event.addressLocation}</span>
                    </div>
                    {getTotalRemainingTickets(event) > 0 && (
                      <div className="flex items-center text-sm text-yellow-400 mt-2">
                        <Zap className="w-4 h-4 mr-1" />
                        <span>{getTotalRemainingTickets(event)} tickets left</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg max-w-xs bg-gray-950 text-white border-l border-gray-800">
          <ScrollArea className="h-[calc(100vh-4rem)] pr-4">
            <SheetHeader className="border-b border-gray-800 pb-4 mb-6">
              <SheetTitle className="text-3xl font-bold text-gray-200">{selectedEvent?.eventName}</SheetTitle>
             
            </SheetHeader>
            <div className="space-y-6">
              {selectedEvent?.eventImages && selectedEvent.eventImages.length > 0 && (
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  <Image
                    src={selectedEvent.eventImages[0]}
                    alt={selectedEvent.eventName}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="relative">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: isDescriptionExpanded ? 'auto' : '3rem' }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <SheetDescription className="text-gray-300 text-md leading-relaxed">
                    {selectedEvent?.eventDescription}
                  </SheetDescription>
                </motion.div>
                {selectedEvent?.eventDescription && selectedEvent.eventDescription.length > 100 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 text-amber-500 hover:text-black"
                    onClick={toggleDescription}
                  >
                    {isDescriptionExpanded ? (
                      <>
                        Read Less <ChevronUp className="ml-1 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Read More <ChevronDown className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-amber-500" />
                  <span>{selectedEvent && formatDate(selectedEvent.eventDate)}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-amber-500" />
                  <span>{selectedEvent?.addressLocation}</span>
                </div>
                <div className="flex items-center">
                  <MdOutlineWebhook className="w-5 h-5 mr-2 text-amber-500" />
                  <span>{selectedEvent?.eventCategory}</span>
                </div>
                {selectedTicketType && selectedTicketType.remainingTickets > 0 && (
                  <div className="flex items-center text-yellow-400">
                    <span>{selectedTicketType.remainingTickets} tickets left</span>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Select Ticket Type</h3>
                <Select 
                  value={selectedTicketType?.name} 
                  onValueChange={handleTicketTypeChange}
                >
                  <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                    <SelectValue placeholder="Select ticket type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white border-gray-700">
                  {selectedEvent?.ticketTypes.map((ticketType) => (
                      <SelectItem key={ticketType.name} value={ticketType.name}>
                        {ticketType.name} - {formatCurrency(ticketType.price, selectedEvent.eventCurrency)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Select Quantity</h3>
            <div className="flex items-center justify-between bg-gray-800 rounded-md p-0.5 max-w-xs max-h-9">
              <Button 
                onClick={decrementTicketQuantity} 
                variant="ghost" 
                size="icon" 
                className="text-white hover:text-black"
                disabled={ticketQuantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-sm font-semibold">{ticketQuantity}</span>
              <Button 
                onClick={incrementTicketQuantity} 
                variant="ghost" 
                size="icon" 
                className="text-white hover:text-black"
                disabled={!selectedTicketType || ticketQuantity >= selectedTicketType.remainingTickets}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Order Summary</h3>
                <div className="space-y-2 bg-gray-800 rounded-md p-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(calculateSubtotal(), selectedEvent?.eventCurrency || '')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fees:</span>
                    <span>{formatCurrency(2 * ticketQuantity, selectedEvent?.eventCurrency || '')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (15%):</span>
                    <span>{formatCurrency(calculateSubtotal() * 0.15, selectedEvent?.eventCurrency || '')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-700">
                    <span>Total:</span>
                    <span className="text-amber-400">{formatCurrency(calculateTotal(), selectedEvent?.eventCurrency || '')}</span>
                  </div>
                </div>
              </div>
              <Button 
                className="w-full py-6 text-lg font-semibold bg-gray-100 hover:bg-amber-500 text-black transition-colors duration-300" 
                onClick={handleBookNow}
              >
                {selectedEvent?.isFreeEvent ? 'Get My Ticket' : 'Book Now'}
              </Button>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </main>
  );
}