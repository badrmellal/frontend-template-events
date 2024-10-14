
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import axios from "axios"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Player } from '@lottiefiles/react-lottie-player'
import { Button } from "@/components/ui/button"
import { CalendarIcon, Headset, LogOut, MapIcon, MapPinIcon, TicketIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import SidebarUser from "@/app/components/sidebar-user"
import Footer from "@/app/components/footer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import dayjs from 'dayjs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface Event {
  id: number;
  eventName: string;
  eventDescription: string;
  eventDate: string;
  addressLocation: string;
  googleMapsUrl: string;
  eventImages: string[];
  remainingTickets: number;
};

interface Ticket {
  quantity: number;
  totalAmount: number;
  currency: string;
  isTicketActive: boolean;
  ticketType: string;
  purchaseDate: string;
  qrCode: string;
}

const MyUpcomingEvents = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [eventTickets, setEventTickets] = useState<Ticket[]>([])
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Session Expired",
          description: "Please login again.",
          variant: "destructive"
        })
        setTimeout(() => router.push("/login"), 2000);
        return;
      } else {
        try {
          const response = await axios.get<Event[]>('http://localhost:8080/events/my-upcoming-events', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          setEvents(response.data)
          setLoading(false)
        } catch (error) {
          console.error('Failed to fetch upcoming events:', error);
          toast({
            title: "Error",
            description: "Failed to get your upcoming events.",
            variant: "destructive"
          })
          setLoading(false)
        }
      }
    }

    fetchUpcomingEvents()
  }, [router, toast]);


  const handleViewTicket = async (event: Event) => {
    setSelectedEvent(event);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<Ticket[]>(`http://localhost:8080/tickets/event-tickets/user/${event.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEventTickets(response.data);
    } catch (error) {
      console.error('Failed to fetch event tickets:', error);
      toast({
        title: "Error",
        description: "Failed to get tickets for this event.",
        variant: "destructive"
      });
    }
  };

  const handleExploreEvents = () => {
    router.push("/user/dashboard")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusBadgeVariant = (isActive: boolean) => {
    return isActive ? "secondary" : "default"
  }

  const handleLogOut = () => {
    localStorage.removeItem("token")
    router.push('/')
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }

    if (events.length === 0) {
      return (
        <Card className="max-w-[360px] mx-auto mb-8">
          <CardContent className="flex flex-col items-center p-6">
            <Player
              autoplay
              loop
              src="https://assets5.lottiefiles.com/packages/lf20_ysrn2iwp.json"
              style={{ height: '300px', width: '300px' }}
            />
            <h2 className="text-xl font-semibold mt-4">No Upcoming Events</h2>
            <p className="text-gray-600 mt-2">
              You haven&apos;t registered for any upcoming events yet.
            </p>
            <Button onClick={handleExploreEvents} className="mt-4">Explore Events</Button>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden flex flex-col">
            <div className="relative h-48">
              <Image
                src={event.eventImages[0] || "/logo-with-bg.png"}
                alt={event.eventName}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl line-clamp-2">{event.eventName}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">{dayjs(event.eventDate).format('MMM D, YYYY h:mm A')}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPinIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">{event.addressLocation}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => window.open(event.googleMapsUrl, '_blank')}
                >
                <MapIcon className="mr-2 h-4 w-4" />
                View on Map
              </Button>
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full" onClick={() => handleViewTicket(event)}>
                    <TicketIcon className="mr-2 h-4 w-4" />
                    View Ticket
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] max-w-[360px] rounded-lg">
                  <DialogHeader>
                    <DialogTitle>{selectedEvent?.eventName}</DialogTitle>
                    <DialogDescription>Your tickets for this event</DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">
                    {eventTickets.map((ticket, index) => (
                      <div key={index} className="mb-4 p-4 border rounded-lg">
                        <p className="font-semibold mb-2">{ticket.ticketType}</p>
                        <p className="text-xs">Quantity: {ticket.quantity}</p>
                        <p className="text-xs">Total Amount: {ticket.totalAmount.toFixed(2)} {ticket.currency}</p>
                        <p className="text-xs">Purchase Date: {formatDate(ticket.purchaseDate)}</p>
                        <Badge className="mt-2" variant={getStatusBadgeVariant(ticket.isTicketActive)}>
                          {ticket.isTicketActive ? "Inactive" : "Active"}
                        </Badge>
                        <div className="mt-4">
                          <Image src={ticket.qrCode} alt="Ticket QR Code" width={250} height={250} />
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <div className="text-black">
        <SidebarUser />
      </div>
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="flex justify-between pl-12 items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-100">Upcoming Events</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <Image
                    src="/profile_avatar.png"
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
                  <Headset className="mr-2 h-4 w-4 text-gray-500" />
                  Support
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogOut}>
                  <LogOut className="mr-2 h-4 w-4 text-gray-500" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {renderContent()}
        </div>
      </div>
      <div className="mt-auto pl-0 sm:pl-14">
        <Footer />
      </div>
    </div>
  )
}

export default MyUpcomingEvents