import {  Download, Headset, LogOut, MoreHorizontal} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import SidebarPublisher from "@/app/components/sidebar-publisher"
import Image from "next/image"
import Footer from "@/app/components/footer"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Event, Ticket } from "@/types/user"
import { jwtDecode } from "jwt-decode"
import axios from "axios"

export default function Attendees() {

  const route = useRouter();
  const [tickets, setTickets] =useState<Ticket[] | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [events, setEvents] = useState<Event[] | undefined>()
  const handleLogOut = () => {
    localStorage.removeItem("token");
    route.push('/login')
  };
//TODO make data dynamic
async function fetchMultipleData() {
  try {
    const token = localStorage.getItem('token');
    //decode token
    if (token) {
      const decodedToken = jwtDecode(token);
      const email = decodedToken.sub;
      const [tickets, events] = await Promise.all([
      axios.get(`http://localhost:8080/publisher/tickets-details/${email}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
        ),
      axios.get(`http://localhost:8080/publisher/events-details/${email}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
        ),
    ]);

    return {
      tickets: tickets.data,
      events: events.data,
    };}
  } catch (error) {
    throw error;
  }
}
useEffect(()=>{
  const fetching = async ()=>{
    try {
      setIsLoading(true);
        const results = await fetchMultipleData();
        setTickets(results?.tickets);
        setEvents(results?.events)
    }catch(err){
      console.error(err);
    }finally {
      setIsLoading(false);
    }
  }
  fetching();
},[])

  return (
    <div className="flex min-h-screen bg-black flex-col">
       <SidebarPublisher />
     <div className="flex justify-end pt-4 pr-4">
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full"
                >
                    <Image
                    src="/profile_avatar.png"
                    width={36}
                    height={36}
                    alt="Avatar"
                    className="overflow-hidden rounded-full"
                    />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><Headset className="h-4 w-4 mx-1 text-gray-500" /> Support</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogOut}> <LogOut className="h-4 w-4 mx-1 text-gray-500" /> Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </div>
      <main className="flex-1 sm:ml-12">
        <div className="container py-6 md:py-10">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Attendees</h1>
            <Button>
              <Download className="mr-2 h-4 w-4" /> Export Attendees
            </Button>
          </div>
          <div className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendee Overview</CardTitle>
                <CardDescription>Manage and monitor attendees across all your events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
                    <Input placeholder="Search attendees..." className="md:max-w-xs" />
                    <Select>
                      <SelectTrigger className="md:max-w-xs">
                        <SelectValue placeholder="Filter by event" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Events</SelectItem>
                        {events?.map((event,index)=>(
                          <SelectItem value="summer-beats-2023" key={index}>{event.eventName}</SelectItem>
                        )) }
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="md:max-w-xs">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Ticket Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        tickets?.map((ticket, index)=>(
                          <TableRow key={index}>
                            <TableCell className="font-medium">{ticket.usersDto.username}</TableCell>
                            <TableCell>{ticket.usersDto.email}</TableCell>
                            <TableCell>{ticket.eventsDto.eventName}</TableCell>
                            <TableCell>{ticket.ticketType}</TableCell>
                            <TableCell><Badge>{ticket.paymentStatus}</Badge></TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem>Edit Information</DropdownMenuItem>
                                  <DropdownMenuItem>Resend Confirmation</DropdownMenuItem>
                                  <DropdownMenuItem>Cancel Ticket</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <div className="sm:pl-14 pl-0">
          <Footer />
        </div>
    </div>
  )
}