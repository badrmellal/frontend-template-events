import Link from "next/link"
import { useState } from "react"
import { Calendar, Download, MoreHorizontal, Search, Filter, ArrowUpDown, ChevronDown, ChevronsUpDown, Headset, LogOut } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SidebarPublisher from "@/app/components/sidebar-publisher"
import Image from "next/image"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import TicketDetails from "./ticket-details"

interface Ticket {
  id: string
  eventName: string
  customerName: string
  customerEmail: string
  ticketType: string
  purchaseDate: string
  status: "Valid" | "Used" | "Refunded" 
}

const tickets: Ticket[] = [
  {
    id: "T001",
    eventName: "Summer Beats",
    customerName: "Alice Johnson",
    customerEmail: "alice@example.com",
    ticketType: "VIP",
    purchaseDate: "2024-06-15",
    status: "Valid"
  },
  {
    id: "T002",
    eventName: "Tech Conference",
    customerName: "Bob Smith",
    customerEmail: "bob@example.com",
    ticketType: "Early Bird",
    purchaseDate: "2024-05-20",
    status: "Valid"
  },
  {
    id: "T003",
    eventName: "Summer Beats",
    customerName: "Charlie Brown",
    customerEmail: "charlie@example.com",
    ticketType: "General Admission",
    purchaseDate: "2024-06-18",
    status: "Used"
  },
  {
    id: "T004",
    eventName: "Food & Wine Expo",
    customerName: "Diana Prince",
    customerEmail: "diana@example.com",
    ticketType: "VIP",
    purchaseDate: "2024-06-10",
    status: "Refunded"
  },
  {
    id: "T005",
    eventName: "Tech Conference 2024",
    customerName: "Ethan Hunt",
    customerEmail: "ethan@example.com",
    ticketType: "General Admission",
    purchaseDate: "2024-05-25",
    status: "Used"
  }
]

export default function Tickets() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEvent, setSelectedEvent] = useState("All Events")
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)


  const filteredTickets = tickets.filter(ticket => 
    (ticket.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     ticket.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedEvent === "All Events" || ticket.eventName === selectedEvent) &&
    (selectedStatus === "All Statuses" || ticket.status === selectedStatus)
  )

  const events = Array.from(new Set(tickets.map(ticket => ticket.eventName)))
  const statuses = Array.from(new Set(tickets.map(ticket => ticket.status)))

  const handleViewClick = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setIsSheetOpen(true)
  }

  const handleChangeType = (ticket: Ticket) => {
    // type functionality later
    console.log("Change type for ticket:", ticket.id)
  }

  const handleSendReminder = (ticket: Ticket) => {
    // reminder functionality later
    console.log("Send reminder for ticket:", ticket.id)
  }


  const handleLogOut = () => {
    localStorage.removeItem("token");
    window.location.reload();
};

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
      <main className="flex-1 sm:ml-12 ml-0">
        <div className="container py-8 md:py-10">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Ticket Management</h1>
            <Button>
              <Download className="mr-2 h-4 w-4" /> Export Tickets
            </Button>
          </div>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Ticket Overview</CardTitle>
              <CardDescription>Manage and monitor tickets for all your events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col mb-10 space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
                  <div className="relative">
                  <Search className="absolute h-5 w-5 top-2 left-1 text-gray-500 text-muted-foreground" />
                    <Input
                      placeholder="Search tickets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-7"
                    />
                  </div>
                  <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Filter by event" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Events">All Events</SelectItem>
                      {events.map(event => (
                        <SelectItem key={event} value={event}>{event}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Statuses">All Statuses</SelectItem>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Ticket ID</TableHead>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Ticket Type</TableHead>
                      <TableHead>Purchase Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.id}</TableCell>
                        <TableCell>{ticket.eventName}</TableCell>
                        <TableCell>
                          <div>{ticket.customerName}</div>
                          <div className="text-sm text-muted-foreground">{ticket.customerEmail}</div>
                        </TableCell>
                        <TableCell>{ticket.ticketType}</TableCell>
                        <TableCell>{ticket.purchaseDate}</TableCell>
                        <TableCell>
                          <Badge variant={
                            ticket.status === "Valid" ? "default" :
                            ticket.status === "Used" ? "outline" :
                            ticket.status === "Refunded" ? "destructive" :
                            "secondary"
                          }>
                            {ticket.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onSelect={() => handleViewClick(ticket)}>View Details</DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleChangeType(ticket)}>Change Type</DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleSendReminder(ticket)}>Send Reminder</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Ticket Details</SheetTitle>
            <SheetDescription>View and manage ticket information</SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            <TicketDetails ticket={selectedTicket} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}