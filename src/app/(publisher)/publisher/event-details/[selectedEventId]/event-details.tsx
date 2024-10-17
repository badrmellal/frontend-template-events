import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from "next/link"
import Image from "next/image"
import axios from 'axios';
import { Calendar, Clock, Headset, LogOut, MapPin, Share2, Ticket, Users, X } from "lucide-react"
import Slider from "react-slick";
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from '@/app/api/currency/route';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaFacebook, FaInstagram, FaTiktok, FaTwitter } from 'react-icons/fa6';
import { jwtDecode } from 'jwt-decode';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SidebarPublisher from '@/app/components/sidebar-publisher';
import Footer from '@/app/components/footer';

interface Event {
  id: number;
  eventName: string;
  eventCategory: string;
  eventDescription: string;
  eventImages: string[];
  ticketTypes: TicketType[];
  eventCurrency: string;
  isFreeEvent: boolean;
  eventManagerUsername: string;
  eventDate: string;
  addressLocation: string;
  googleMapsUrl: string;
  isApproved: boolean;
  totalTickets: number;
  remainingTickets: number;
  countryCode: string;
  publisherSocialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    tiktok?: string;
  };
}

interface TicketType {
  name: string;
  price: number;
  totalTickets: number;
  remainingTickets: number;
}

interface EventDetailsProps {
  eventId: string;
}

const ExpandedImageView: React.FC<{ src: string; alt: string; onClose: () => void }> = ({ src, alt, onClose }) => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          className="relative max-w-4xl max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={800}
            className="rounded-lg object-contain"
          />
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </motion.div>
      </motion.div>
    );
  };


