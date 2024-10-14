import Link from "next/link"
import { Calendar, Download, Headset, LogOut, MoreHorizontal, Search, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import SidebarPublisher from "@/app/components/sidebar-publisher"
import Image from "next/image"
import Footer from "@/app/components/footer"

export default function Attendees() {


  const handleLogOut = () => {
    localStorage.removeItem("token");
    window.location.reload();
};

  return (
    <div className="flex min-h-screen bg-black flex-col">
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
      <main className="flex-1 sm:ml-12">
        <div className="container py-6 md:py-10">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Attendees</h1>
            <Button>
              <Download className="mr-2 h-4 w-4" /> Export Attendees
            </Button>
          </div>
          <div className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendee Overview</CardTitle>
                <CardDescription>Manage and monitor attendees across all your events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
                    <Input placeholder="Search attendees..." className="md:max-w-xs" />
                    <Select>
                      <SelectTrigger className="md:max-w-xs">
                        <SelectValue placeholder="Filter by event" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Events</SelectItem>
                        <SelectItem value="summer-beats-2023">Summer Beats 2023</SelectItem>
                        <SelectItem value="tech-conference-2023">Tech Conference 2023</SelectItem>
                        <SelectItem value="food-wine-expo">Food & Wine Expo</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="md:max-w-xs">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Ticket Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Alice Johnson</TableCell>
                        <TableCell>alice@example.com</TableCell>
                        <TableCell>Summer Beats 2023</TableCell>
                        <TableCell>VIP</TableCell>
                        <TableCell><Badge>Confirmed</Badge></TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Information</DropdownMenuItem>
                              <DropdownMenuItem>Resend Confirmation</DropdownMenuItem>
                              <DropdownMenuItem>Cancel Ticket</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Bob Smith</TableCell>
                        <TableCell>bob@example.com</TableCell>
                        <TableCell>Tech Conference 2023</TableCell>
                        <TableCell>General Admission</TableCell>
                        <TableCell><Badge variant="outline">Pending</Badge></TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Information</DropdownMenuItem>
                              <DropdownMenuItem>Resend Confirmation</DropdownMenuItem>
                              <DropdownMenuItem>Cancel Ticket</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Carol Davis</TableCell>
                        <TableCell>carol@example.com</TableCell>
                        <TableCell>Food & Wine Expo</TableCell>
                        <TableCell>Early Bird</TableCell>
                        <TableCell><Badge>Confirmed</Badge></TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Information</DropdownMenuItem>
                              <DropdownMenuItem>Resend Confirmation</DropdownMenuItem>
                              <DropdownMenuItem>Cancel Ticket</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">David Wilson</TableCell>
                        <TableCell>david@example.com</TableCell>
                        <TableCell>Summer Beats 2023</TableCell>
                        <TableCell>General Admission</TableCell>
                        <TableCell><Badge variant="secondary">Cancelled</Badge></TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Resend Confirmation</DropdownMenuItem>
                              <DropdownMenuItem>Reinstate Ticket</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <div className="sm:pl-14 pl-0">
          <Footer />
        </div>
    </div>
  )
}