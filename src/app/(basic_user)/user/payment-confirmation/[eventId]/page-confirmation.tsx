import React from 'react'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, CreditCard, Clock, Calendar, MapPin, AlertTriangle } from "lucide-react";
import { formatCurrency } from '@/app/api/currency/route';
import  QRCode  from 'qrcode';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FaApplePay, FaCcAmex, FaCcMastercard, FaCcVisa, FaGooglePay, FaPaypal } from 'react-icons/fa6';
interface Event {
    id: number;
    eventName: string;
    eventCategory: string;
    eventDescription: string;
    eventImages: string[];
    eventPrice: number;
    eventCurrency: string;
    isFreeEvent: boolean;
    eventDate: string;
    addressLocation: string;
    googleMapsUrl: string;
    remainingTickets: number;
    countryCode: string;
  }
  
  interface BookingDetails {
    eventId: number;
    ticketType: string;
    quantity: number;
    price: number;
    fees: number;
    vat: number;
    total: number;
  }
  
  export default function PaymentConfirmation() {
    const [event, setEvent] = useState<Event | null>(null);
    const [booking, setBooking] = useState<BookingDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [resaleAgreed, setResaleAgreed] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
    const [isExpired, setIsExpired] = useState(false)
    const router = useRouter();
    const params = useParams();
    const eventId = params.eventId as string;
    const [qrValue, setQRValue] = useState();
      const [qrCodeUrl, setQRCodeUrl] = useState('');

    useEffect(() => {
      const fetchEventAndBookingDetails = async () => {
        if (!eventId) return;
  
        try {
          const eventResponse = await axios.get<Event>(`http://localhost:8080/events/${eventId}`);
          setEvent(eventResponse.data);
  
          const storedBooking = localStorage.getItem('currentBooking');
          if (storedBooking) {
            setBooking(JSON.parse(storedBooking));
          } else {
            setError('No booking details found. Please start the booking process again.');
          }
  
          setLoading(false);
        } catch (error) {
          console.error('Failed to fetch event or booking details:', error);
          setError('Failed to load event or booking details. Please try again.');
          setLoading(false);
        }
      };
  
      fetchEventAndBookingDetails();

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          setIsExpired(true)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)
    // to clean up 
    return () => {
      clearInterval(timer)
    }
  }, [eventId]);

  useEffect(() => {
    if (isExpired) {
      localStorage.removeItem('currentBooking')
    }
  }, [isExpired])

  const handleExpiredClose = () => {
    router.push('/')
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  
    const handlePayment = async () => {
  
  
      if (!termsAccepted || !resaleAgreed) {
        setError('Please accept the terms and conditions to proceed.');
        return;
      }
  
      if (!event || !booking) {
        setError('Event or booking details are missing.');
        return;
      }
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/sign-up');
          return;
        }
        const response = await axios.post(
          `http://localhost:8080/tickets/purchase/${event.id}`,null
          ,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                quantity: booking.quantity,
                ticketTypeName: booking.ticketType,
                paymentMethod: paymentMethod,
                promoCode: promoCode
              }
          }
        );
        try {
            const jsonString = JSON.stringify(response.data);
            const url = await QRCode.toDataURL(jsonString, {
              width: 300,
              margin: 2,
            });
            setQRCodeUrl(url);
            setError('');
          } catch (err) {
            console.error('Error generating QR code:', err);
            setError('Invalid JSON input');
            setQRCodeUrl('');
          }
  
        // if (response.status === 200) {
        //   if (event.isFreeEvent) {
        //     router.push(`/user/ticket-confirmation/${event.id}`);
        //   } else {
        //     // For paid events, handle payment confirmation
        //     const paymentConfirmationResponse = await axios.post(
        //       `http://localhost:8080/tickets/confirm-payment/${response.data.id}`,
        //       {},
        //       {
        //         headers: { Authorization: `Bearer ${token}` }
        //       }
        //     );
  
        //     if (paymentConfirmationResponse.status === 200) {
        //       router.push(`/user/ticket-confirmation/${event.id}`);
        //     } else {
        //       setError('Payment confirmation failed. Please contact support.');
        //     }
        //   }
        // }
      } catch (error) {
        console.error('Failed to process payment or create ticket:', error);
        setError('Failed to process payment or create ticket. Please try again.');
      }
    };
  
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      );
    }
  
    if (error || !event || !booking) {
      return (
        <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
          <p>{error || "Event or booking details not found"}</p>
        </div>
      );
    }
  
    return (

      <div className="min-h-screen bg-black text-white p-8">
      <Dialog open={isExpired} onOpenChange={setIsExpired}>
        <DialogContent >
          <DialogHeader>
            <DialogTitle>Session Expired</DialogTitle>
          </DialogHeader>
          <p>Your booking session has expired. Please start the booking process again.</p>
          <DialogFooter>
            <Button onClick={handleExpiredClose} >
              Return to Home
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  
        <div className="max-w-6xl mx-auto">
          <Button
            onClick={() => router.back()}
            className="mb-8 bg-transparent hover:bg-white hover:text-black hover:border-white text-white border-white"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Event Details
          </Button>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-gray-950 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-amber-500">
                    {event.isFreeEvent ? 'Booking Confirmation' : 'Payment Details'} for {event.eventName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!event.isFreeEvent && (
                    <>
                      <p className="text-gray-300 text-sm mb-4">Select payment method</p>
                      <RadioGroup defaultValue="card" onValueChange={setPaymentMethod} className="space-y-4">
                      <div className="flex items-center space-x-2 border border-gray-500 rounded-lg p-4 hover:border-amber-500 transition-colors">
                        <RadioGroupItem value="card" id="card" className="text-gray-300" />
                        <Label htmlFor="card" className="flex text-white items-center cursor-pointer">
                          <CreditCard className="mr-2 h-4 w-4 text-amber-500" />
                          Debit or credit card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border border-gray-500 rounded-lg p-4 opacity-50 cursor-not-allowed">
                        <RadioGroupItem value="paypal" id="paypal" disabled className="text-gray-300" />
                        <Label htmlFor="paypal" className="flex text-white items-center">
                          <FaPaypal className="mr-2 h-4 w-4 text-blue-500" />
                          PayPal (Coming Soon)
                        </Label>
                      </div>
                    </RadioGroup>
  
                      <div className="mt-6">
                        <p className="text-sm text-gray-300 mb-2">Available Payment Methods</p>
                        <div className="flex text-gray-100 space-x-4">
                          {/* payment method icons here */}
                         <FaCcVisa className='h-5 w-5' />
                         <FaCcMastercard className='h-5 w-5'/>
                         <FaApplePay className='h-5 w-5'/>
                         <FaGooglePay className='h-5 w-5'/>
                         <FaCcAmex className='h-5 w-5'/>
                        </div>
                      </div>
                      <div className="mt-6">
                        <Label className='text-amber-500' htmlFor="promoCode">Promo code</Label>
                        <Input
                          id="promoCode"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white mt-1 focus:border-amber-500"
                        />
                      </div>
                    </>
                  )}
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-300">Important to know</h3>
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={termsAccepted}
                        onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                        className="border-amber-500 text-amber-500"
                      />
                      <Label htmlFor="terms" className="text-sm font-light text-white">
                        By checking this box, I confirm that I agree to the{' '}
                        <a href="#" className="text-amber-500 font-semibold hover:underline">Terms and Conditions</a> and{' '}
                        <a href="#" className="text-amber-500 font-semibold hover:underline">Privacy Policy</a>
                      </Label>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="resale"
                        checked={resaleAgreed}
                        onCheckedChange={(checked) => setResaleAgreed(checked as boolean)}
                        className="border-amber-500 text-amber-500"
                      />
                      <Label htmlFor="resale" className="text-sm font-light text-white">
                        I agree that any re-sale of a ticket on a platform other than africashowtime.com is deemed to be illegal and will therefore result in the account being banned, the ticket will get cancelled, and will not accept any request for ticket or value refund.
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="bg-gray-950 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-amber-500">{event.eventName}</CardTitle>
                  <p className="text-sm text-gray-400">{event.addressLocation}</p>
                  <p className="text-sm text-gray-400">{new Date(event.eventDate).toLocaleString()}</p>
                </CardHeader>
                <CardContent>
                  {event.eventImages && event.eventImages.length > 0 && (
                    <Image
                      src={event.eventImages[0]}
                      alt={event.eventName}
                      width={300}
                      height={200}
                      className="rounded-lg object-cover w-full mb-4"
                    />
                  )}
                  <h3 className="text-lg font-semibold mb-2 text-gray-200">Summary</h3>
                  <div className="space-y-2">
                    <div className="flex text-gray-100 justify-between">
                      <span>{booking.quantity} x {booking.ticketType}</span>
                      <span>{formatCurrency(booking.price, event.eventCurrency)}</span>
                    </div>
                    {!event.isFreeEvent && (
                      <>
                        <div className="flex justify-between text-gray-400">
                          <span>Subtotal</span>
                          <span>{formatCurrency(booking.price, event.eventCurrency)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>Fees</span>
                          <span>{formatCurrency(booking.fees, event.eventCurrency)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>VAT</span>
                          <span>{formatCurrency(booking.vat, event.eventCurrency)}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between font-bold text-white">
                      <span>Total</span>
                      <span>{event.isFreeEvent ? 'Free' : formatCurrency(booking.total, event.eventCurrency)}</span>
                    </div>
                  </div>
                  <div className="mt-4 mb-2">
                  
                    {event.remainingTickets > 0 && (
                      <div className="flex items-center text-sm text-yellow-400">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        <span>{event.remainingTickets} tickets left</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="mt-8 flex justify-between items-center">
          <div className="flex items-center text-yellow-400">
              <Clock className="mr-2 h-4 w-4" />
              <span>{formatTime(timeLeft)} left</span>
            </div>
            <Button
              onClick={handlePayment}
              className="bg-amber-500 hover:bg-amber-600 text-black px-8 py-4 text-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!termsAccepted || !resaleAgreed || isExpired}
            >
              {event.isFreeEvent ? 'Confirm Booking' : 'Proceed to Payment'}
            </Button>
            {qrCodeUrl && (
                <div className="generated-view">
                    <img src={qrCodeUrl} alt="qr code" />
                    <a href={qrCodeUrl}/>
                </div>
                )}
          </div>
        </div>
      </div>
    );
  }
