
import React, { useEffect, useState } from 'react'
import axios from "axios"
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"
import { Headset, LogOut, Filter, Download, Printer } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from 'next/navigation'
import Footer from '@/app/components/footer'
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
import { Input } from "@/components/ui/input"
import SidebarUser from '@/app/components/sidebar-user'
import { useToast } from '@/components/ui/use-toast'

interface EventsDto {
  id: number
  eventName: string
  eventDescription: string
  eventDate: string
  eventCurrency: string
}

interface MyTicketsProps {
  quantity: number
  paymentFees: number
  commission: number
  totalAmount: number
  currency: number
  isTicketActive: boolean
  ticketType: string
  purchaseDate: string
  eventsDto: EventsDto
  qrCode: string // Assuming the QR code is like string (base64 encoded image)
}

const MyTickets = () => {
  const [myTickets, setMyTickets] = useState<MyTicketsProps[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTicket, setSelectedTicket] = useState<MyTicketsProps | null>(null)
  const router = useRouter()
  const {toast} = useToast();

  useEffect(() => {
    const fetchMyTickets = async () => {
      const token = localStorage.getItem('token');
      if(!token){
          toast({
              title: "Session Expired",
              description: "Please login again.",
              variant: "destructive"
          })
          setTimeout(()=> router.push("/login"), 2000);
          return;
        }  else {
          try {
            const response = await axios.get('http://localhost:8080/tickets/user', {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}` 
              }
            })
            setMyTickets(response.data)
            setLoading(false)
          } catch (error) {
            console.error(error)
            setError("Failed to load the tickets")
            setLoading(false)
          } 
        }
    }
    fetchMyTickets()
  }, [router, toast])

  const handleLogOut = () => {
    localStorage.removeItem("token")
    router.push('/')
  }

  const isTicketValid = (eventDate: string) => {
    const currentDate = new Date()
    const ticketDate = new Date(eventDate)
    ticketDate.setHours(ticketDate.getHours() + 10) // Plus 10 hours to the event date 
    return ticketDate > currentDate
  }

  const getTicketStatus = (isActive: boolean, eventDate: string) => {
    if (!isTicketValid(eventDate)) return "Expired"
    return isActive ? "Active" : "Inactive"
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active": return "secondary"
      case "Inactive": return "default"
      case "Expired": return "destructive"
      default: return "default"
    }
  }

  const filteredTickets = myTickets.filter(ticket => {
    const status = getTicketStatus(ticket.isTicketActive, ticket.eventsDto.eventDate)
    return (selectedStatus === "All Statuses" || selectedStatus === status) &&
      (ticket.eventsDto.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       ticket.ticketType.toLowerCase().includes(searchTerm.toLowerCase()))
  })


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const handleShowTicket = (ticket: MyTicketsProps) => {
    setSelectedTicket(ticket)
  }

  const handleViewEventDetails = () => {
    if (selectedTicket) {
      router.push(`/user/event-details/${selectedTicket.eventsDto.id}`)
    }
  }

  const TicketCard = ({ ticket }: { ticket: MyTicketsProps }) => (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <h3 className="font-bold text-lg mb-2">{ticket.eventsDto.eventName}</h3>
        <p className="text-sm text-gray-500 mb-2">Ticket Type: {ticket.ticketType}</p>
        <p className="text-sm mb-2">Quantity: {ticket.quantity}</p>
        <p className="text-sm mb-2">Total Amount: {ticket.totalAmount.toFixed(2)} {ticket.eventsDto.eventCurrency}</p>
        <p className="text-sm mb-2">Purchase Date: {formatDate(ticket.purchaseDate)}</p>
        <div className="flex justify-between items-center mt-4">
        <Badge variant={getStatusBadgeVariant(status)}>
              {status}
            </Badge>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => handleShowTicket(ticket)}>Show</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[350px] rounded-md">
              <DialogHeader>
                <DialogTitle>{ticket.eventsDto.eventName}</DialogTitle>
                <DialogDescription>Ticket QR Code</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center">
                <Image src={ticket.qrCode} alt="Ticket QR Code" width={200} height={200} />
                <Button onClick={handleViewEventDetails} className="mt-4">Event Details</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex min-h-screen flex-col bg-black sm:pl-16 pl-0 sm:pt-8 pt-0">
      <header>
        <SidebarUser />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-100 ml-12 sm:ml-0">My Tickets</h1>
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
      </header>

      <main className="flex-1 bg-black max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[180px] bg-white text-black">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Statuses">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  placeholder="Search events or tickets"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            {/* Mobile view as cards */}
            <div className="md:hidden">
              {filteredTickets.map((ticket) => (
                <TicketCard key={ticket.ticketType} ticket={ticket} />
              ))}
            </div>

            {/* Desktop view as table */}
            <div className="hidden md:block">
              <Card>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Event</TableHead>
                          <TableHead>Ticket Type</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Total Amount</TableHead>
                          <TableHead>Purchase Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTickets.map((ticket) => (
                          <TableRow key={ticket.ticketType}>
                            <TableCell>{ticket.eventsDto.eventName}</TableCell>
                            <TableCell>{ticket.ticketType}</TableCell>
                            <TableCell>{ticket.quantity}</TableCell>
                            <TableCell>{ticket.totalAmount.toFixed(2)} {ticket.eventsDto.eventCurrency}</TableCell>
                            <TableCell>{formatDate(ticket.purchaseDate)}</TableCell>
                            <TableCell>
                            <Badge variant={getStatusBadgeVariant(status)}>
                                  {status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => handleShowTicket(ticket)}>Show</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>{ticket.eventsDto.eventName}</DialogTitle>
                                    <DialogDescription>Ticket QR Code</DialogDescription>
                                  </DialogHeader>
                                  <div className="flex flex-col items-center">
                                    <Image src={ticket.qrCode} alt="Ticket QR Code" width={200} height={200} />
                                    <Button onClick={handleViewEventDetails} className="mt-4">Event Details</Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default MyTickets