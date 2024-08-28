import React, { useState } from 'react';
import axios from 'axios';
import { format } from "date-fns";
import { Calendar as CalendarIcon, Headset, LogOut } from "lucide-react"; 
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
import SidebarPublisher from '@/app/components/sidebar-publisher';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface EventFormInputs {
    eventName: string;
    eventCategory: string;
    eventDescription: string;
    eventImage: File | null;
    eventVideo?: File | null;
    eventPrice: number;
    eventDate: Date | string;
    addressLocation: string;
    googleMapsUrl: string;
    totalTickets: number;
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
    //  more categories later
];

const CreateEvent: React.FC = () => {
    const [formData, setFormData] = useState<EventFormInputs>({
        eventName: '',
        eventCategory: '',
        eventDescription: '',
        eventImage: null,
        eventVideo: null,
        eventPrice: 0,
        eventDate: '',
        addressLocation: '',
        googleMapsUrl: '',
        totalTickets: 0,
    });
    const [isTokenExpired, setIsTokenExpired] = useState(false);
    const { toast } = useToast();
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
        const formattedDate = date ? format(date, "yyyy-MM-dd") : '';
        setFormData(prevState => ({
            ...prevState,
            eventDate: formattedDate,
        }));
    };
    
    const handleTimeChange = (time: string) => {
        const date = formData.eventDate ? format(new Date(formData.eventDate), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
        const combinedDateTime = `${date}T${time}`;
        setFormData(prevState => ({
            ...prevState,
            eventDate: combinedDateTime,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            setFormData(prevState => ({
                ...prevState,
                [name]: files[0],
            }));
        }
    };

    const validateInputs = () => {
        let newErrors: { [key: string]: string } = {};
        const googleMapsUrlPattern = /^https:\/\/(www\.)?google\.[a-z]{2,3}\/maps\/.*$/;

        if (!formData.eventName.trim()) {
            newErrors.eventName = "Event name is required.";
        }
        if (!formData.eventCategory) {
            newErrors.eventCategory = "Event category is required.";
        }
        if (!formData.eventDescription.trim()) {
            newErrors.eventDescription = "Event description is required.";
        }
        if (!formData.eventImage) {
            newErrors.eventImage = "Event image is required.";
        }
        if (formData.eventPrice <= 0) {
            newErrors.eventPrice = "Event price must be greater than zero.";
        }
        if (!formData.eventDate) {
            newErrors.eventDate = "Event date and time are required.";
        }
        if (!formData.addressLocation.trim()) {
            newErrors.addressLocation = "Address location is required.";
        }
        if (!formData.googleMapsUrl.trim()) {
            newErrors.googleMapsUrl = "Google Maps URL is required.";
        } else if (!googleMapsUrlPattern.test(formData.googleMapsUrl)) {
            newErrors.googleMapsUrl = "Please enter a valid Google Maps URL.";
        }
        if (formData.totalTickets <= 0) {
            newErrors.totalTickets = "Total tickets must be greater than zero.";
        }

        setErrors(newErrors);

        // true if no errors
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateInputs()) {
            return;
        }

        const data = new FormData();
        data.append('eventName', formData.eventName);
        data.append('eventCategory', formData.eventCategory);
        data.append('eventDescription', formData.eventDescription);
        data.append('eventPrice', formData.eventPrice.toString());
        data.append('eventDate', formData.eventDate instanceof Date ? formData.eventDate.toISOString() : formData.eventDate);
        data.append('addressLocation', formData.addressLocation);
        data.append('googleMapsUrl', formData.googleMapsUrl);
        data.append('totalTickets', formData.totalTickets.toString());

        if (formData.eventImage) {
            data.append('eventImage', formData.eventImage);
        }

        if (formData.eventVideo) {
            data.append('eventVideo', formData.eventVideo);
        }

        try {
            const response = await axios.post('http://localhost:8080/events/create', data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 201){
                toast({
                    title: "Event created successfully!",
                    description: "Congratulation on publishing a new event."
                })
                setFormData({
                    eventName: '',
                    eventCategory: '',
                    eventDescription: '',
                    eventImage: null,
                    eventVideo: null,
                    eventPrice: 0,
                    eventDate: '',
                    addressLocation: '',
                    googleMapsUrl: '',
                    totalTickets: 0,
                })
            }
        } catch (error: any) {
            console.error('Error creating event:', error);
            if(error.response && error.response.status === 401) {
                setIsTokenExpired(true);
            } else {
                toast({
                    variant: "destructive",
                    title: "Error happened!",
                    description: "Please try again."
                })
            }
        }
    };

    const handleLogOut = () => {
        localStorage.removeItem("token");
        window.location.reload();
    }

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
                    <h2 className="text-4xl font-extrabold text-white text-center mb-8">Create new event</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-gray-300 text-sm font-bold mb-2">Event Name</label>
                                <input
                                    type="text"
                                    name="eventName"
                                    value={formData.eventName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-white"
                                />
                                {errors.eventName && <p className="text-red-500 text-sm">{errors.eventName}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-bold mb-2">Event Category</label>
                                <Select value={formData.eventCategory} onValueChange={handleCategoryChange}>
                                <SelectTrigger className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-white">
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

                            <div className="md:col-span-2">
                                <label className="block text-gray-300 text-sm font-bold mb-2">Event Description</label>
                                <textarea
                                    name="eventDescription"
                                    value={formData.eventDescription}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-white"
                                    rows={4}
                                />
                                {errors.eventDescription && <p className="text-red-500 text-sm">{errors.eventDescription}</p>}
                            </div>

                            <div>                                
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="eventImage" className='block text-gray-300 text-sm font-bold mb-2'>Event Image</Label>
                                    <Input id="eventImage" 
                                    name='eventImage' 
                                    onChange={handleFileChange} 
                                    type="file" 
                                    className='cursor-pointer w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-white'
                                    />
                                    {errors.eventImage && <p className="text-red-500 text-sm">{errors.eventImage}</p>}
                                </div>                                
                            </div>

                            <div>                              
                                 <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="eventVideo" className='block text-gray-300 text-sm font-bold mb-2'>Event Video (optional)</Label>
                                    <Input id="eventVideo" 
                                    name='eventVideo' 
                                    onChange={handleFileChange} 
                                    type="file" 
                                    className='cursor-pointer w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-white'
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-bold mb-2">Event Price</label>
                                <input
                                    type="number"
                                    name="eventPrice"
                                    value={formData.eventPrice}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-white"
                                />
                                {errors.eventPrice && <p className="text-red-500 text-sm">{errors.eventPrice}</p>}
                            </div>

                            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 mt-6">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button 
                                            name='eventDate'
                                            variant={"outline"}
                                            className={cn(
                                                "w-[280px] justify-start text-left text-gray-50 font-semibold bg-gray-500 hover:bg-gray-700 border-0 rounded-lg shadow-lg",
                                                !formData.eventDate && "text-gray-300"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-5 w-5 text-gray-300" />
                                            {formData.eventDate ? format(new Date(formData.eventDate), "PPP p") : <span>Pick a date and time</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-4 rounded-lg shadow-lg bg-gray-500">
                                        <Calendar
                                            mode="single"
                                            selected={formData.eventDate ? new Date(formData.eventDate) : undefined}
                                            onSelect={(date) => handleDateChange(date)}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                
                                <input
                                    type="time"
                                    name="eventTime"
                                    value={formData.eventDate ? format(new Date(formData.eventDate), "HH:mm") : ''}
                                    onChange={(e) => handleTimeChange(e.target.value)}
                                    className="w-36 mt-4 sm:mt-0 px-3 py-1 cursor-pointer text-gray-100 bg-gray-500 hover:bg-gray-700 border-0 rounded-lg shadow-lg focus:outline-none focus:ring-1 focus:ring-white"
                                    style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                                />
                                {errors.eventDate && <p className="text-red-500 text-sm">{errors.eventDate}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-bold mb-2">Address Location</label>
                                <input
                                    type="text"
                                    name="addressLocation"
                                    value={formData.addressLocation}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-white"
                                />
                                {errors.addressLocation && <p className="text-red-500 text-sm">{errors.addressLocation}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-bold mb-2">Google Maps URL</label>
                                <input
                                    type="text"
                                    name="googleMapsUrl"
                                    value={formData.googleMapsUrl}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-white"
                                />
                                {errors.googleMapsUrl && <p className="text-red-500 text-sm">{errors.googleMapsUrl}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-bold mb-2">Total Tickets Available</label>
                                <input
                                    type="number"
                                    name="totalTickets"
                                    value={formData.totalTickets}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-white"
                                />
                                {errors.totalTickets && <p className="text-red-500 text-sm">{errors.totalTickets}</p>}
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <button
                                type="submit"
                                className="bg-transparent hover:bg-white hover:text-black text-white border border-white hover:border-black shadow-md font-bold py-3 px-6 rounded-md focus:outline-none transition duration-300"
                            >
                                Create Event
                            </button>
                        </div>
                    </form>
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

export default CreateEvent;