export default function EventDetails({ eventId }: EventDetailsProps) {
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPublisher, setIsPublisher] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const router = useRouter();

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) return;

      try {
        console.log('Fetching event details for eventId:', eventId);
        const token = localStorage.getItem('token')
        const response = await axios.get<Event>(`http://localhost:8080/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Received response:', response.data);
        setEvent(response.data);
        setLoading(false);

        // Checking if the current user is the publisher
        if (token) {
            const decodedToken = jwtDecode(token);
            setIsPublisher(decodedToken.sub === response.data.eventManagerUsername);
          }
      } catch (error) {
        console.error('Failed to fetch event details:', error);
        if (axios.isAxiosError(error)) {
          setError(`Failed to load event details. Status: ${error.response?.status}, Message: ${error.response?.data?.message || error.message}`);
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleBuyTickets = () => {
    if (isPublisher) {
        setDialogOpen(true);
      } else {
        const token = localStorage.getItem("token");
        const storedBooking = localStorage.getItem('currentBooking');
        
        if (!token) {
        router.push("/sign-up");
        } else if (event && storedBooking) {
        const bookingDetails = JSON.parse(storedBooking);
        if (bookingDetails.eventId === event.id) {
            router.push(`/user/payment-confirmation/${event.id}`);
        } else {
            router.push('/');
        }
        } else {
        router.push('/');
        }
    }
  };

  const handleImageClick = (imageSrc: string) => {
    setExpandedImage(imageSrc);
  };

  const openGoogleMaps = () => {
    if (event && event.googleMapsUrl) {
      window.open(event.googleMapsUrl, '_blank');
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    window.location.reload();
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <p>{error || "Event not found"}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <div className='text-black'>
        <SidebarPublisher />
      </div>
      <div className="absolute z-20 top-4 right-4">
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
            <DropdownMenuItem ><Headset className="h-4 w-4 mx-1 text-gray-500" /> Support</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogOut}> <LogOut className="h-4 w-4 mx-1 text-gray-500" /> Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <main className="flex-1 sm:ml-12 ml-0">
        <div className="relative h-[300px] overflow-hidden md:h-[400px]">
          {event.eventImages.length > 1 ? (
            <Slider {...sliderSettings}>
              {event.eventImages.map((image, index) => (
                <div key={index} className="h-[300px] md:h-[400px] relative">
                  <Image
                    src={image}
                    alt={`Event image ${index + 1}`}
                    className="absolute inset-0 h-full w-full cursor-zoom-in object-cover"
                    width={1200}
                    height={400}
                    onClick={() => {   
                    console.log('Image clicked:', image);
                    handleImageClick(image)}}
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <div className="h-[300px] md:h-[400px] relative">
            <Image
              src={event.eventImages[0]}
              alt="Event cover"
              className="absolute inset-0 h-full w-full cursor-zoom-in object-cover"
              width={1200}
              height={400}
              onClick={() => handleImageClick(event.eventImages[0])}
            />
            </div>
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="container relative z-10 flex h-full flex-col justify-end p-4 text-white md:p-6">
            <Badge className="mb-2 w-fit bg-amber-500 text-black">{event.eventCategory}</Badge>
            <h1 className="mb-2 text-3xl font-bold md:text-4xl lg:text-5xl">{event.eventName}</h1>
            <p className="text-lg md:text-xl">{event.eventDescription.substring(0, 100)}...</p>
          </div>
        </div>
        <div className="container grid gap-6 p-4 md:grid-cols-3 md:p-6 lg:gap-10">
          <div className="md:col-span-2">
            <Card className="bg-black border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center space-x-4">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Date</p>
                    <p className="text-sm text-gray-300">{new Date(event.eventDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Time</p>
                    <p className="text-sm text-gray-300">{new Date(event.eventDate).toLocaleTimeString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div className="flex-grow">
                    <p className="text-sm font-medium text-white">Location</p>
                    <p className="text-sm text-gray-300">{event.addressLocation}</p>
                  </div>
                  <Button
                    onClick={openGoogleMaps}
                    className="bg-amber-500 text-black hover:bg-amber-600"
                  >
                    Open in Maps
                  </Button>
                </div>
                <Separator className="bg-gray-700" />
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-white">About This Event</h3>
                  <p className="text-sm text-gray-300">{event.eventDescription}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="bg-black border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Ticket Information</CardTitle>
              </CardHeader>
              <CardContent>
                {event.ticketTypes.length > 0 ? (
                  <div className="mb-4 space-y-4">
                    {event.ticketTypes.map((ticketType, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-white">{ticketType.name}</span>
                          <span className="text-gray-300">
                            {ticketType.price === 0 ? 'Free' : formatCurrency(ticketType.price, event.countryCode)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Remaining</span>
                          <span className="text-sm text-gray-300">{ticketType.remainingTickets}</span>
                        </div>
                        <Separator className="bg-gray-700" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mb-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-white">Price</span>
                      <span className="text-gray-300">{event.isFreeEvent ? 'Free' : 'Paid Event'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-white">Remaining Tickets</span>
                      <span className="text-gray-300">{event.totalTickets}</span>
                    </div>
                  </div>
                )}
                <Button 
                    className="w-full bg-amber-500 text-black hover:bg-amber-600" 
                    onClick={handleBuyTickets}
                >
                    <Ticket className="mr-2 h-4 w-4" />
                    {isPublisher ? 'Buy Ticket' : (event.isFreeEvent ? 'Reserve Ticket' : 'Buy Tickets')}
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-black border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Event Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10 border-2 border-gray-700">
                    <AvatarImage src="/profile_avatar.png" alt="Organizer" />
                    <AvatarFallback className="bg-gray-700 text-white">OM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">{event.eventManagerUsername}</p>
                    <p className="text-sm text-gray-300">Event Organizer</p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-4">
                  {event.publisherSocialLinks?.instagram && (
                    <Link href={event.publisherSocialLinks.instagram} target="_blank" rel="noopener noreferrer">
                      <FaInstagram className="h-6 w-6 text-pink-500 hover:text-pink-400" />
                    </Link>
                  )}
                  {event.publisherSocialLinks?.tiktok && (
                    <Link href={event.publisherSocialLinks.tiktok} target="_blank" rel="noopener noreferrer">
                      <FaTiktok className="h-6 w-6 text-gray-100 hover:text-gray-300" />
                    </Link>
                  )}
                  {event.publisherSocialLinks?.facebook && (
                    <Link href={event.publisherSocialLinks.facebook} target="_blank" rel="noopener noreferrer">
                      <FaFacebook className="h-6 w-6 text-blue-600 hover:text-blue-400" />
                    </Link>
                  )}
                  {event.publisherSocialLinks?.twitter && (
                    <Link href={event.publisherSocialLinks.twitter} target="_blank" rel="noopener noreferrer">
                      <FaTwitter className="h-6 w-6 text-blue-400 hover:text-blue-300" />
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-black border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Share This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                    <Share2 className="h-4 w-4 mt-3 text-amber-500" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="border-gray-700 text-black hover:text-amber-500 hover:bg-black">Share</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white border-gray-600">
                      <DropdownMenuLabel className="text-black">Social Media</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuItem className="text-black hover:bg-gray-200"><FaFacebook className="mr-1" /> Facebook</DropdownMenuItem>
                      <DropdownMenuItem className="text-black hover:bg-gray-200"><FaTwitter className="mr-1"/> Twitter</DropdownMenuItem>
                      <DropdownMenuItem className="text-black hover:bg-gray-200"><FaInstagram className="mr-1"/> Instagram</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-gray-100 text-black">
          <DialogHeader>
            <DialogTitle>Your Event</DialogTitle>
            <DialogDescription>
              This is your event. You can&apos;t book tickets for your own event.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setDialogOpen(false)} className="mt-4">Close</Button>
        </DialogContent>
      </Dialog>

      </main>
      <AnimatePresence>
        {expandedImage && (
          <ExpandedImageView
            src={expandedImage}
            alt="Expanded event image"
            onClose={() => setExpandedImage(null)}
          />
        )}
      </AnimatePresence>
      <Footer />
    </div>
  )
}