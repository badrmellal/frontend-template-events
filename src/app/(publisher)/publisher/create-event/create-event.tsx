import React, { useCallback, useState } from 'react';
import axios from 'axios';
import { format } from "date-fns";
import { Calendar as CalendarIcon, DollarSign, Headset, LogOut, Upload } from "lucide-react"; 
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
import { useDropzone } from 'react-dropzone';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';


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
    isVirtualEvent: boolean;
    virtualEventLink?: string;
    earlyBirdDiscount: number;
    earlyBirdDeadline?: Date | string;
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
        isVirtualEvent: false,
        virtualEventLink: '',
        earlyBirdDiscount: 0,
        earlyBirdDeadline: '',
    });
    const [isTokenExpired, setIsTokenExpired] = useState(false);
    const { toast } = useToast();
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles[0]) {
            setFormData(prevState => ({
                ...prevState,
                eventImage: acceptedFiles[0],
            }));
            setPreviewImage(URL.createObjectURL(acceptedFiles[0]));
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {'image/*': []},
        multiple: false
    });

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

        if (!formData.eventName.trim()) newErrors.eventName = "Event name is required.";
        if (!formData.eventCategory) newErrors.eventCategory = "Event category is required.";
        if (!formData.eventDescription.trim()) newErrors.eventDescription = "Event description is required.";
        if (!formData.eventImage) newErrors.eventImage = "Event image is required.";
        if (formData.eventPrice < 0) newErrors.eventPrice = "Event price cannot be negative.";
        if (!formData.eventDate) newErrors.eventDate = "Event date and time are required.";
        if (!formData.isVirtualEvent) {
            if (!formData.addressLocation.trim()) newErrors.addressLocation = "Address location is required.";
            if (!formData.googleMapsUrl.trim()) {
                newErrors.googleMapsUrl = "Google Maps URL is required.";
            } else if (!googleMapsUrlPattern.test(formData.googleMapsUrl)) {
                newErrors.googleMapsUrl = "Please enter a valid Google Maps URL.";
            }
        } else {
            if (!formData.virtualEventLink?.trim()) newErrors.virtualEventLink = "Virtual event link is required.";
        }
        if (formData.totalTickets <= 0) newErrors.totalTickets = "Total tickets must be greater than zero.";
        if (formData.earlyBirdDiscount && formData.earlyBirdDiscount < 0) newErrors.earlyBirdDiscount = "Early bird discount cannot be negative.";
        if (formData.earlyBirdDiscount && !formData.earlyBirdDeadline) newErrors.earlyBirdDeadline = "Early bird deadline is required when discount is set.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateInputs()) {
            return;
        }

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value instanceof File) {
                data.append(key, value);
            } else if (value instanceof Date) {
                data.append(key, value.toISOString());
            } else if (typeof value === 'boolean') {
                data.append(key, value.toString());
            } else if (value !== null && value !== undefined) {
                data.append(key, value.toString());
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
                    isVirtualEvent: false,
                    virtualEventLink: '',
                    earlyBirdDiscount: 0,
                    earlyBirdDeadline: '',
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
            <Card className="bg-black/50 backdrop-blur-md p-8 rounded-lg shadow-lg">
                <h2 className="text-4xl font-extrabold text-white text-center mb-8">Create New Event</h2>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <Label htmlFor="eventName" className="text-gray-300">Event Name</Label>
                            <Input
                                id="eventName"
                                name="eventName"
                                value={formData.eventName}
                                onChange={handleChange}
                                className="bg-gray-700 border-gray-600 text-white"
                            />
                            {errors.eventName && <p className="text-red-500 text-sm mt-1">{errors.eventName}</p>}
                        </div>

                        <div>
                            <Label htmlFor="eventCategory" className="text-gray-300">Event Category</Label>
                            <Select value={formData.eventCategory} onValueChange={(value) => setFormData(prev => ({ ...prev, eventCategory: value }))}>
                                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
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
                            {errors.eventCategory && <p className="text-red-500 text-sm mt-1">{errors.eventCategory}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="eventDescription" className="text-gray-300">Event Description</Label>
                            <Textarea
                                id="eventDescription"
                                name="eventDescription"
                                value={formData.eventDescription}
                                onChange={handleChange}
                                className="bg-gray-700 border-gray-600 text-white"
                                rows={4}
                            />
                            {errors.eventDescription && <p className="text-red-500 text-sm mt-1">{errors.eventDescription}</p>}
                        </div>

                        <div>
                            <Label className="text-gray-300 mb-2 block">Event Image</Label>
                            <div {...getRootProps()} className="cursor-pointer border-2 border-dashed border-gray-600 rounded-md p-4 text-center">
                                <input {...getInputProps()} />
                                {isDragActive ? (
                                    <p className="text-gray-300">Drop the image here ...</p>
                                ) : (
                                    <div>
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="text-gray-300 mt-2">Drag &apos;n&apos; drop an image here, or click to select one</p>
                                    </div>
                                )}
                            </div>
                            {previewImage && (
                                <div className="mt-4">
                                    <Image 
                                    src={previewImage} 
                                    alt="Preview" 
                                    className="max-w-full h-auto rounded-md" />
                                </div>
                            )}
                            {errors.eventImage && <p className="text-red-500 text-sm mt-1">{errors.eventImage}</p>}
                        </div>

                        <div>
                            <Label htmlFor="eventVideo" className="text-gray-300">Event Video (optional)</Label>
                            <Input
                                id="eventVideo"
                                name="eventVideo"
                                type="file"
                                onChange={handleFileChange}
                                className="bg-gray-700 border-gray-600 text-white cursor-pointer"
                            />
                        </div>

                        <div>
                            <Label htmlFor="eventPrice" className="text-gray-300">Event Price</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="eventPrice"
                                    name="eventPrice"
                                    type="number"
                                    value={formData.eventPrice}
                                    onChange={handleChange}
                                    className="bg-gray-700 border-gray-600 text-white pl-10"
                                />
                            </div>
                            {errors.eventPrice && <p className="text-red-500 text-sm mt-1">{errors.eventPrice}</p>}
                        </div>

                        <div>
                            <Label htmlFor="eventDate" className="text-gray-300">Event Date and Time</Label>
                            <div className="flex space-x-2">
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
                                            {formData.eventDate ? format(new Date(formData.eventDate), "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={formData.eventDate ? new Date(formData.eventDate) : undefined}
                                            onSelect={(date) => handleDateChange(date)}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <Input
                                    type="time"
                                    name="eventTime"
                                    value={formData.eventDate ? format(new Date(formData.eventDate), "HH:mm") : ''}
                                    onChange={(e) => handleTimeChange(e.target.value)}
                                    className="w-[140px] bg-gray-700 border-gray-600 text-white"
                                />
                            </div>
                            {errors.eventDate && <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="isVirtualEvent"
                                checked={formData.isVirtualEvent}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVirtualEvent: checked }))}
                            />
                            <Label htmlFor="isVirtualEvent" className="text-gray-300">Virtual Event</Label>
                        </div>

                        {formData.isVirtualEvent ? (
                            <div>
                                <Label htmlFor="virtualEventLink" className="text-gray-300">Virtual Event Link</Label>
                                <Input
                                    id="virtualEventLink"
                                    name="virtualEventLink"
                                    value={formData.virtualEventLink}
                                    onChange={handleChange}
                                    className="bg-gray-700 border-gray-600 text-white"
                                />
                                {errors.virtualEventLink && <p className="text-red-500 text-sm mt-1">{errors.virtualEventLink}</p>}
                            </div>
                        ) : (
                            <>
                                <div>
                                    <Label htmlFor="addressLocation" className="text-gray-300">Address Location</Label>
                                    <Input
                                        id="addressLocation"
                                        name="addressLocation"
                                        value={formData.addressLocation}
                                        onChange={handleChange}
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                    {errors.addressLocation && <p className="text-red-500 text-sm mt-1">{errors.addressLocation}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="googleMapsUrl" className="text-gray-300">Google Maps URL</Label>
                                    <Input
                                        id="googleMapsUrl"
                                        name="googleMapsUrl"
                                        value={formData.googleMapsUrl}
                                        onChange={handleChange}
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                    {errors.googleMapsUrl && <p className="text-red-500 text-sm mt-1">{errors.googleMapsUrl}</p>}
                                </div>
                            </>
                        )}

                        <div>
                            <Label htmlFor="totalTickets" className="text-gray-300">Total Tickets Available</Label>
                            <Input
                                id="totalTickets"
                                name="totalTickets"
                                type="number"
                                value={formData.totalTickets}
                                onChange={handleChange}
                                className="bg-gray-700 border-gray-600 text-white"
                            />
                            {errors.totalTickets && <p className="text-red-500 text-sm mt-1">{errors.totalTickets}</p>}
                        </div>

                        <div>
                            <Label htmlFor="earlyBirdDiscount" className="text-gray-300">Early Bird Discount (%)</Label>
                            <Input
                                id="earlyBirdDiscount"
                                name="earlyBirdDiscount"
                                type="number"
                                value={formData.earlyBirdDiscount}
                                onChange={handleChange}
                                className="bg-gray-700 border-gray-600 text-white"
                            />
                        </div>

                        {formData.earlyBirdDiscount > 0 && (
                            <div>
                                <Label htmlFor="earlyBirdDeadline" className="text-gray-300">Early Bird Deadline</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[280px] justify-start text-left font-normal",
                                                !formData.earlyBirdDeadline && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {formData.earlyBirdDeadline ? format(new Date(formData.earlyBirdDeadline), "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={formData.earlyBirdDeadline ? new Date(formData.earlyBirdDeadline) : undefined}
                                            onSelect={(date) => setFormData(prev => ({ ...prev, earlyBirdDeadline: date ? date.toISOString() : '' }))}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.earlyBirdDeadline && <p className="text-red-500 text-sm mt-1">{errors.earlyBirdDeadline}</p>}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center mt-8">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Create Event
                        </Button>
                    </div>
                </form>
            </Card>
        </div>

            <Dialog open={isTokenExpired} onOpenChange={setIsTokenExpired}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Session Expired</DialogTitle>
                        <DialogDescription>
                            Your session has expired. Please log in again to continue.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => {
                            localStorage.removeItem("token");
                            window.location.href="/login";
                        }}>
                            Log In
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
    };

export default CreateEvent;
