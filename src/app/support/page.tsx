'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icons } from "@/components/ui/icons"
import axios from 'axios'
import { useToast } from '@/components/ui/use-toast'

interface Ticket{
  name: string,
  email: string,
  issueType: string,
  message: string
}

export default function SupportPage() {
  const [supportMethod, setSupportMethod] = useState<string | undefined>()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [issueType, setIssueType] = useState<string | undefined>()
  const [message, setMessage] = useState('')
  const {toast} = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ticket: Ticket = {
      name,
      email,
      issueType: issueType || '',
      message
    }

    if (!name || !email || !issueType || !message) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields."
      })
      return
    }

    try {
      const response = await axios.post('http://localhost/api/support/create-ticket', ticket)
      if(response.status === 201) {
        toast({
          title: "Ticket submitted",
          description: "Wait for our team to review your request."
        })
  
        setName('')
        setEmail('')
        setIssueType(undefined)
        setMessage('')
        console.log('Ticket submitted:', response.data)
      } else{
        toast({
          variant: "destructive",
          title: "Error Submitting",
          description: "Please try again."
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error happened on our side. Try again later."
      })
      console.error('Error submitting ticket:', error)
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center p-4 py-8 bg-black">
      <Card className="w-full max-w-4xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">Support Center</CardTitle>
          <CardDescription className="text-center">How can we assist you today?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button 
              variant="outline" 
              className="h-32 flex flex-col items-center justify-center space-y-2"
              onClick={() => setSupportMethod('ticket')}
            >
              <Icons.ticket className="h-8 w-8" />
              <span>Submit a Ticket</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-32 flex flex-col items-center justify-center space-y-2"
              onClick={() => setSupportMethod('email')}
            >
              <Icons.mail className="h-8 w-8" />
              <span>Email Support</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-32 flex flex-col items-center justify-center space-y-2"
              onClick={() => setSupportMethod('phone')}
            >
              <Icons.phone className="h-8 w-8" />
              <span>Phone Support</span>
            </Button>
          </div>

          {supportMethod === 'ticket' && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" 
                 value={name} 
                onChange={(e) => setName(e.target.value)} 
                required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
                required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issue-type">Issue Type</Label>
                <Select required onValueChange={(value) => setIssueType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="account">Account Issue</SelectItem>
                    <SelectItem value="billing">Billing Inquiry</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Describe your issue..."
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                required />
              </div>
              <Button type="submit" className="w-full">Submit Ticket</Button>
            </form>
          )}

          {supportMethod === 'email' && (
            <div className="mt-6 text-center">
              <p className="mb-4">Send us an email at:</p>
              <a href="mailto:support@showtimeafrica.com" className="text-primary text-lg font-semibold hover:underline">
                support@showtimeafrica.com
              </a>
            </div>
          )}

          {supportMethod === 'phone' && (
            <div className="mt-6 text-center">
              <p className="mb-4">Call us at:</p>
              <a href="tel:+44766267980" className="text-primary text-lg font-semibold hover:underline">
                +44 (766) 267-980
              </a>
              <p className="mt-2 text-sm text-muted-foreground">
                Available Monday to Friday, 9AM - 5PM EST
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-gray-600 italic text-muted-foreground">
            We typically respond within 24 hours.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}