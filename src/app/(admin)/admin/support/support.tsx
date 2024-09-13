import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/ui/icons"
import { toast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { JwtPayload, jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import SidebarAdmin from '@/app/components/sidebar-admin'

interface Ticket {
  id: string
  name: string
  email: string
  issueType: string
  message: string
  status: string
  createdAt: string
  responses: Response[]
}

interface Response {
  id: string
  responderName: string
  message: string
  createdAt: string
}

export default function AdminSupport() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const response = await axios.get<Ticket[]>('http://localhost:8080/api/support/tickets')
      setTickets(response.data)
    } catch (error) {
      console.error('Error fetching tickets:', error)
      toast({
        title: "Error",
        description: "Failed to fetch tickets. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket)
  }

  const handleResponseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTicket) return

    try {
        const token = localStorage.getItem("token");
        if(token){
            const decodedToken = jwtDecode<JwtPayload>(token);
            const adminEmail = decodedToken.sub;
            const responseAdminUsername = await axios.get(`http://localhost:8080/user/admin-username/${adminEmail}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });
        
      await axios.post(`http://localhost:8080/api/support/tickets/${selectedTicket.id}/responses`, {
        message: response,
        responderName: responseAdminUsername 
      })
      toast({
        title: "Success",
        description: "Response sent successfully.",
      })
      fetchTickets()
      setResponse('')
    }
    } catch (error) {
      console.error('Error submitting response:', error)
      toast({
        title: "Error",
        description: "Failed to send response. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCloseTicket = async () => {
    if (!selectedTicket) return

    try {
      await axios.put(`http://localhost:8080/api/support/tickets/${selectedTicket.id}/close`)
      toast({
        title: "Success",
        description: "Ticket closed successfully.",
      })
      fetchTickets()
      setSelectedTicket(null)
    } catch (error) {
      console.error('Error closing ticket:', error)
      toast({
        title: "Error",
        description: "Failed to close ticket. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-green-500'
      case 'in progress': return 'bg-yellow-500'
      case 'closed': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true
    return ticket.status.toLowerCase() === filter
  })


  const handleLogOut = () => {
    setIsLoading(true)
    localStorage.removeItem("token")
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <SidebarAdmin />
        <div className="flex justify-end pr-4">
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
              <DropdownMenuItem>
                <Icons.user className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icons.settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icons.headset className="mr-2 h-4 w-4" />
                <span>Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogOut}>
                <Icons.logOut className="mr-2 h-4 w-4" />
                <span>{isLoading ? 'Logging out...' : 'Log out'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-100 mb-8 text-center">Support Ticket Management</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="col-span-1 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Tickets</CardTitle>
              <CardDescription>
                <Select onValueChange={setFilter} defaultValue="all">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter tickets" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tickets</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Icons.spinner className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : filteredTickets.length > 0 ? (
                <ScrollArea className="h-[calc(100vh-300px)]">
                  {filteredTickets.map((ticket) => (
                    <Button
                      key={ticket.id}
                      variant="ghost"
                      className="w-full justify-start mb-2 p-4 hover:bg-blue-50 transition-colors duration-200"
                      onClick={() => handleSelectTicket(ticket)}
                    >
                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-center justify-between w-full mb-2">
                          <span className="font-semibold text-gray-800">{ticket.name}</span>
                          <Badge variant="outline" className={`${getStatusColor(ticket.status)} text-white`}>
                            {ticket.status}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">{ticket.issueType}</span>
                      </div>
                    </Button>
                  ))}
                </ScrollArea>
              ) : (
                <p className="text-center text-gray-500">No tickets found.</p>
              )}
            </CardContent>
          </Card>
          <Card className="col-span-1 lg:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">{selectedTicket ? 'Ticket Details' : 'Select a Ticket'}</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedTicket ? (
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="font-semibold">Name:</p>
                      <p>{selectedTicket.name}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Email:</p>
                      <p>{selectedTicket.email}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Issue Type:</p>
                      <p>{selectedTicket.issueType}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Status:</p>
                      <Badge variant="outline" className={`${getStatusColor(selectedTicket.status)} text-white`}>
                        {selectedTicket.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="font-semibold">Message:</p>
                  <p className="mb-4">{selectedTicket.message}</p>
                  <Separator className="my-4" />
                  <h3 className="text-xl font-semibold mb-4">Responses</h3>
                  <ScrollArea className="h-[calc(100vh-700px)]">
                    {selectedTicket.responses.map((response) => (
                      <Card key={response.id} className="mb-4 bg-white shadow">
                        <CardHeader>
                          <CardTitle className="text-sm font-medium text-blue-600">{response.responderName}</CardTitle>
                          <CardDescription>{new Date(response.createdAt).toLocaleString()}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700">{response.message}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </ScrollArea>
                  <form onSubmit={handleResponseSubmit} className="mt-4">
                    <Textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Enter your response"
                      className="w-full mb-2"
                    />
                    <div className="flex justify-between">
                      <Button type="submit">Send Response</Button>
                      {selectedTicket.status.toLowerCase() !== 'closed' && (
                        <Button onClick={handleCloseTicket} variant="outline">Close Ticket</Button>
                      )}
                    </div>
                  </form>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <Icons.inbox className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-500">Select a ticket to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}