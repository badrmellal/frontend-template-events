import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from "date-fns";
import { Calendar as CalendarIcon, Headset, LogOut, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SidebarPublisher from '@/app/components/sidebar-publisher';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { JwtPayload, jwtDecode } from 'jwt-decode';

interface Event {
  id: string;
  eventName: string;
  eventCategory: string;
  eventDescription: string;
  eventImage: string;
  eventPrice: number;
  eventDate: string;
  addressLocation: string;
  totalTickets: number;
  soldTickets: number;
}


const MyEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
        const token = localStorage.getItem("token");
        if(!token){
            throw new Error("No token found.")
        }
        const decodedToken = jwtDecode<JwtPayload>(token);
        const tokenEmail = decodedToken.sub;

      const response = await axios.get(`http://localhost:8080/events/publisher/${tokenEmail}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setEvents(response.data);
      setIsLoading(false);
    } catch (error: any) {
      console.error('Error fetching events:', error);
      if (error.response && error.response.status === 401) {
        setIsTokenExpired(true);
      } else {
        toast({
          variant: "destructive",
          title: "Error fetching events",
          description: "Please try again later.",
        });
      }
      setIsLoading(false);
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const handleEditEvent = (eventId: string) => {
    //  edit functionality later
    console.log(`Edit event with ID: ${eventId}`);
  };

  const handleDeleteEvent = (eventId: string) => {
    //  delete functionality later
    console.log(`Delete event with ID: ${eventId}`);
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <SidebarPublisher />
      <div className="flex justify-end pt-3 pr-3">
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
      <div className="max-w-7xl mx-auto p-8 sm:p-12 md:p-16">
        <div className="bg-black p-8 rounded-lg shadow-lg">
          <h2 className="text-4xl font-extrabold text-white text-center mb-8">My Created Events</h2>
          {isLoading ? (
            <p className="text-white text-center">Loading events...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <Card key={event.id} className="bg-gray-800 text-white">
                  <CardHeader>
                    <CardTitle>{event.eventName}</CardTitle>
                    <CardDescription className="text-gray-400">{event.eventCategory}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Image
                      src={event.eventImage}
                      alt={event.eventName}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <p className="mb-2">{event.eventDescription}</p>
                    <p className="mb-2">
                      <CalendarIcon className="inline-block mr-2" />
                      {format(new Date(event.eventDate), "PPP p")}
                    </p>
                    <p className="mb-2">Location: {event.addressLocation}</p>
                    <p className="mb-2">Price: ${event.eventPrice}</p>
                    <p>Tickets: {event.soldTickets} / {event.totalTickets}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                    className="text-black hover:text-white hover:bg-black"
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditEvent(event.id)}
                    >
                      <Edit className="h-4 w-4 mr-2 " />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      {isTokenExpired &&  
        <Dialog open={isTokenExpired} onOpenChange={setIsTokenExpired}> 
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Token Expired</DialogTitle>
              <DialogDescription>
                Please login again to continue!
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="submit" 
                onClick={() => {localStorage.removeItem("token"), window.location.href="/login" }}
              >
                Login
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    </div>
  );
};

export default MyEvents;