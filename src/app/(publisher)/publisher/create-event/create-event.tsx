"use client"

import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { format, set } from "date-fns";
import { Calendar as CalendarIcon, Headset, LogOut, Plus, Tag, Ticket, Upload, X } from "lucide-react"; 
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SidebarPublisher from '@/app/components/sidebar-publisher';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from "@/components/ui/switch";
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency, africanCountries, getCurrencyByCountryCode } from '@/app/api/currency/route';
import ReactCountryFlag from 'react-country-flag';
import TimePicker from '@/app/components/time-picker';

interface EventFormInputs {
    eventName: string;
    eventCategory: string;
    eventDescription: string;
    eventImages: File[];
    eventVideo?: File | null;
    isFreeEvent: boolean;
    eventCountry: string;
    eventCurrency: string;
    eventDate: Date | undefined;
    eventTime: string;
    addressLocation: string;
    googleMapsUrl: string;
    ticketTypes: TicketType[];

}

interface TicketType {
    name: string;
    price: number;
    currency: string;
    totalTickets: number;
    isFree: boolean;
}

const eventCategories = [
    'Night Party',
    'Swimming Party',
    'Sport & Fitness',
    'Media & Films',
    'Government',
    'Concert',
    'Conference',
    'Startups & Business'
];


const CreateEvent: React.FC = () => {
    const [formData, setFormData] = useState<EventFormInputs>({
        eventName: '',
        eventCategory: '',
        eventDescription: '',
        eventImages: [],
        eventVideo: null,
        isFreeEvent: false,
        eventCurrency: '',
        eventCountry: '',
        eventDate: undefined,
        eventTime: '',
        addressLocation: '',
        googleMapsUrl: '',
        ticketTypes: [{ name: 'General Admission', price: 0, currency: 'MA', totalTickets: 0, isFree: true }]
    });
    const [isTokenExpired, setIsTokenExpired] = useState(false);
    const { toast } = useToast();
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [previewImages, setPreviewImages] = useState<string[]>([]);


    const handleCountryChange = (value: string) => {
        const currency = getCurrencyByCountryCode(value);
        if (currency) {
            setFormData(prev => ({
                ...prev,
                eventCountry: value,
                eventCurrency: currency.code,
                ticketTypes: prev.ticketTypes.map(ticket => ({
                    ...ticket,
                    currency: currency.code
                }))
            }));
        }
    };

    const handleCategoryChange = (value: string) => {
        setFormData(prevState => ({
            ...prevState,
            eventCategory: value,
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleDateChange = (date: Date | undefined) => {
        setFormData(prevState => ({
            ...prevState,
            eventDate: date
        }));
    };
    
    const handleTicketTypeChange = (index: number, field: keyof TicketType, value: string | number | boolean) => {
        const updatedTicketTypes = [...formData.ticketTypes];
        updatedTicketTypes[index] = { 
            ...updatedTicketTypes[index], 
            [field]: field === 'price' || field === 'totalTickets' ? Number(value) : value,
            currency: formData.eventCurrency // to ensure currency is always synced with event currency
        };
        if (field === 'isFree') {
            updatedTicketTypes[index].price = value ? 0 : updatedTicketTypes[index].price;
        }
        setFormData(prevState => ({
            ...prevState,
            ticketTypes: updatedTicketTypes
        }));
    };

    const addTicketType = () => {
        setFormData(prevState => ({
            ...prevState,
            ticketTypes: [...prevState.ticketTypes, { name: '', price: 0, currency: 'MA', totalTickets: 0, isFree: false }]
        }));
    };

    const removeTicketType = (index: number) => {
        if (formData.ticketTypes.length > 1) {
            setFormData(prevState => ({
                ...prevState,
                ticketTypes: prevState.ticketTypes.filter((_, i) => i !== index)
            }));
        }
    };


    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            if (name === 'eventImages') {
                setFormData(prevState => ({
                    ...prevState,
                    eventImages: [...prevState.eventImages, ...Array.from(files)],
                }));
                
                // Creating preview URLs for the new images
                const newPreviewUrls = Array.from(files).map(file => URL.createObjectURL(file));
                setPreviewImages(prevPreviews => [...prevPreviews, ...newPreviewUrls]);
            } else if (name === 'eventVideo') {
                setFormData(prevState => ({
                    ...prevState,
                    eventVideo: files[0],
                }));
            }
        }
    }, []);

    const removeImage = useCallback((index: number) => {
        setFormData(prevState => ({
            ...prevState,
            eventImages: prevState.eventImages.filter((_, i) => i !== index),
        }));
        setPreviewImages(prevPreviews => prevPreviews.filter((_, i) => i !== index));
    }, []);

    const handleSwitchChange = (checked: boolean) => {
        setFormData(prevState => ({
            ...prevState,
            isFreeEvent: checked,
            ticketTypes: prevState.ticketTypes.map(ticket => ({
                ...ticket,
                isFree: checked,
                price: checked ? 0 : ticket.price
            }))
        }));
    };

    const validateInputs = () => {
        let newErrors: { [key: string]: string } = {};
        const googleMapsUrlPattern = /^https:\/\/(www\.)?google\.[a-z]{2,3}\/maps\/.*$/;

        if (!formData.eventName.trim()) newErrors.eventName = "Event name is required.";
        if (!formData.eventCategory) newErrors.eventCategory = "Event category is required.";
        if (!formData.eventDescription.trim()) newErrors.eventDescription = "Event description is required.";
        if (formData.eventImages.length === 0) newErrors.eventImages = "At least one event image is required.";
        if (!formData.eventCountry) newErrors.eventCountry = "Please select a country for the event.";
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


    useEffect(() => {
        if (!formData.eventCountry) {
            const defaultCountry = africanCountries[0];
            setFormData(prev => ({
                ...prev,
                eventCountry: defaultCountry.code,
                eventCurrency: defaultCountry.currency.code,
            }));
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateInputs()) {
            return;
        }

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'eventImages') {
                formData.eventImages.forEach((file, index) => {
                    data.append(`eventImages`, file);
                });
            } else if (key === 'eventVideo' && value) {
                data.append('eventVideo', value);
            } else if (key === 'eventDate' && value) {
                const eventDate = value as Date;
                // Converting to UTC and format as ISO 8601
                const utcDate = new Date(Date.UTC(
                    eventDate.getUTCFullYear(),
                    eventDate.getUTCMonth(),
                    eventDate.getUTCDate(),
                    eventDate.getUTCHours(),
                    eventDate.getUTCMinutes(),
                    0  // seconds
                ));
                data.append('eventDate', format(utcDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"));
            } else if (key === 'ticketTypes') {
                data.append('ticketTypes', JSON.stringify(value));
            } else if (key !== 'eventTime') {
                data.append(key, value?.toString() || '');
            }
        });

        try {
            const response = await axios.post('http://localhost:8080/events/create', data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200){
                toast({
                    title: "Event created successfully!",
                    description: "Congratulations on publishing a new event."
                });
                setFormData({
                    eventName: '',
                    eventCategory: '',
                    eventDescription: '',
                    eventImages: [],
                    eventVideo: null,
                    isFreeEvent: false,
                    eventCurrency: '',
                    eventCountry: '',
                    eventDate: undefined,
                    eventTime: '',
                    addressLocation: '',
                    googleMapsUrl: '',
                    ticketTypes: [{ name: 'General Admission', price: 0, currency: 'MA', totalTickets: 0, isFree: true }]
                })
                setPreviewImages([]);

            }
        } catch (error: any) {
            console.error('Error creating event:', error);
            if(error.response && error.response.status === 401) {
                setIsTokenExpired(true);
            } else {
                toast({
                    variant: "destructive",
                    title: "Error occurred!",
                    description: "Please try again."
                });
            }
        }
    };

    const handleLogOut = () => {
        localStorage.removeItem("token");
        window.location.reload();
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
            <div className="max-w-7xl mx-auto p-8 sm:p-12 md:p-16">
                <Card className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <CardHeader className="bg-gray-950 text-white p-6">
                        <CardTitle className="text-3xl font-bold">Create New Live Event</CardTitle>
                        <CardDescription className="text-gray-300">Fill in the details to publish your event</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="eventName" className="text-sm font-medium text-gray-700">Event Name</Label>
                                        <Input
                                            id="eventName"
                                            name="eventName"
                                            value={formData.eventName}
                                            onChange={handleChange}
                                            className="w-full"
                                        />
                                        {errors.eventName && <p className="text-red-500 text-sm">{errors.eventName}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="eventCategory" className="text-sm font-medium text-gray-700">Event Category</Label>
                                        <Select value={formData.eventCategory} onValueChange={handleCategoryChange}>
                                            <SelectTrigger id="eventCategory" className="w-full">
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Categories</SelectLabel>
                                                    {eventCategories.map((category) => (
                                                        <SelectItem key={category} value={category}>
                                                            {category}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {errors.eventCategory && <p className="text-red-500 text-sm">{errors.eventCategory}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="eventDescription" className="text-sm font-medium text-gray-700">Event Description</Label>
                                    <Textarea
                                        id="eventDescription"
                                        name="eventDescription"
                                        value={formData.eventDescription}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-gray-700 border rounded-lg"
                                        rows={4}
                                    />
                                    {errors.eventDescription && <p className="text-red-500 text-sm">{errors.eventDescription}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Event Images</Label>
                                    <div className="grid sm:grid-cols-3 grid-cols-2 gap-4">
                                        {previewImages.map((preview, index) => (
                                            <div key={index} className="relative">
                                                <Image
                                                    src={preview}
                                                    alt={`Event image ${index + 1}`}
                                                    width={200}
                                                    height={200}
                                                    className="rounded-lg object-cover w-full h-32"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
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

                                <div className="space-y-2">
                                    <Label htmlFor="eventVideo" className="text-sm font-medium text-gray-700">Event Video (optional)</Label>
                                    <Input
                                        id="eventVideo"
                                        name="eventVideo"
                                        type="file"
                                        onChange={handleFileChange}
                                        className="w-full"
                                        accept="video/*"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="eventCountry" className="text-sm font-medium text-gray-700">Select Event Country</Label>
                                    <Select value={formData.eventCountry} onValueChange={handleCountryChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a country">
                                                {formData.eventCountry && (
                                                    <div className="flex items-center">
                                                        <ReactCountryFlag
                                                            countryCode={formData.eventCountry}
                                                            svg
                                                            style={{
                                                                width: '1em',
                                                                height: '1em',
                                                            }}
                                                            title={formData.eventCountry}
                                                        />
                                                        <span className="ml-2">{africanCountries.find(c => c.code === formData.eventCountry)?.name}</span>
                                                    </div>
                                                )}
                                            </SelectValue>
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
                                                        <span className="ml-2">{country.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.eventCountry && <p className="text-red-500 text-sm">{errors.eventCountry}</p>}
                                </div>


                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Event Date and Time</Label>
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

                                <div className="space-y-2">
                                    <Label htmlFor="addressLocation" className="text-sm font-medium text-gray-700">Address Location</Label>
                                    <Input
                                        id="addressLocation"
                                        name="addressLocation"
                                        value={formData.addressLocation}
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                    {errors.addressLocation && <p className="text-red-500 text-sm">{errors.addressLocation}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="googleMapsUrl" className="text-sm font-medium text-gray-700">Google Maps URL</Label>
                                    <Input
                                        id="googleMapsUrl"
                                        name="googleMapsUrl"
                                        value={formData.googleMapsUrl}
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                    {errors.googleMapsUrl && <p className="text-red-500 text-sm">{errors.googleMapsUrl}</p>}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={formData.isFreeEvent}
                                            onCheckedChange={handleSwitchChange}
                                        />
                                        <Label>Free Event</Label>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {formData.isFreeEvent 
                                            ? "This is a free event. Attendees can reserve spots without payment." 
                                            : "This is a paid event. Set up ticket types below."}
                                    </p>
                                </div>

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
                                                <div className="flex space-x-2 mt-2">
                                                    <Input
                                                        type="number"
                                                        placeholder="Price"
                                                        value={ticketType.price}
                                                        onChange={(e) => handleTicketTypeChange(index, 'price', e.target.value)}
                                                        className="flex-grow"
                                                        min="0"
                                                        step="0.01"
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
                                            {!formData.isFreeEvent && ticketType.price > 0 && (
                                                <p className="text-sm text-gray-600 mt-2">
                                                    <Tag className="inline-block mr-2 h-4 w-4" />
                                                    Formatted price: {formatCurrency(ticketType.price, formData.eventCountry)}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                    <Button type="button" onClick={addTicketType} className="w-full mt-2">
                                        <Plus className="h-4 w-4 mr-2" /> Add Ticket Type
                                    </Button>
                                    {errors.ticketTypes && <p className="text-red-500 text-sm">{errors.ticketTypes}</p>}
                                </div>

                                <div className="mt-6">
                                    <Button type="submit" className="w-full">
                                        Create Event
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
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
            </div>
    );
};

export default CreateEvent;