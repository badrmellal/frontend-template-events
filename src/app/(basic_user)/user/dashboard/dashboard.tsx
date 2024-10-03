
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Image from 'next/image'
import { 
  Ticket, 
  Calendar, 
  Star, 
  MapPin, 
  Headset, 
  LogOut,
  TrendingUp,
  Users,
  Music,
  Utensils,
  BookOpen,
  Share2,
  Waves,
  Dumbbell,
  Film,
  Building2,
  Mic2,
  Briefcase,
  Globe,
  Search,
  QrCode,
  ChevronUp,
  ChevronDown,
  Minus,
  Plus,
  ArrowRight
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import SidebarUser from "@/app/components/sidebar-user"
import Footer from "@/app/components/footer"
import { useToast } from '@/components/ui/use-toast'
import { FaCampground, FaCar, FaGamepad, FaGraduationCap, FaHandPointRight, FaHeart, FaLeftRight, FaPalette, FaUtensils } from 'react-icons/fa6'
import { motion, AnimatePresence } from 'framer-motion'
import { africanCountries, formatCurrency } from '@/app/api/currency/route'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ReactCountryFlag from 'react-country-flag'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { calculateFeesAndCommission } from '@/app/components/fees'



interface UserInfo {
  id: number
  username: string
  email: string
  profileImageUrl: string
  phoneNumber: string
  role: string
  joinDate: string
  lastLoginDate: string
  lastLoginDateDisplay: string
  enabled: boolean
  verificationToken: string
  verificationTokenExpiryDate: string
  totalTickets: number
  loyaltyPoints: number
}

interface UserStats {
  username: string
  totalTickets: number
  upcomingEvents: number
  loyaltyPoints: number
}

interface RecommendedEvent {
  id: string
  eventName: string
  eventDate: string
  addressLocation: string
  eventCategory: string
  isFreeEvent: boolean
  eventCurrency: string
  ticketTypes: TicketType[]
  eventImages: string[]
  eventDescription: string
}

interface LoyaltyProgram {
  tier: string
  currentPoints: number
  pointsToNextTier: number
  benefits: string
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
    commission: number;
    paymentFees: number;
    total: number;
  }

interface DashboardState {
    userStats: UserStats
    recommendedEvents: RecommendedEvent[]
    loading: boolean
    userInfo: UserInfo | null
    loyaltyProgram: LoyaltyProgram | null
    inviteCode: string
    searchQuery: string
    selectedCurrency: string
    isSheetOpen: boolean;
    selectedEvent: RecommendedEvent | null;
    selectedTicketType: TicketType | null;
    ticketQuantity: number;
    isDescriptionExpanded: boolean;
}
  
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  }
  
  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  }

export default function UserDashboard() {
  const router = useRouter()
  const [state, setState] = useState<DashboardState>({
    userStats: {
        username: '',
        totalTickets: 0,
        upcomingEvents: 0,
        loyaltyPoints: 0
      },
      recommendedEvents: [],
      loading: true,
      userInfo: null,
      loyaltyProgram: null,
      inviteCode: '',
      searchQuery: '',
      selectedCurrency: 'All',
      isSheetOpen: false,
      selectedEvent: null,
      selectedTicketType: null,
      ticketQuantity: 1,
      isDescriptionExpanded: false
    })
  const { toast } = useToast()

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (!storedToken) {
      router.push("/login")
    } else {
      fetchUserData(storedToken)
    }
  }, [router])

  const fetchUserData = async (token: string) => {
    try {
      const [
        userInfoResponse,
        recommendedEventsResponse,
        loyaltyProgramResponse,
        inviteCodeResponse
      ] = await Promise.all([
        axios.get<UserInfo>("http://localhost:8080/user/user-info", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get<RecommendedEvent[]>("http://localhost:8080/events/home", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get<LoyaltyProgram>("http://localhost:8080/user/loyalty-program", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get<string>("http://localhost:8080/user/generate-invite-code", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])
      
      const userInfo = userInfoResponse.data

      setState(prevState => ({
        ...prevState,
        userInfo: userInfo,
        userStats: {
          username: userInfo.username || 'User',
          totalTickets: userInfo.totalTickets || 0,
          upcomingEvents: 0,
          loyaltyPoints: userInfo.loyaltyPoints || 0
        },
        recommendedEvents: recommendedEventsResponse.data.slice(0, 3),
        loyaltyProgram: loyaltyProgramResponse.data,
        inviteCode: inviteCodeResponse.data,
        loading: false
      }))
    } catch (error) {
      console.error("Failed to fetch user data", error)
      toast({
        title: "Error",
        description: "Failed to fetch your data!",
        variant: "destructive"
      })
      setState(prevState => ({ ...prevState, loading: false }))
    }
  }

  const handleEventClick = (event: RecommendedEvent) => {
    setState(prevState => ({
      ...prevState,
      selectedEvent: event,
      selectedTicketType: event.ticketTypes[0],
      ticketQuantity: 1,
      isSheetOpen: true,
      isDescriptionExpanded: false
    }));
  };

  const toggleDescription = () => {
    setState(prevState => ({
      ...prevState,
      isDescriptionExpanded: !prevState.isDescriptionExpanded
    }));
  };

  const handleTicketTypeChange = (value: string) => {
    const newSelectedTicketType = state.selectedEvent?.ticketTypes.find(t => t.name === value) || null;
    setState(prevState => ({
      ...prevState,
      selectedTicketType: newSelectedTicketType,
      ticketQuantity: 1
    }));
  };

  const incrementTicketQuantity = () => {
    if (state.selectedTicketType && state.ticketQuantity < state.selectedTicketType.remainingTickets) {
      setState(prevState => ({
        ...prevState,
        ticketQuantity: prevState.ticketQuantity + 1
      }));
    }
  };

  const decrementTicketQuantity = () => {
    if (state.ticketQuantity > 1) {
      setState(prevState => ({
        ...prevState,
        ticketQuantity: prevState.ticketQuantity - 1
      }));
    }
  };

  const calculateTotal = () => {
    if (state.selectedEvent && state.selectedTicketType) {
      const isOrganization = false; 
      const { stripeFee, commission, totalToCharge } = calculateFeesAndCommission(
        state.selectedTicketType.price,
        state.ticketQuantity,
        isOrganization,
        state.selectedEvent.eventCurrency
      );
      return { 
        subtotal: state.selectedTicketType.price * state.ticketQuantity, 
        stripeFee, 
        commission, 
        totalToCharge,
      };
    }
    return { 
        subtotal: 0, 
        stripeFee: 0, 
        commission: 0, 
        totalToCharge: 0,
      };
    };
  const handleBookNow = () => {
    if (state.selectedEvent && state.selectedTicketType) {
        const isOrganization = false; 
        const { stripeFee, commission, totalToCharge } = calculateFeesAndCommission(
          state.selectedTicketType.price,
          state.ticketQuantity,
          isOrganization,
          state.selectedEvent.eventCurrency
        );
  
        const bookingDetails: BookingDetails = {
          eventId: parseInt(state.selectedEvent.id),
          ticketType: state.selectedTicketType.name,
          quantity: state.ticketQuantity,
          price: state.selectedTicketType.price * state.ticketQuantity,
          paymentFees: stripeFee,
          commission,
          total: totalToCharge,
        };
  
        localStorage.setItem('currentBooking', JSON.stringify(bookingDetails));
        router.push(`/user/event-details/${state.selectedEvent.id}`);
    } else {
      toast({
        title: "Error",
        description: "Select ticket type.",
        variant: "destructive"
      });
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("token")
    window.location.reload()
  }

  const getCategoryIcon = (category: string): React.ReactNode => {
    switch (category.toLowerCase()) {
      case 'night party': return <Music className="h-4 w-4" />
      case 'swimming party': return <Waves className="h-4 w-4" />
      case 'sport & fitness': return <Dumbbell className="h-4 w-4" />
      case 'media & films': return <Film className="h-4 w-4" />
      case 'government': return <Building2 className="h-4 w-4" />
      case 'concert': return <Mic2 className="h-4 w-4" />
      case 'conference': return <Users className="h-4 w-4" />
      case 'startups & business': return <Briefcase className="h-4 w-4" />
      case 'food & drink': return <FaUtensils className="h-4 w-4" />
      case 'art & culture': return <FaPalette className="h-4 w-4" />
      case 'education': return <FaGraduationCap className="h-4 w-4" />
      case 'outdoor & adventure': return <FaCampground className="h-4 w-4" />
      case 'automotive': return <FaCar className="h-4 w-4" />
      case 'charity & causes': return <FaHeart className="h-4 w-4" />
      case 'gaming': return <FaGamepad className="h-4 w-4" />
      default: return <Star className="h-4 w-4" /> 
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState(prevState => ({ ...prevState, searchQuery: event.target.value }))
  }

  const handleCurrencyChange = (value: string) => {
    setState(prevState => ({ ...prevState, selectedCurrency: value }))
  }

  const filteredEvents = state.recommendedEvents.filter(event => 
    event.eventName.toLowerCase().includes(state.searchQuery.toLowerCase()) &&
    (state.selectedCurrency === 'All' || event.eventCurrency === state.selectedCurrency)
  )

  const handleShare = async () => {
    const shareUrl = `http://localhost:3000/invited-user/${state.inviteCode}`
    const shareData = {
      title: 'Join me on myticket.africa!',
      text: 'Use my invite code to sign up and get started!',
      url: shareUrl,
    }

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
        toast({
          title: "Shared successfully!",
          description: "Your invite link has been shared.",
          variant: "default",
        })
      } catch (error) {
        console.error('Error sharing:', error)
        fallbackShare()
      }
    } else {
      fallbackShare()
    }
  }

  const fallbackShare = () => {
    navigator.clipboard.writeText(`http://localhost:3000/invited-user/${state.inviteCode}`)
    toast({
      title: "Copied to clipboard!",
      description: "Your invite link has been copied. You can now paste and share it.",
      variant: "default",
    })
  }

  const handleQrCodeClick = ()=> {
    router.push("/docs/qrcode")
  }

  if (state.loading) {
    return (
      <div className="flex justify-center bg-black items-center min-h-screen">
        <motion.div 
          className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-500 border-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        ></motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
    <div className="text-black">
      <SidebarUser />
    </div>
    <motion.div 
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
      <div className="flex-1 pl-0 sm:pl-12 pt-10">
        <div className="p-5">
        <motion.div 
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="sm:text-4xl text-2xl ml-6 font-bold">Welcome, {state.userStats.username}!</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                >
                  <Image
                    src={state.userInfo?.profileImageUrl || "/profile_avatar.png"}
                    width={36}
                    height={36}
                    alt="Avatar"
                    className="rounded-full"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Headset className="h-4 w-4 mr-2" />
                  Support
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>

          <div className="w-full overflow-x-auto">
            <motion.div 
                className="flex flex-nowrap gap-6 pb-4 pt-2 sm:pl-6 pl-0 min-w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card onClick={()=> router.push('/user/my-tickets')} className="flex-shrink-0 w-72 cursor-pointer hover:scale-105 transition-transform duration-150">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                    <Ticket className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{state.userStats.totalTickets}</div>
                </CardContent>
                </Card>
                <Card onClick={()=> router.push('/user/upcoming-events')} className="flex-shrink-0 w-72 cursor-pointer hover:scale-105 transition-transform duration-150">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                    <Calendar className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{state.userStats.upcomingEvents}</div>
                </CardContent>
                </Card>
                <Card className="flex-shrink-0 w-72 cursor-pointer hover:scale-105 transition-transform duration-150">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Loyalty Points</CardTitle>
                    <Star className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{state.userStats.loyaltyPoints}</div>
                    <Progress value={(state.userStats.loyaltyPoints % 100) / 100 * 100} className="mt-2" />
                    <p className="text-xs text-gray-600 mt-1">
                    {state.loyaltyProgram?.pointsToNextTier} points to next reward
                    </p>
                </CardContent>
                </Card>
                <Card onClick={handleQrCodeClick} className="flex-shrink-0 w-72 cursor-pointer hover:scale-105 transition-transform duration-150">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">How to use your Qr Code</CardTitle>
                    <QrCode className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent className="flex flex-row space-x-2">
                    <div className="text-2xl text-gray-800 font-bold">Explore</div>
                    <ArrowRight className="mt-1 p-1"/>
                </CardContent>
                </Card>
            </motion.div>
            </div>
           

          <Card className="mb-8 bg-transparent text-white border-0">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-bold flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-amber-500" />
                Recommended Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center items-start mb-4">
                <div className="relative items-center mb-4 sm:mb-0">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                  <Input
                    placeholder="Search events..."
                    value={state.searchQuery}
                    onChange={handleSearch}
                    className="sm:w-80 w-64 pl-10 pr-4 py-2 "
                  />
                </div>
                <div className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-amber-500" />
                  <Select onValueChange={handleCurrencyChange} value={state.selectedCurrency}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Countries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Countries</SelectItem>
                      {africanCountries.map(country => (
                        <SelectItem key={country.currency.code} value={country.currency.code}>
                        <div className="flex items-center">
                            <ReactCountryFlag 
                            countryCode={country.code} 
                            svg 
                            style={{
                                width: '1em',
                                height: '1em',
                                marginRight: '0.5em'
                            }}
                            />
                            {country.name}
                        </div>
                        </SelectItem>
                    ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <AnimatePresence>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {filteredEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="border-0">
                        <Image
                          src={event.eventImages[0] || "/logo-with-bg.png"}
                          alt={event.eventName}
                          width={300}
                          height={200}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{event.eventName}</h3>
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{event.addressLocation}</span>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <Badge variant="secondary" className="flex items-center">
                              {getCategoryIcon(event.eventCategory)}
                              <span className="ml-1">{event.eventCategory}</span>
                            </Badge>
                            <span className="font-bold">
                              {event.isFreeEvent ? 'Free' : formatCurrency(event.ticketTypes[0]?.price || 0, event.eventCurrency)}
                            </span>
                          </div>
                          <Button className="w-full mt-4" onClick={()=> handleEventClick(event)}>View</Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>


          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Invite Friends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Invite your friends and earn loyalty points for each sign-up! 
                </p>
                <div className="flex items-center space-x-2">
                  <Input
                    value={`http://localhost:3000/invited-user/${state.inviteCode}`}
                    readOnly
                  />
                  <Button size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Loyalty Program
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Your current tier: <span className="font-bold">{state.loyaltyProgram?.tier}</span>
                </p>
                <Progress 
                  value={state.loyaltyProgram ? (state.loyaltyProgram.currentPoints / (state.loyaltyProgram.currentPoints + state.loyaltyProgram.pointsToNextTier)) * 100 : 0} 
                  className="mb-2" 
                />
                <p className="text-sm text-muted-foreground">
                  {state.loyaltyProgram?.pointsToNextTier} more points to reach next tier
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Benefits: {state.loyaltyProgram?.benefits}
                </p>
                <Button className="w-full mt-4">View Details</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

         {/* Sheet component */}
        <Sheet open={state.isSheetOpen} onOpenChange={(open) => setState(prevState => ({ ...prevState, isSheetOpen: open }))}>
        <SheetContent className="w-full sm:max-w-md max-w-xs bg-gray-950 text-white border-l border-gray-800">
            <ScrollArea className="h-[calc(100vh-4rem)] pr-4">
            <SheetHeader className="border-b border-gray-800 pb-4 mb-6">
                <SheetTitle className="text-3xl font-bold text-gray-200">{state.selectedEvent?.eventName ?? 'Event Details'}</SheetTitle>
            </SheetHeader>
            {state.selectedEvent ? (
                <div className="space-y-6">
                {state.selectedEvent.eventImages && state.selectedEvent.eventImages.length > 0 && (
                    <div className="aspect-video relative rounded-lg overflow-hidden">
                    <Image
                        src={state.selectedEvent.eventImages[0]}
                        alt={state.selectedEvent.eventName}
                        fill
                        className="object-cover"
                    />
                    </div>
                )}
                <div className="relative">
                    <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: state.isDescriptionExpanded ? 'auto' : '3rem' }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                    >
                    <SheetDescription className="text-gray-300 text-md leading-relaxed">
                        {state.selectedEvent.eventDescription}
                    </SheetDescription>
                    </motion.div>
                    {state.selectedEvent.eventDescription && state.selectedEvent.eventDescription.length > 100 && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-2 text-amber-500 hover:text-black"
                        onClick={toggleDescription}
                    >
                        {state.isDescriptionExpanded ? (
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
                    <span>{new Date(state.selectedEvent.eventDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-amber-500" />
                    <span>{state.selectedEvent.addressLocation}</span>
                    </div>
                    <div className="flex items-center">
                    {getCategoryIcon(state.selectedEvent.eventCategory)}
                    <span className="ml-2">{state.selectedEvent.eventCategory}</span>
                    </div>
                    {state.selectedTicketType && state.selectedTicketType.remainingTickets > 0 && (
                    <div className="flex items-center text-yellow-400">
                        <span>{state.selectedTicketType.remainingTickets} tickets left</span>
                    </div>
                    )}
                </div>
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">Select Ticket Type</h3>
                    <Select 
                    value={state.selectedTicketType?.name} 
                    onValueChange={handleTicketTypeChange}
                    >
                    <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                        <SelectValue placeholder="Select ticket type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white border-gray-700">
                        {state.selectedEvent.ticketTypes.map((ticketType) => (
                        <SelectItem key={ticketType.name} value={ticketType.name}>
                            {ticketType.name} - {formatCurrency(ticketType.price, state.selectedEvent?.eventCurrency || '')}
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
                        disabled={state.ticketQuantity <= 1}
                    >
                        <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-semibold">{state.ticketQuantity}</span>
                    <Button 
                        onClick={incrementTicketQuantity} 
                        variant="ghost" 
                        size="icon" 
                        className="text-white hover:text-black"
                        disabled={!state.selectedTicketType || state.ticketQuantity >= state.selectedTicketType.remainingTickets}
                    >
                        <Plus className="h-3 w-3" />
                    </Button>
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">Order Summary</h3>
                    {(() => {
                        const { subtotal, stripeFee, commission, totalToCharge } = calculateTotal();
                        return (
                        <>
                            <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>{formatCurrency(subtotal, state.selectedEvent?.eventCurrency || '')}</span>
                            </div>
                            <div className="flex justify-between">
                            <span>Payment fees:</span>
                            <span>{formatCurrency(stripeFee, state.selectedEvent?.eventCurrency || '')}</span>
                            </div>
                            <div className="flex justify-between">
                            <span>Commission:</span>
                            <span>{formatCurrency(commission, state.selectedEvent?.eventCurrency || '')}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-700">
                            <span>Total:</span>
                            <span className="text-amber-400">{formatCurrency(totalToCharge, state.selectedEvent?.eventCurrency || '')}</span>
                            </div>
                        </>
                        );
                    })()}
                </div>
                <Button 
                    className="w-full py-6 text-lg font-semibold bg-gray-100 hover:bg-amber-500 text-black transition-colors duration-300" 
                    onClick={handleBookNow}
                >
                    {state.selectedEvent.isFreeEvent ? 'Get My Ticket' : 'Book Now'}
                </Button>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full">
                <p>No event selected</p>
                </div>
            )}
            </ScrollArea>
        </SheetContent>
        </Sheet>
      <Footer />
      </div>
    </motion.div>
    </div>

  )
}