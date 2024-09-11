"use client"

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { JwtPayload, jwtDecode } from 'jwt-decode'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

interface Ticket {
  id: string
  issueType: string
  status: string
  createdAt: string
  message: string
  responses: Response[]
}

interface Response {
  responderName: string
  createdAt: string
  message: string
}


export default function UserTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [userEmail, setUserEmail] = useState<string>('')
  const [showEmailDialog, setShowEmailDialog] = useState<boolean>(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token)
        const userStoredEmail = decoded.sub;
        if(userStoredEmail){
            setUserEmail(userStoredEmail)
            fetchUserTickets(userStoredEmail)
        }
      } catch (error) {
        console.error('Error decoding token:', error)
        setShowEmailDialog(true)
      }
    } else {
      setShowEmailDialog(true)
    }
  }, [])

  const fetchUserTickets = async (email: string) => {
    try {
      setLoading(true)
      const response = await axios.get<Ticket[]>(`http://localhost:8080/api/support/user/tickets?email=${email}`)
      setTickets(response.data)
    } catch (error) {
      console.error('Error fetching user tickets:', error)
      toast({
        title: "Error",
        description: "Failed to fetch tickets. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setShowEmailDialog(false)
    fetchUserTickets(userEmail)
  }

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-green-500'
      case 'in progress': return 'bg-yellow-500'
      case 'closed': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">My Support Tickets</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="col-span-1 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Ticket List</CardTitle>
              <CardDescription>Select a ticket to view details</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Icons.spinner className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : tickets.length > 0 ? (
                <ScrollArea className="h-[calc(100vh-300px)]">
                  {tickets.map((ticket) => (
                    <Button
                      key={ticket.id}
                      variant="ghost"
                      className="w-full justify-start mb-2 p-4 hover:bg-blue-50 transition-colors duration-200"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <div className="flex flex-col items-start w-full">
                        <div className="flex items-center justify-between w-full mb-2">
                          <span className="font-semibold text-gray-800">{ticket.issueType}</span>
                          <Badge variant="outline" className={`${getStatusColor(ticket.status)} text-white`}>
                            {ticket.status}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
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
              <CardTitle className="text-2xl">{selectedTicket ? selectedTicket.issueType : 'Select a Ticket'}</CardTitle>
              {selectedTicket && (
                <CardDescription>
                  Status: <Badge variant="outline" className={`${getStatusColor(selectedTicket.status)} text-white`}>
                    {selectedTicket.status}
                  </Badge>
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {selectedTicket ? (
                <div>
                  <p className="mb-2"><strong>Created:</strong> {new Date(selectedTicket.createdAt).toLocaleString()}</p>
                  <p className="mb-4"><strong>Message:</strong> {selectedTicket.message}</p>
                  <Separator className="my-4" />
                  <h3 className="text-xl font-semibold mb-4">Responses</h3>
                  {selectedTicket.responses && selectedTicket.responses.length > 0 ? (
                    <ScrollArea className="h-[calc(100vh-500px)]">
                      {selectedTicket.responses.map((response, index) => (
                        <Card key={index} className="mb-4 bg-white shadow">
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
                  ) : (
                    <p className="text-center text-gray-500">No responses yet.</p>
                  )}
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

      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="w-full sm:max-w-md max-w-[90vw] rounded-md">
          <DialogHeader>
            <DialogTitle>Enter Your Email</DialogTitle>
            <DialogDescription>
              We need your email to get your support tickets.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEmailSubmit}>
            <Input
              type="email"
              placeholder="your@email.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
            <DialogFooter className="mt-4">
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}