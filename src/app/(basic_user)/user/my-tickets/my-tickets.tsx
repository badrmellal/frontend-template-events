'use client'
import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import {Button} from "@/components/ui/button";
import {Alert} from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import {Headset, LogOut} from "lucide-react";
import SidebarUser from "@/app/components/sidebar-user";
import {Badge} from "@/components/ui/badge";
import { useRouter } from 'next/navigation';

enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED'
}

interface MyTicketsProps {
  quantity: number,
  paymentFees: number,
  commission: number,
  totalAmount: number,
  ticketActive: boolean,
  ticketTypeId: string,
  paymentStatus: PaymentStatus,
  paymentMethod: string
}

const MyTickets = () => {

  const [myTickets, setMyTickets] = useState<MyTicketsProps[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")

  const route = useRouter();

  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const response = await axios.get('http://localhost:8080/tickets/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setMyTickets(response.data)
        setLoading(false)
        console.log(response.data)
      } catch (error) {
        console.log(error)
        setError("Failed to load the tickets")
        setLoading(false)
      }
    }
    fetchMyTickets();
  }, [])

  const handleLogOut = () => {
    localStorage.removeItem("token");
    route.push('/')
  }

  return (
      <div className="flex min-h-screen flex-col bg-black text-white">
        <div className='text-black'>
          <SidebarUser/>
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
              <DropdownMenuSeparator className="bg-gray-700"/>
              <DropdownMenuItem className="text-white hover:bg-gray-800"><Headset
                  className="h-4 w-4 mx-1 text-gray-400"/> Support</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogOut} className="text-white hover:bg-gray-800"> <LogOut
                  className="h-4 w-4 mx-1 text-gray-400"/> Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <main className="flex-1 sm:ml-12 ml-0 px-4 py-16">
          <h1 className="text-3xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-600">My
            Tickets</h1>
          {loading ? (
              <p className='text-white'>Loading...</p>
          ) : error ? (
              <Alert variant="destructive">{error}</Alert>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
                {myTickets.map((ticket) => (
                    <Card key={ticket.ticketTypeId} className="w-full ">
                      <CardHeader>
                        <h2 className="text-lg font-semibold">Ticket Type: {ticket.ticketTypeId}</h2>
                      </CardHeader>
                      <CardContent>
                        <p><strong>Quantity:</strong> {ticket.quantity}</p>
                        <p><strong>Payment Fees:</strong> ${ticket.paymentFees.toFixed(2)}</p>
                        <p><strong>Commission:</strong> ${ticket.commission.toFixed(2)}</p>
                        <p><strong>Total Amount:</strong> ${ticket.totalAmount.toFixed(2)}</p>
                        <p><strong>Is Ticket Active:</strong> {ticket.ticketActive ? 'Yes' : 'No'}</p>
                        <Badge className='block w-fit mt-4' variant={
                          ticket.paymentStatus === PaymentStatus.COMPLETED ? "default" :
                          ticket.paymentStatus === PaymentStatus.PENDING ? "secondary" :
                          ticket.paymentStatus === PaymentStatus.FAILED ? "destructive" :
                          ticket.paymentStatus === PaymentStatus.REFUNDED ? "destructive" : "secondary"
                        }>
                          {ticket.paymentStatus}
                        </Badge>                        <Button variant="default" className="mt-4 inline-flex items-center justify-center whitespace-nowrap
                      rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1
                      focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50
                      h-9 px-4 py-2 bg-amber-500 text-black hover:bg-amber-600">View Details</Button>

                      </CardContent>
                    </Card>
                ))}
              </div>
          )}
        </main>
      </div>
  )
}

export default MyTickets;
