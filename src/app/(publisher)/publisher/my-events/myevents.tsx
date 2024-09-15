import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Headset, LogOut, Edit, Trash2, MapPin, DollarSign, Ticket, X, Clock, CheckCircle, Plus, Eye, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SidebarPublisher from '@/app/components/sidebar-publisher';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion, AnimatePresence } from 'framer-motion';
import EditEventModal from './edit-event';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TicketType {
  name: string;
  price: number;
  currency: string;
  totalTickets: number;
  soldTickets: number;
  isFree: boolean;
  ticketTypeId?: string;
}


interface Event {
  id: string;
  eventName: string;
  eventCategory: string;
  eventDescription: string;
  eventImages: string[];
  eventVideo: string | null;
  isFreeEvent: boolean;
  eventCurrency: string;
  eventDate: string;
  addressLocation: string;
  googleMapsUrl: string;
  ticketTypes: TicketType[];
  approved: boolean;
  totalTickets: number;
  soldTickets: number;
}

const ExpandableImage: React.FC<{ src: string; alt: string; onClose: () => void }> = ({ src, alt, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="relative max-w-4xl max-h-[90vh] w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          layout="fill"
          objectFit="contain"
          className="rounded-lg"
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
        >
          <X size={24} />
        </button>
      </motion.div>
    </motion.div>
  );
};


