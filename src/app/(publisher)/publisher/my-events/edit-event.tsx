import React, { useState, useCallback } from 'react';
import { format, parseISO, set } from "date-fns";
import { CalendarIcon, Plus, Tag, Ticket, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from "@/components/ui/switch";
import { Textarea } from '@/components/ui/textarea';
import { africanCountries, formatCurrency } from '@/app/api/currency/route';
import ReactCountryFlag from 'react-country-flag';
import TimePicker from '@/app/components/time-picker';
import Image from 'next/image';
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaMoneyBillWave } from "react-icons/fa";


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

interface EventFormInputs {
    eventName: string;
    eventCategory: string;
    eventDescription: string;
    eventImages: string[];
    eventVideo?: string | null;
    isFreeEvent: boolean;
    eventCurrency: string;
    eventDate: Date | undefined;
    eventTime: string;
    addressLocation: string;
    googleMapsUrl: string;
    ticketTypes: TicketType[];
}

const getCurrencyCountryCode = (currencyCode: string) => {
    const country = africanCountries.find(c => c.currency.code === currencyCode);
    return country ? country.code : '';
};

const EditEventModal: React.FC<{ event: Event; onClose: () => void; onSave: (updatedEvent: Event, newImages: File[], newVideo? : File) => void }> = ({ event, onClose, onSave }) => {
    const [formData, setFormData] = useState<EventFormInputs>({
        eventName: event.eventName,
        eventCategory: event.eventCategory,
        eventDescription: event.eventDescription,
        eventImages: event.eventImages,
        eventVideo: event.eventVideo,
        isFreeEvent: event.isFreeEvent,
        eventCurrency: getCurrencyCountryCode(event.eventCurrency),
        eventDate: event.eventDate ? parseISO(event.eventDate) : undefined,
        eventTime: event.eventDate ? format(parseISO(event.eventDate), "HH:mm") : '',
        addressLocation: event.addressLocation,
        googleMapsUrl: event.googleMapsUrl,
        ticketTypes: event.ticketTypes.map(tt => ({
            ...tt,
            isFree: event.isFreeEvent || tt.isFree
        }))
    });
    const [newImages, setNewImages] = useState<File[]>([]);
    const [newVideo, setNewVideo] = useState<File | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});


    const validateInputs = () => {
        let newErrors: { [key: string]: string } = {};
        const googleMapsUrlPattern = /^https:\/\/(www\.)?google\.[a-z]{2,3}\/maps\/.*$/;

        if (!formData.eventName.trim()) newErrors.eventName = "Event name is required.";
        if (!formData.eventCategory) newErrors.eventCategory = "Event category is required.";
        if (!formData.eventDescription.trim()) newErrors.eventDescription = "Event description is required.";
        if (formData.eventImages.length === 0 && newImages.length === 0) newErrors.eventImages = "At least one event image is required.";
        if (!formData.eventCurrency) newErrors.eventCurrency = "Please select a currency for the event.";
        if (!formData.eventDate) {
            newErrors.eventDate = "Event date and time are required.";
        } else if (formData.eventDate < new Date()) {
            newErrors.eventDate = "Event date and time must be in the future.";
        }
        if (!formData.addressLocation.trim()) newErrors.addressLocation = "Address location is required.";
        if (!formData.googleMapsUrl.trim()) {
            newErrors.googleMapsUrl = "Google Maps URL is required.";
        } else if (!googleMapsUrlPattern.test(formData.googleMapsUrl)) {
            newErrors.googleMapsUrl = "Please enter a valid Google Maps URL.";
        }
        if (formData.ticketTypes.length === 0) {
            newErrors.ticketTypes = "At least one ticket type is required.";
        } else {
            formData.ticketTypes.forEach((ticketType, index) => {
                if (!ticketType.name) newErrors[`ticketType${index}Name`] = "Ticket type name is required.";
                if (!ticketType.isFree && ticketType.price <= 0) newErrors[`ticketType${index}Price`] = "Price must be greater than zero for paid tickets.";
                if (ticketType.totalTickets <= 0) newErrors[`ticketType${index}TotalTickets`] = "Total tickets must be greater than zero.";
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date: Date | undefined) => {
        setFormData(prev => ({ ...prev, eventDate: date }));
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            isFreeEvent: checked,
            ticketTypes: prev.ticketTypes.map(ticket => ({
                ...ticket,
                isFree: checked,
                price: checked ? 0 : ticket.price
            }))
        }));
    };

    const handleCurrencyChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            eventCurrency: value,
            ticketTypes: prev.ticketTypes.map(ticket => ({
                ...ticket,
                currency: value
            }))
        }));
    };

    const handleCategoryChange = (value: string) => {
        setFormData(prev => ({ ...prev, eventCategory: value }));
    };

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, files } = e.target;
      if (files && files.length > 0) {
          if (name === 'eventImages') {
              setNewImages(prev => [...prev, ...Array.from(files)]);
          } else if (name === 'eventVideo') {
              setNewVideo(files[0]);
          }
      }
  }, []);

    const removeExistingImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            eventImages: prev.eventImages.filter((_, i) => i !== index)
        }));
    };

    const removeNewImage = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleTicketTypeChange = (index: number, field: keyof TicketType, value: string | number | boolean) => {
        const updatedTicketTypes = [...formData.ticketTypes];
        updatedTicketTypes[index] = { 
            ...updatedTicketTypes[index], 
            [field]: field === 'price' || field === 'totalTickets' || field === 'soldTickets' ? Number(value) : value,
            currency: formData.eventCurrency,
            isFree: formData.isFreeEvent
        };
       
        setFormData(prev => ({
            ...prev,
            ticketTypes: updatedTicketTypes
        }));
    };


    const addTicketType = () => {
        setFormData(prev => ({
            ...prev,
            ticketTypes: [...prev.ticketTypes, { 
                name: '', 
                price: 0, 
                currency: prev.eventCurrency, 
                totalTickets: 0, 
                soldTickets: 0,
                isFree: prev.isFreeEvent,
                ticketTypeId: '' // will be generated on the backend bro
            }]
        }));
    };


    const removeTicketType = (index: number) => {
        if (formData.ticketTypes.length > 1) {
            setFormData(prev => ({
                ...prev,
                ticketTypes: prev.ticketTypes.filter((_, i) => i !== index)
            }));
        }
    };

    const handleSave = () => {
      if (validateInputs()) {
        const combinedDateTime = formData.eventDate
            ? new Date(Date.UTC(
                formData.eventDate.getUTCFullYear(),
                formData.eventDate.getUTCMonth(),
                formData.eventDate.getUTCDate(),
                formData.eventDate.getUTCHours(),
                formData.eventDate.getUTCMinutes(),
                0  // seconds
              ))
            : undefined;

        const eventToSave = {
            ...event,
            ...formData,
            eventDate: combinedDateTime ? format(combinedDateTime, "yyyy-MM-dd'T'HH:mm:ss'Z'") : '',
            eventImages: [...formData.eventImages, ...newImages.map(file => URL.createObjectURL(file))]
        };
        onSave(eventToSave, newImages, newVideo || undefined);
        onClose();
    } else {
      return;
    }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[635px] max-w-[370px] h-[90vh] rounded-md flex flex-col">
                <DialogHeader>
                    <DialogTitle>Edit Event</DialogTitle>
                    <DialogDescription>
                        Make changes to your event here. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-grow">
                    <div className="space-y-4 p-4">
                        <div className="space-y-2">
                            <Label htmlFor="eventName">Event Name</Label>
                            <Input
                                id="eventName"
                                name="eventName"
                                value={formData.eventName}
                                onChange={handleChange}
                            />
                            {errors.eventName && <p className="text-red-500 text-sm">{errors.eventName}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="eventCategory">Event Category</Label>
                            <Select value={formData.eventCategory} onValueChange={handleCategoryChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {['Night Party', 'Swimming Party', 'Sport & Fitness', 'Media & Films', 'Government', 'Concert', 'Conference', 'Startups & Business'].map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.eventCategory && <p className="text-red-500 text-sm">{errors.eventCategory}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="eventDescription">Event Description</Label>
                            <Textarea
                                id="eventDescription"
                                name="eventDescription"
                                value={formData.eventDescription}
                                onChange={handleChange}
                            />
                            {errors.eventDescription && <p className="text-red-500 text-sm">{errors.eventDescription}</p>}
                        </div>

                        {/* Free Event Switch */}
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="free-event"
                                checked={formData.isFreeEvent}
                                onCheckedChange={handleSwitchChange}
                            />
                            <Label htmlFor="free-event">Free Event</Label>
                        </div>

                        {/* Currency Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="eventCurrency">Event Currency</Label>
                            <Select value={formData.eventCurrency} onValueChange={handleCurrencyChange}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Select a currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {africanCountries.map((country) => (
                                        <SelectItem key={country.code} value={country.code}>
                                            <div className="flex items-center">
                                                <ReactCountryFlag
                                                    countryCode={country.code}
                                                    svg
                                                    style={{
                                                        width: '1em',
                                                        height: '1em',
                                                    }}
                                                    title={country.name}
                                                />
                                                <span className="ml-2">{country.currency.code}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.eventCurrency && <p className="text-red-500 text-sm">{errors.eventCurrency}</p>}
                        </div>

                          {/* Event Date and Time */}
                          <div className="space-y-2">
                            <Label>Event Date and Time</Label>
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[280px] justify-start text-left font-normal",
                                                !formData.eventDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {formData.eventDate ? format(formData.eventDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={formData.eventDate}
                                            onSelect={handleDateChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <TimePicker 
                                    date={formData.eventDate} 
                                    setDate={(date) => setFormData(prev => ({ ...prev, eventDate: date }))}
                                />
                            </div>
                            {errors.eventDate && <p className="text-red-500 text-sm">{errors.eventDate}</p>}
                        </div>

                        {/* Address Location */}
                        <div className="space-y-2">
                            <Label htmlFor="addressLocation">Address Location</Label>
                            <Input
                                id="addressLocation"
                                name="addressLocation"
                                value={formData.addressLocation}
                                onChange={handleChange}
                            />
                            {errors.addressLocation && <p className="text-red-500 text-sm">{errors.addressLocation}</p>}
                        </div>

                        {/* Google Maps URL */}
                        <div className="space-y-2">
                            <Label htmlFor="googleMapsUrl">Google Maps URL</Label>
                            <Input
                                id="googleMapsUrl"
                                name="googleMapsUrl"
                                value={formData.googleMapsUrl}
                                onChange={handleChange}
                            />
                            {errors.googleMapsUrl && <p className="text-red-500 text-sm">{errors.googleMapsUrl}</p>}
                        </div>

                        {/* Ticket Types */}
                        <div className="space-y-4">
                            <Label className="text-lg font-medium text-gray-700">Ticket Types</Label>
                            {formData.ticketTypes.map((ticketType, index) => (
                                <div key={index} className="space-y-2 p-4 border rounded-md">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-sm font-medium text-gray-700">Ticket Type {index + 1}</Label>
                                        {index > 0 && (
                                            <Button type="button" variant="destructive" size="sm" onClick={() => removeTicketType(index)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <Input
                                        placeholder="Ticket Name"
                                        value={ticketType.name}
                                        onChange={(e) => handleTicketTypeChange(index, 'name', e.target.value)}
                                        className="w-full"
                                    />
                                    {errors[`ticketType${index}Name`] && <p className="text-red-500 text-sm">{errors[`ticketType${index}Name`]}</p>}
                                    {!formData.isFreeEvent && (
                                        <div className="flex items-center space-x-2 mt-2">
                                            <p className="text-xs text-gray-600">Ticket Price</p>
                                            <FaMoneyBillWave className="h-4 w-4" />
                                            <Input
                                                type="number"
                                                placeholder="Price"
                                                value={ticketType.price}
                                                onChange={(e) => handleTicketTypeChange(index, 'price', e.target.value)}
                                                className="flex-grow"
                                                min="0"
                                                step="0.01"
                                                disabled={formData.isFreeEvent}
                                            />
                                        </div>
                                    )}
                                    {errors[`ticketType${index}Price`] && <p className="text-red-500 text-sm">{errors[`ticketType${index}Price`]}</p>}
                                    <div className="flex items-center space-x-2 mt-2">
                                        <p className="text-xs text-gray-600">Tickets available</p>
                                        <Ticket className="h-4 w-4" />
                                        <Input
                                            type="number"
                                            placeholder="Total Tickets"
                                            value={ticketType.totalTickets}
                                            onChange={(e) => handleTicketTypeChange(index, 'totalTickets', e.target.value)}
                                            className="flex-grow"
                                            min="1"
                                        />
                                    </div>
                                    {errors[`ticketType${index}TotalTickets`] && <p className="text-red-500 text-sm">{errors[`ticketType${index}TotalTickets`]}</p>}
                                    <div className="flex items-center space-x-2 mt-2">
                                        <p className="text-xs text-gray-600">Sold Tickets</p>
                                        <Input
                                            type="number"
                                            value={ticketType.soldTickets}
                                            className="flex-grow"
                                            disabled
                                        />
                                    </div>
                                    {!formData.isFreeEvent && ticketType.price > 0 && (
                                        <p className="text-sm text-gray-600 mt-2">
                                            <Tag className="inline-block mr-2 h-4 w-4" />
                                            Formatted price: {formatCurrency(ticketType.price, formData.eventCurrency)}
                                        </p>
                                    )}
                                </div>
                            ))}
                            <Button type="button" onClick={addTicketType} className="w-full mt-2">
                                <Plus className="h-4 w-4 mr-2" /> Add Ticket Type
                            </Button>
                            {errors.ticketTypes && <p className="text-red-500 text-sm">{errors.ticketTypes}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Event Images</Label>
                            <div className="grid sm:grid-cols-3 grid-cols-2 gap-4">
                                {formData.eventImages.map((image, index) => (
                                    <div key={index} className="relative">
                                        <Image
                                            src={image}
                                            alt={`Event image ${index + 1}`}
                                            width={200}
                                            height={200}
                                            className="rounded-lg object-cover w-full h-32"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                {newImages.map((file, index) => (
                                    <div key={`new-${index}`} className="relative">
                                        <Image
                                            src={URL.createObjectURL(file)}
                                            alt={`New event image ${index + 1}`}
                                            width={200}
                                            height={200}
                                            className="rounded-lg object-cover w-full h-32"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                <label className="flex flex-col items-center justify-center w-full sm:h-32 h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                        <p className="mb-2 p-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    </div>
                                    <input
                                        id="eventImages"
                                        name="eventImages"
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        multiple
                                        accept="image/*"
                                    />
                                </label>
                            </div>
                            {errors.eventImages && <p className="text-red-500 text-sm">{errors.eventImages}</p>}
                        </div>

                        {formData.eventVideo && (
                            <div className="space-y-2">
                                <Label>Current Event Video</Label>
                                <video controls className="w-full">
                                    <source src={formData.eventVideo} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="eventVideo">Update Event Video (optional)</Label>
                            {newVideo && (
                              <div className="space-y-2">
                                  <Label>New Event Video Preview</Label>
                                  <video controls className="w-full">
                                      <source src={URL.createObjectURL(newVideo)} type="video/mp4" />
                                      Your browser does not support the video tag.
                                  </video>
                                  <Button onClick={() => setNewVideo(null)}>Remove Video</Button>
                              </div>
                          )}
                            <Input
                                id="eventVideo"
                                name="eventVideo"
                                type="file"
                                onChange={handleFileChange}
                                accept="video/*"
                            />
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button type="submit" onClick={handleSave}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditEventModal;