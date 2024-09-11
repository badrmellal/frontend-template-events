import SidebarPublisher from "@/app/components/sidebar-publisher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDownIcon, CreditCard, Facebook, Globe, Headset, Instagram, LogOut, PlusCircle, Trash2, Twitter } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";


const africanCountries = [
    { code: 'EG', dial_code: '+20', name: 'Egypt' },
    { code: 'NG', dial_code: '+234', name: 'Nigeria' },
    { code: 'KE', dial_code: '+254', name: 'Kenya' },
    { code: 'ZA', dial_code: '+27', name: 'South Africa' },
    { code: 'GH', dial_code: '+233', name: 'Ghana' },
    { code: 'ET', dial_code: '+251', name: 'Ethiopia' },
    { code: 'TZ', dial_code: '+255', name: 'Tanzania' },
    { code: 'MA', dial_code: '+212', name: 'Morocco' },
    { code: 'DZ', dial_code: '+213', name: 'Algeria' },
    { code: 'TN', dial_code: '+216', name: 'Tunisia' },
    { code: 'MR', dial_code: '+222', name: 'Mauritania' }
  ];

  const socialPlatforms = [
    { value: 'facebook', label: 'Facebook', icon: Facebook },
    { value: 'instagram', label: 'Instagram', icon: Instagram },
    { value: 'website', label: 'Website', icon: Globe },
  ];

  interface SocialLink{
    url: string,
    platform: string
  }

const SettingPublisher: React.FC = () => {
    const [payoutFrequency, setPayoutFrequency] = useState('monthly');
    const [profileImage, setProfileImage] = useState("/profile_avatar.png")
    const [notificationsEnabled, setNotificationsEnabled] = useState(true)
    const [selectedCountry, setSelectedCountry] = useState(africanCountries[0])
    const [phoneNumber, setPhoneNumber] = useState('')
    const [savedPayoutMethod, setSavedPayoutMethod] = useState({ type: 'bank_transfer', details: '**** 1234' });
    const inputRef = useRef<HTMLInputElement>(null)

    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([{ platform: '', url: '' }]);
    const addSocialLink = () => {
        setSocialLinks([...socialLinks, { platform: '', url: '' }]);
      };
    
      const removeSocialLink = (index: number) => {
        const newLinks = socialLinks.filter((_, i) => i !== index);
        setSocialLinks(newLinks);
      };
    
      const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
        const newLinks = [...socialLinks];
        newLinks[index][field] = value;
        setSocialLinks(newLinks);
      };
    

    useEffect(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, [selectedCountry])
    
      const handleCountrySelect = (country: typeof selectedCountry) => {
        setSelectedCountry(country);
      };
    
      const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '')
        setPhoneNumber(value)
      }
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
        <SidebarPublisher />
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
              <TabsTrigger value="payout settings">Payout</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="basic-info">
              <Card className="w-full mb-10">
                <CardHeader>
                  <CardTitle>Basic Info</CardTitle>
                  <CardDescription>
                    Update your information here. Click save when you&apos;re done.
                  </CardDescription>
                  <CardDescription className="text-red-500 italic">
                    Note: Your information is publicly available!
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
                    <Input disabled id="username" defaultValue="Badr Mellal" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="badr@example.com" disabled />
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
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      className="flex-grow"
                    />
                  </div>
                  <div className="space-y-1">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell your customers about yourself or your organisation and your events..."
                  />
                </div>
                <div className="space-y-4">
                    <Label>Social Links</Label>
                    {socialLinks.map((link, index) => (
                        <div key={index} className="flex items-center space-x-2">
                        <Select
                            value={link.platform}
                            onValueChange={(value) => updateSocialLink(index, 'platform', value)}
                        >
                            <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent>
                            {socialPlatforms.map((platform) => (
                                <SelectItem key={platform.value} value={platform.value}>
                                <div className="flex items-center">
                                    <platform.icon className="w-4 h-4 mr-2" />
                                    {platform.label}
                                </div>
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <Input
                            placeholder="Enter URL"
                            value={link.url}
                            onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSocialLink(index)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </div>
                    ))}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={addSocialLink}
                        className="mt-2"
                    >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Social Link
                    </Button>
                    </div>
                </CardContent>
                <CardFooter>
                  <Button>Save changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="payout settings">
            <Card>
        <CardHeader>
          <CardTitle>Payout Settings</CardTitle>
          <CardDescription>Manage your payout preferences and schedule.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="payout-method">Payout Method</Label>
            <Select defaultValue="bank_transfer">
              <SelectTrigger id="payout-method">
                <SelectValue placeholder="Select payout method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="mobile_money">Mobile Money</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="payout-frequency">Payout Frequency</Label>
            <Select value={payoutFrequency} onValueChange={setPayoutFrequency}>
              <SelectTrigger id="payout-frequency">
                <SelectValue placeholder="Select payout frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="minimum-payout">Minimum Payout Amount ($)</Label>
            <Input id="minimum-payout" type="number" placeholder="100" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Save Payout Settings</Button>
        </CardFooter>
      </Card>
      <Card className="mt-6 mb-10">
              <CardHeader>
                <CardTitle>Saved Payout Method</CardTitle>
                <CardDescription>Your default payout method</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <CreditCard className="h-6 w-6 text-gray-400" />
                  <div>
                    <p className="font-medium">{savedPayoutMethod.type === 'bank_transfer' ? 'Bank Transfer' : savedPayoutMethod.type}</p>
                    <p className="text-sm text-gray-500">{savedPayoutMethod.details}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Update Payout Method</Button>
              </CardFooter>
            </Card>
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

export default SettingPublisher;