const useDeleteEvent = () => {
  const { toast } = useToast();

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`http://localhost:8080/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Event deleted successfully"
        });
        return true;
      }
    } catch (error: any) {
      let errorMessage = "An error occurred. Please try again.";
      if (error.response) {
        switch (error.response.status) {
          case 404:
            errorMessage = "Event not found.";
            break;
          case 403:
            errorMessage = "You don't have permission to delete this event.";
            break;
          
        }
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
    return false;
  };

  return { handleDeleteEvent };
};

const EventDeleteDialog = ({ eventId, onDeleteSuccess }: { eventId: string; onDeleteSuccess: () => void }) => {
  const { handleDeleteEvent } = useDeleteEvent();

  const onConfirmDelete = async () => {
    const success = await handleDeleteEvent(eventId);
    if (success) {
      onDeleteSuccess();
    }
  };

  //  TODO 
  // Estimated revenue calc

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete the event
            and remove all associated data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="text-white bg-red-500 rounded-md hover:bg-red-300" 
          onClick={onConfirmDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};




const MyEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, selectedFilter]);

  

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
          Authorization: `Bearer ${token}`,
        },
      });
      setEvents(response.data);
      console.log("data: ", response.data);
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

  const handleImageClick = (imageSrc: string) => {
    setExpandedImage(imageSrc);
  };

  const handleViewClick = (eventId: string) => {
    router.push(`/publisher/event-details/${eventId}`);
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent({
        ...event,
        totalTickets: event.ticketTypes.reduce((sum, tt) => sum + tt.totalTickets, 0),
        soldTickets: event.ticketTypes.reduce((sum, tt) => sum + tt.soldTickets, 0)
    });
};

  const handleSaveEvent = async (updatedEvent: Event, newImages: File[], newVideo?: File) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
  
    formData.append('eventName', updatedEvent.eventName);
    formData.append('eventCategory', updatedEvent.eventCategory);
    formData.append('eventDescription', updatedEvent.eventDescription);
    formData.append('isFreeEvent', (updatedEvent.isFreeEvent ?? false).toString());
    formData.append('eventCurrency', updatedEvent.eventCurrency);
     // Updating the date formatting to use ISO 8601
     const eventDate = new Date(updatedEvent.eventDate);
     const utcDate = new Date(Date.UTC(
         eventDate.getUTCFullYear(),
         eventDate.getUTCMonth(),
         eventDate.getUTCDate(),
         eventDate.getUTCHours(),
         eventDate.getUTCMinutes(),
         0  
     ));
     const formattedDate = format(utcDate, "yyyy-MM-dd'T'HH:mm:ss'Z'");
     formData.append('eventDate', formattedDate);
    formData.append('addressLocation', updatedEvent.addressLocation);
    formData.append('googleMapsUrl', updatedEvent.googleMapsUrl);
    formData.append('totalTickets', (updatedEvent.totalTickets ?? 0).toString());

    formData.append('ticketTypes', JSON.stringify(updatedEvent.ticketTypes));

    // existing images
    updatedEvent.eventImages.forEach((image) => {
      formData.append(`eventImages`, image);
    });

    // new images
    newImages.forEach((file) => {
      formData.append(`newEventImages`, file);
    });

    if (newVideo) {
      formData.append('eventVideo', newVideo);
    }
    
      const response = await axios.put(`http://localhost:8080/events/${updatedEvent.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": 'multipart/form-data'
        },
      });
      setEvents(prevEvents => prevEvents.map(event => 
        event.id === updatedEvent.id ? response.data : event
      ));
      toast({
        title: "Event updated successfully",
        description: "Your event has been updated.",
      });
      setTimeout(()=>{
        window.location.reload();
      }, 1500)
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        variant: "destructive",
        title: "Error updating event",
        description: "Please try again later.",
      });
    }
  };

  const handleCreateEvent = () => {
    router.push("/publisher/create-event")
  }

  const handleDeleteSuccess = (deletedEventId: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== deletedEventId));
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };


  const filterEvents = () => {
    let result = events;

    // to apply search
    if (searchTerm) {
      result = result.filter(event => 
        event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.eventDescription.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // to apply filter
    switch (selectedFilter) {
      case 'upcoming':
        result = result.filter(event => new Date(event.eventDate) > new Date() && event.approved);
        break;
      case 'draft':
        result = result.filter(event => !event.approved);
        break;
      case 'past':
        result = result.filter(event => new Date(event.eventDate) <= new Date());
        break;
      // 'all' case doesn't need filtering
    }

    setFilteredEvents(result);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };


  const FilterSelect: React.FC = () => {
    const filters = [
      { value: 'all', label: 'All Events' },
      { value: 'upcoming', label: 'Approved Events' },
      { value: 'draft', label: 'Pending Approval' },
      { value: 'past', label: 'Past Events' },
    ];

    return (
      <div className="flex items-center">
        <ListFilter className="mr-2 h-5 w-5 text-gray-200" />
        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
          <SelectTrigger className="w-[180px] bg-gray-200 text-black border border-amber-400 focus:ring-2 focus:ring-amber-100 focus:border-transparent transition-all duration-200 ease-in-out hover:bg-gray-300">
            <SelectValue placeholder="Filter events" />
          </SelectTrigger>
          <SelectContent className="bg-gray-100 text-black border border-amber-300 rounded-md overflow-hidden">
            {filters.map((filter) => (
              <SelectItem 
                key={filter.value} 
                value={filter.value}
                className="focus:bg-gray-300 focus:text-black hover:bg-gray-200 transition-colors duration-150"
              >
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };


  return (
    <div className="bg-black min-h-screen">
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
      <div className="container py-6 sm:ml-6 ml-2 md:py-10">
        <div className="bg-black p-3 sm:p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl text-white font-bold tracking-tight">My Events</h1>
        <div className="flex items-center my-4 justify-between">
          <Button className="bg-amber-500 text-black hover:bg-black hover:text-amber-500" onClick={handleCreateEvent}>
            <Plus className="mr-2 h-4 w-4" /> Create New Event
          </Button>
        </div>
          <div className="flex flex-col sm:flex-row items-center mb-8 space-x-4">
            <Input placeholder="Search events..." className="max-w-sm mb-4 sm:mb-0 text-white" 
            value={searchTerm}
            onChange={handleSearchChange}
            />
            <FilterSelect />

          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-300"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => (
                <Card key={event.id} className="bg-white text-black overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="relative p-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold">{event.eventName}</CardTitle>
                    <Badge 
                      className="ml-2 text-xs font-semibold border-gray-500 px-2 py-1 rounded-full" 
                      variant="outline"
                    >
                      {event.eventCategory}
                    </Badge>
                  </div>
                </CardHeader>
                  <CardContent className="px-7 py-4">
                  {event.eventImages && event.eventImages.length > 0 && (
                    event.eventImages.length === 1 ? (
                      <div className="h-44 relative ">
                        <Image
                          src={event.eventImages[0]}
                          alt={`${event.eventName} - Image`}
                          fill 
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{ objectFit: "cover" }}
                          className="rounded-lg cursor-zoom-in"
                          priority={index === 0}
                          onClick={() => handleImageClick(event.eventImages[0])}
                        />
                      </div>
                    ) : (
                      <Slider {...sliderSettings} className="mb-4">
                        {event.eventImages.map((image, imageIndex) => (
                          <div key={imageIndex} className="h-44 relative">
                            <Image
                              src={image}
                              alt={`${event.eventName} - Image ${imageIndex + 1}`}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              style={{ objectFit: "cover" }}
                              className="rounded-lg cursor-zoom-in"
                              priority={index === 0 && imageIndex === 0}
                              onClick={() => handleImageClick(image)}
                            />
                          </div>
                        ))}
                      </Slider>
                    )
                  )}
                    <div className={`my-4 pt-3 flex items-center ${
                      event.approved  ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {event.approved ? (
                        <>
                          <CheckCircle className="mr-2" />
                          <span>Approved</span>
                        </>
                      ) : (
                        <>
                          <Clock className="mr-2" />
                          <span>Pending Approval</span>
                        </>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                    <p className="flex items-center">
                      <CalendarIcon className="inline-block mr-2 h-4 w-4 text-gray-500" />
                      {format(parseISO(event.eventDate), "PPP p")}
                    </p>
                     
                    <p className="flex items-center">
                      <DollarSign className="inline-block mr-2 h-4 w-4 text-gray-500" />
                      {event.isFreeEvent ? (
                        "Free"
                      ) : (
                        event.ticketTypes.length > 0 ? (
                          <>
                            {Math.min(...event.ticketTypes.map(tt => tt.price))} - {Math.max(...event.ticketTypes.map(tt => tt.price))} {event.eventCurrency}
                          </>
                        ) : (
                          "Price not set"
                        )
                      )}
                    </p>
                      <p className="flex items-center">
                        <Ticket className="inline-block mr-2 h-4 w-4 text-gray-500" />
                        {event.soldTickets} / {event.totalTickets} tickets sold
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between bg-black p-3 ">
                  <Button variant="outline" 
                  onClick={()=>{handleViewClick(event.id)}}
                  size="sm" 
                  className="text-black hover:text-white bg-white hover:bg-black">
                    <Eye className="mr-2 h-4 w-4" />
                    View 
                  </Button>
                    <Button className="bg-gray-950 text-white" variant="outline"
                      
                      size="sm"
                      onClick={() => handleEditEvent(event)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <EventDeleteDialog 
                    eventId={event.id} 
                    onDeleteSuccess={() => handleDeleteSuccess(event.id)} 
                  />
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
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
              onClick={() => {localStorage.removeItem("token"); window.location.href="/login"; }}
            >
              Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <AnimatePresence>
        {expandedImage && (
          <ExpandableImage
            src={expandedImage}
            alt="Expanded event image"
            onClose={() => setExpandedImage(null)}
          />
        )}
      </AnimatePresence>

      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={handleSaveEvent}
        />
      )}
    </div>
  );
};

export default MyEvents;