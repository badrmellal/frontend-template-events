import SidebarUser from "@/app/components/sidebar-user";
import React, { useState } from "react"
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
import { CreditCard, Headset, LogOut } from "lucide-react";

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

const Settings: React.FC = () => {

  const [profileImage, setProfileImage] = useState("/profile_avatar.png")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [hasRegisteredCard, setHasRegisteredCard] = useState(true)

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
                  <Input id="username" defaultValue="Badr Mellal" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="badr@example.com" disabled />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
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
    </div>
  )
}

export default Settings;
