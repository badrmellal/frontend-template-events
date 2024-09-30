import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Headset, LogOut, MapPin, DollarSign, Ticket, X, Clock, CheckCircle, Eye, ListFilter, ThumbsUp, ThumbsDown, ChevronLeftIcon, ChevronRightIcon, User, LinkIcon, Mail, Phone, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SidebarAdmin from '@/app/components/sidebar-admin';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IoIosPricetags } from 'react-icons/io';
import Footer from '@/app/components/footer';

interface Event {
  id: string;
  eventName: string;
  eventCategory: string;
  eventDescription: string;
  eventImages: string[];
  eventVideo: string | null;
  ticketTypes: TicketType[];
  eventCurrency: string;
  isFreeEvent: boolean;
  approved: boolean;
  eventDate: string;
  addressLocation: string;
  googleMapsUrl: string;
  totalTickets: number;
  soldTickets: number;
  eventManagerUsername: string;
}

interface TicketType {
  name: string;
  price: number;
  totalTickets: number;
  remainingTickets: number;
}

interface ExpandableImageProps {
  src: string;
  alt: string;
  onClose: () => void;
}

interface Publisher {
  username: string;
  email: string;
  phoneNumber?: string;
}

const EventDetailsDrawer: React.FC<{ event: Event; onViewDetails: (event: Event) => void; onCloseDetails: () => void }> = ({ event, onViewDetails, onCloseDetails }) => {
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [isLoadingPublisher, setIsLoadingPublisher] = useState(false);
  const { toast } = useToast();

  const fetchPublisherInfo = useCallback(async (publisherEmail: string) => {
    setIsLoadingPublisher(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");

      const response = await axios.get<Publisher>(`http://localhost:8080/user/${publisherEmail}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const publisherData: Publisher = {
        username: response.data.username || 'N/A',
        email: response.data.email || 'N/A',
        phoneNumber: response.data.phoneNumber || 'N/A'
      };
      
      setPublisher(publisherData);
      console.log("Publisher data:", response.data);
    } catch (error) {
      console.error('Error fetching publisher info:', error);
      toast({
        variant: "destructive",
        title: "Error fetching publisher information",
        description: "Please try again later.",
      });
      setPublisher(null);
    } finally {
      setIsLoadingPublisher(false);
    }
  }, [toast]);

  useEffect(() => {
    if (event) {
      fetchPublisherInfo(event.eventManagerUsername);
      console.log(event.eventManagerUsername);
    }
  }, [event, fetchPublisherInfo]);

  return (
    <Drawer  onClose={onCloseDetails}>
      <DrawerTrigger asChild>
        <Button variant="outline" 
        size="sm" 
        className="text-white hover:text-black bg-transparent hover:bg-white border-white"
        onClick={() => onViewDetails(event)}
          >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </DrawerTrigger>
      <DrawerContent className=" text-black h-[80vh]">
        <ScrollArea className="h-full">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-bold">{event.eventName}</DrawerTitle>
            <DrawerDescription>{event.eventCategory}</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div className="aspect-video relative rounded-lg overflow-hidden h-48">
              <Image
                src={event.eventImages[0] || "/placeholder.svg"}
                alt={event.eventName}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Event Details</h3>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                    {format(parseISO(event.eventDate), "PPP p")}
                  </p>
                  <p className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                    {event.addressLocation}
                  </p>
     
                  <p className="flex items-center">
                    <Ticket className="mr-2 h-4 w-4 text-gray-500" />
                    {event.soldTickets} / {event.totalTickets} tickets sold
                  </p>
                  <p className="flex items-center">
                    <CheckCircle className={`mr-2 h-4 w-4 ${event.approved ? "text-green-500" : "text-yellow-500"}`} />
                    {event.approved ? "Approved" : "Pending Approval"}
                  </p>
                </div>
              </div>
              <div>
              <h3 className="font-semibold mb-2">Ticket Types</h3>
              <div className="space-y-2">
                {event.ticketTypes.map((ticket, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{ticket.name}</span>
                    <span>{ticket.price} {event.eventCurrency}</span>
                  </div>
                ))}
              </div>
                <h3 className="font-semibold mt-4 mb-2">Description</h3>
                <p className="text-sm">{event.eventDescription}</p>
              </div>
            </div>
            <Separator />
            <div className='flex flex-col'>
              <h3 className="font-semibold mb-2">Publisher Information</h3>
              {isLoadingPublisher ? (
            <p>Loading publisher information...</p>
          ) : publisher ? (
            <div className="space-y-2">
              <p className="flex text-black items-center">
                <Mail className="mr-2 h-4 w-4 text-gray-500" />
                <span className="truncate">{publisher.email}</span>
              </p>
              <p className="flex items-center">
                <User className="mr-2 h-4 w-4 text-gray-500" />
                <span className="truncate">{publisher.username}</span>
              </p>
              <p className="flex text-black items-center">
                <Phone className="mr-2 h-4 w-4 text-gray-500" />
                <span className="truncate">{publisher.phoneNumber}</span>
              </p>
            </div>
          ) : (
            <p>Publisher information not available.</p>
          )}
        </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button onClick={onCloseDetails} variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};


const ExpandableImage: React.FC<ExpandableImageProps> = ({ src, alt, onClose }) => {
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
          className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all duration-200"
        >
          <X size={24} />
        </button>
      </motion.div>
    </motion.div>
  );
};

const AdminEvents: React.FC = () => {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [displayedEvents, setDisplayedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('pending');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  

  useEffect(() => {
    fetchEvents();
  }, [selectedFilter, searchTerm]);




  const fetchEvents = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if(!token) throw new Error("No token found.");

      let url = `http://localhost:8080/events`;

      if (selectedFilter === 'pending') {
        url = `http://localhost:8080/events/pending`;
      } else if (selectedFilter === 'approved') {
        url = `http://localhost:8080/events/home`;
      }

      if (searchTerm) {
        url = `http://localhost:8080/events/search?keyword=${searchTerm}`;
      }

      const response = await axios.get<Event[]>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllEvents(response.data);
      setTotalPages(Math.ceil(response.data.length / size));
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
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
  }, [selectedFilter, searchTerm, size, toast]);

  const updateDisplayedEvents = useCallback((events: Event[]) => {
    const startIndex = page * size;
    const endIndex = startIndex + size;
    setDisplayedEvents(events.slice(startIndex, endIndex));
  }, [page, size]);

  useEffect(() => {
    updateDisplayedEvents(allEvents);
  }, [allEvents, page, size, updateDisplayedEvents]);

 

  const handleApproveClick = (eventId: string) => {
    setSelectedEventId(eventId);
    setApproveDialogOpen(true);
  };

  const handleRejectClick = (eventId: string) => {
    setSelectedEventId(eventId);
    setRejectDialogOpen(true);
  };

  const confirmApprove = async () => {
    if (selectedEventId) {
      await handleApproveEvent(selectedEventId);
      setApproveDialogOpen(false);
    }
  };

  const confirmReject = async () => {
    if (selectedEventId) {
      await handleRejectEvent(selectedEventId);
      setRejectDialogOpen(false);
    }
  };

  const handleApproveEvent = async (eventId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");

      const response = await axios.put(`http://localhost:8080/events/approve/${eventId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        toast({
          title: "Event Approved",
          description: "The event has been successfully approved.",
        });
        // Update the local state
        setAllEvents(prevEvents => prevEvents.map(event => 
          event.id === eventId ? { ...event, approved: true } : event
        ));
      } else {
        throw new Error("Unexpected response status");
      }
      fetchEvents();
    } catch (error) {
      console.error('Error approving event:', error);
      toast({
        variant: "destructive",
        title: "Error approving event",
        description: "Please try again later.",
      });
    }
  };

  const handleRejectEvent = async (eventId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");

      await axios.put(`http://localhost:8080/events/reject/${eventId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: "Event Rejected",
        description: "The event has been rejected.",
      });
      fetchEvents();
    } catch (error) {
      console.error('Error rejecting event:', error);
      toast({
        variant: "destructive",
        title: "Error rejecting event",
        description: "Please try again later.",
      });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found.");
  
      const response = await axios.delete(`http://localhost:8080/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200){
        toast({
          title: "Event Deleted",
          description: "The event has been successfully deleted.",
        });
      } else{
        toast({
          title: "Inernal Error",
          description: "Please try again later.",
          variant: "destructive"
        })
      }
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        variant: "destructive",
        title: "Error deleting event",
        description: "Please try again later.",
      });
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const handleImageClick = (imageSrc: string) => {
    setExpandedImage(imageSrc);
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const FilterSelect: React.FC = () => {
    const filters = [
      { value: 'all', label: 'All Events' },
      { value: 'pending', label: 'Pending Approval' },
      { value: 'approved', label: 'Approved Events' },
    ];

    return (
      <div className="flex items-center">
        <ListFilter className="mr-2 h-5 w-5 text-gray-200" />
        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
          <SelectTrigger className="w-[180px] bg-gray-200 text-black border border-white focus:ring-2 focus:ring-gray-100 focus:border-transparent transition-all duration-200 ease-in-out hover:bg-gray-300">
            <SelectValue placeholder="Filter events" />
          </SelectTrigger>
          <SelectContent className="bg-gray-100 text-black border border-gray-300 rounded-md overflow-hidden">
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
      <SidebarAdmin />
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
      <div className="container mx-auto py-6 md:py-8 px-2 sm:pl-8">
        <div className=" p-3 sm:p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl text-white font-bold tracking-tight mb-6">Event Management</h1>
          <div className="flex flex-col sm:flex-row items-center mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
            <Input 
              placeholder="Search events..." 
              className="max-w-sm text-black bg-gray-100"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FilterSelect />
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedEvents.map((event) => (
                <Card key={event.id} className="bg-gray-50 text-black overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="relative p-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-bold">{event.eventName}</CardTitle>
                      <div className="flex justify-between items-end">
                      <Badge 
                        className="text-xs font-semibold border-gray-500 mr-1 px-2 py-1 rounded-full" 
                        variant="outline"
                      >
                        {event.eventCategory}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 mt-2 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedEventId(event.id);
                            setDeleteDialogOpen(true);
                          }}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-7 py-4">
                    {event.eventImages && event.eventImages.length > 0 && (
                      event.eventImages.length === 1 ? (
                        <div className="h-44 relative">
                          <Image
                            src={event.eventImages[0]}
                            alt={`${event.eventName} - Image`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg cursor-zoom-in"
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
                                layout="fill"
                                objectFit="cover"
                                className="rounded-lg cursor-zoom-in"
                                onClick={() => handleImageClick(image)}
                              />
                            </div>
                          ))}
                        </Slider>
                      )
                    )}
                    <div className={`my-4 pt-3 flex font-semibold items-center ${
                      event.approved ? 'text-green-500' : 'text-amber-500'
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
                        <CalendarIcon className="inline-block mr-2 h-4 w-4 text-gray-400" />
                        {format(parseISO(event.eventDate), "PPP p")}
                      </p>
                      <p className="flex items-center">
                        <IoIosPricetags className="inline-block mr-2 h-4 w-4 text-gray-400" />
                        {event.isFreeEvent ? (
                          "Free Event"
                        ) : (
                          <>
                            {event.ticketTypes.length > 0 ? (
                              `${Math.min(...event.ticketTypes.map(t => t.price))} - ${Math.max(...event.ticketTypes.map(t => t.price))} ${event.eventCurrency}`
                            ) : (
                              "Price not set"
                            )}
                          </>
                        )}
                      
                      </p>
                      <p className="flex items-center">
                        <Ticket className="inline-block mr-2 h-4 w-4 text-gray-400" />
                        {event.soldTickets} / {event.totalTickets} tickets sold
                      </p>
                      <p className="flex items-center">
                        <MapPin className="inline-block mr-2 h-4 w-4 text-gray-400" />
                        {event.addressLocation}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between bg-gray-950 p-4">
                  <EventDetailsDrawer 
                    event={event} 
                    onViewDetails={() => setSelectedEvent(event)}
                    onCloseDetails={() => setSelectedEvent(null)}
                  />
                    {!event.approved && (
                      <>
                        <Button 
                          className="bg-green-600 text-white hover:bg-green-700" 
                          size="sm"
                          onClick={() => handleApproveClick(event.id)}
                        >
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button 
                          className="bg-red-600 text-white hover:bg-red-700" 
                          size="sm"
                          onClick={() => handleRejectClick(event.id)}
                        >
                          <ThumbsDown className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          
         {/* Pagination */}
         <Pagination className="my-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  isActive={page !== 1}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem className='bg-gray-200 text-black rounded-xl' key={i}>
                  <PaginationLink 
                    href="#" 
                    onClick={() => setPage(i + 1)}
                    isActive={page === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                  isActive={page !== totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        <Footer />
      </div>


              {/* Approval Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="sm:max-w-[425px] max-w-[340px]">
          <DialogHeader>
            <DialogTitle>Approve Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmApprove} className="bg-green-500 text-white hover:bg-green-700">
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-[425px] max-w-[340px]">
          <DialogHeader>
            <DialogTitle>Reject Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmReject} className="bg-red-500 text-white hover:bg-red-700">
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] max-w-[340px] rounded-md">
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="">
            <Button className="my-3 sm:my-0" variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (selectedEventId) {
                  handleDeleteEvent(selectedEventId);
                  setDeleteDialogOpen(false);
                }
              }} 
              className="bg-red-500 text-white hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Token Expiration Dialog */}
      <Dialog open={isTokenExpired} onOpenChange={setIsTokenExpired}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Session Expired</DialogTitle>
            <DialogDescription>
              Your session has expired. Please log in again to continue.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="submit" 
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href="/login";
              }}
            >
              Log In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Expanded Image */}
      <AnimatePresence>
        {expandedImage && (
          <ExpandableImage
            src={expandedImage}
            alt="Expanded event image"
            onClose={() => setExpandedImage(null)}
          />
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default AdminEvents;