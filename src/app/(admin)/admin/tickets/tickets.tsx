import React, { useState, useEffect } from 'react'
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuCheckboxItem, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Filter, 
  Download, 
  Ticket, 
  DollarSign, 
  Hash, 
  CheckCircle, 
  XCircle, 
  Headset,
  LogOut
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import Footer from '@/app/components/footer'
import SidebarAdmin from '@/app/components/sidebar-admin'
import Image from 'next/image'

interface Ticket {
  id: string
  isTicketActive: boolean
  fees: number
  vat: number
  totalAmount: number
  quantity: number
  ticketTypeId: string
  eventName: string
  customerName: string
}

const Tickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
  const { toast } = useToast();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch('/tickets/all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!response.ok) throw new Error('Failed to fetch tickets')
        const data = await response.json()
        setTickets(data)
        setFilteredTickets(data)
      } catch (error) {
        console.error('Error fetching tickets:', error);
        toast({
          title: "Error",
          description: "No tickets found. Please try later!",
          variant: "destructive"
        })
      }
    }

    fetchTickets()
  }, [toast])

  useEffect(() => {
    const results = tickets.filter(ticket =>
      ticket.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticketTypeId.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredTickets(results)
  }, [searchTerm, tickets]);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-black text-white py-10 ml-0 sm:ml-12">
      <div className='text-black'>
      <SidebarAdmin />
      </div>
      <div className="absolute z-20 top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full border-gray-700"
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
          <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
            <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem className="text-white hover:bg-gray-800"><Headset className="h-4 w-4 mx-1 text-gray-400" /> Support</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogOut} className="text-white hover:bg-gray-800"> <LogOut className="h-4 w-4 mx-1 text-gray-400" /> Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="px-4 sm:px-6 lg:px-8 pt-8">
        <Card className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-2xl font-bold text-gray-800">Ticket Management</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
              <div className="flex items-center w-full sm:w-auto">
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm mr-2 bg-white border-gray-300 text-gray-700"
                />
                <Button variant="outline" size="icon" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100">
                      <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white border-gray-200 text-gray-700">
                    <DropdownMenuCheckboxItem checked>Active Tickets</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked>Inactive Tickets</DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100">
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableCaption className="text-gray-500">A list of all tickets purchased by customers.</TableCaption>
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="text-gray-600">Ticket Type ID</TableHead>
                    <TableHead className="text-gray-600">Event Name</TableHead>
                    <TableHead className="text-gray-600">Customer</TableHead>
                    <TableHead className="text-gray-600">Status</TableHead>
                    <TableHead className="text-gray-600">Quantity</TableHead>
                    <TableHead className="text-gray-600">Fees</TableHead>
                    <TableHead className="text-gray-600">VAT</TableHead>
                    <TableHead className="text-gray-600">Total Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id} className="border-b border-gray-200">
                      <TableCell className="font-medium text-gray-700">{ticket.ticketTypeId}</TableCell>
                      <TableCell className="text-gray-700">{ticket.eventName}</TableCell>
                      <TableCell className="text-gray-700">{ticket.customerName}</TableCell>
                      <TableCell>
                        {ticket.isTicketActive ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-700">{ticket.quantity}</TableCell>
                      <TableCell className="text-gray-700">${ticket.fees.toFixed(2)}</TableCell>
                      <TableCell className="text-gray-700">${ticket.vat.toFixed(2)}</TableCell>
                      <TableCell className="text-gray-700">${ticket.totalAmount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <Card className="bg-white border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{tickets.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Tickets</CardTitle>
              <CheckCircle className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {tickets.filter(t => t.isTicketActive).length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ${tickets.reduce((sum, t) => sum + t.totalAmount, 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Ticket Types</CardTitle>
              <Hash className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {new Set(tickets.map(t => t.ticketTypeId)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {tickets.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <XCircle className="h-12 w-12 mb-4" />
            <p className="text-xl">No tickets found</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Tickets;