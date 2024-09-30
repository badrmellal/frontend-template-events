import SidebarUser from "@/app/components/sidebar-user";
import React, { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { ChevronDownIcon, CreditCard, Headset, LogOut } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ReactCountryFlag from "react-country-flag"
import axios from "axios";
import parsePhoneNumberFromString from "libphonenumber-js";
import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {africanCountries} from "@/app/api/currency/route";
import Footer from "@/app/components/footer";





const RegisteredCard = () => {
  return (
    <Card className="w-full max-w-[350px] max-h-[200px] mt-6 mb-24 bg-gradient-to-br from-blue-500 to-indigo-500 text-white mx-auto shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Registered Card</span>
          <CreditCard className="h-6 w-6" />
        </CardTitle>
        <CardDescription className="text-gray-200">
          Your current payment method
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-2xl font-bold">**** **** **** 3456</div>
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-gray-200">Card Holder</p>
            <p className="font-medium">Badr Mellal</p>
          </div>
          <div>
            <p className="text-sm text-gray-200">Expires</p>
            <p className="font-medium">12/25</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" className="w-full">Update Card</Button>
      </CardFooter>
    </Card>
  )
}

const AddCard = () => {
  return (
    <Card className="w-full max-w-[400px] mx-auto shadow-lg rounded-lg mt-6">
      <CardHeader>
        <CardTitle>Add New Card</CardTitle>
        <CardDescription>Enter your card details below.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="expiry">Expiry Date</Label>
            <Input id="expiry" placeholder="MM/YY" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="cvc">CVC</Label>
            <Input id="cvc" placeholder="123" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Add Card</Button>
      </CardFooter>
    </Card>
  )
}

interface User {
    id: string
    username: string
    email: string
    phoneNumber: string
    profileImage: string
}

const Settings: React.FC = () => {

  const [profileImage, setProfileImage] = useState("/profile_avatar.png")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [hasRegisteredCard, setHasRegisteredCard] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState(africanCountries[0])
  const [phoneNumber, setPhoneNumber] = useState('')
  const [input, setInput] = useState({
    username: "",
    email: "",
    phoneNumber: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [user, setUser] = useState<User>()
  const [token, setToken] = useState<string | null>("")
  const [phoneError, setPhoneError] = useState<string | null>(null)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [selectedCountry])

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchedUser = async () => {
      if(token) {
        const response = await axios.get('http://localhost:8080/user/user-info',{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        setUser(response.data)
      console.log(response.data)
    }
    }
    fetchedUser();
    setToken(token);
  }, [])
  ;
  const handleCountrySelect = (country: typeof selectedCountry) => {
    setSelectedCountry(country);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogOut = () => {
    localStorage.removeItem("token");
    window.location.reload();
  }
    const handleInputChange = (e: { target: { name: any; value: any; }; })=>{
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
  }
    const handleInfoSave = () => {

        try {
          setIsLoading(true);
            const { formattedNumber, countryCode } = storePhoneNumber(input.phoneNumber, selectedCountry.code);

        } catch (error) {
            console.log(error)
            setPhoneError(`Invalid ${selectedCountry.name} phone number `);
        }
        setIsLoading(false)
      }

  const storePhoneNumber = (rawNumber: string, country: string) => {
    // @ts-ignore
    const phoneNumber = parsePhoneNumberFromString(rawNumber, country);

    if (phoneNumber && phoneNumber.isValid()) {
      const formattedNumber = phoneNumber.format('E.164'); // Store in E.164 format
      const countryCode = phoneNumber.country; // Store the country code separately
      setPhoneError(null)
      return { formattedNumber, countryCode };
    } else {
      throw new Error('Invalid phone number');
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <SidebarUser />
      <div className="absolute top-3 right-3">
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
            <DropdownMenuItem onClick={handleLogOut}><LogOut className="h-4 w-4 mx-1 text-gray-500" /> Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex justify-center items-center pt-20 px-4 md:px-8 lg:px-16">
        <Tabs defaultValue="basic-info" className="w-full md:w-[600px] lg:w-[800px]">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="basic-info">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Basic Info</CardTitle>
                <CardDescription>
                  Update your basic information here. Click save when you&apos;re done.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileImage} alt="Profile picture" />
                    <AvatarFallback>BM</AvatarFallback>
                  </Avatar>
                  <Label htmlFor="picture" className="cursor-pointer text-sm text-primary">
                    Change Picture
                  </Label>
                  <Input
                    id="picture"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name={"username"} onChange={handleInputChange} defaultValue={user?.username} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name={"email"} onChange={handleInputChange} type="email" defaultValue={user?.email} />
                </div>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={false}
                        className="w-[120px] justify-between"
                      >
                        <ReactCountryFlag countryCode={selectedCountry.code} svg />
                        <span className="ml-2">{selectedCountry.dial_code}</span>
                        <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <div className="py-1">
                        {africanCountries.map((country) => (
                          <button
                            key={country.code}
                            onClick={() => handleCountrySelect(country)}
                            className="w-full text-left px-2 py-1 hover:bg-gray-100 flex items-center"
                          >
                            <ReactCountryFlag countryCode={country.code} svg className="mr-2" />
                            {country.name} ({country.dial_code})
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Input
                    ref={inputRef}
                    type="tel"
                    placeholder="Phone number"
                    value={input.phoneNumber}
                    onChange={handleInputChange}
                    className="flex-grow"
                    name={"phoneNumber"}
                  />
                </div>
                {
                    phoneError && <p className="text-red-600 text-sm">{phoneError}</p>
                }
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save changes"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Save changes</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to save these changes?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                          <Button type="submit" size="sm" className="px-3" variant="default" onClick={handleInfoSave}>
                            Save
                          </Button>
                        </DialogClose>
                        <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Cancel
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="billing">
            {hasRegisteredCard ? (
              <>
                <AddCard />
                <RegisteredCard />
              </>
            ) : (
              <AddCard />
            )}
          </TabsContent>
          <TabsContent value="activity">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Activity</CardTitle>
                <CardDescription>
                  View your recent account activity.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium">Password changed</h4>
                      <p className="text-sm text-muted-foreground">2 days ago</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">New login from Mac OS</h4>
                      <p className="text-sm text-muted-foreground">3 days ago</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Card information updated</h4>
                      <p className="text-sm text-muted-foreground">1 week ago</p>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <Button variant="outline">View full history</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="notifications">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Manage your notification preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                  <Label htmlFor="notifications">Enable notifications</Label>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  {notificationsEnabled
                    ? "You will receive notifications about account activity and updates."
                    : "You have disabled all notifications."}
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  )
}

export default Settings;
