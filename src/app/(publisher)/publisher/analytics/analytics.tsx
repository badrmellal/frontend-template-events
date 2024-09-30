import Link from "next/link"
import { Calendar, Download, MoreHorizontal, Users, DollarSign, Ticket, TrendingUp, Headset, LogOut } from "lucide-react"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import SidebarPublisher from "@/app/components/sidebar-publisher"
import Image from "next/image"
import Footer from "@/app/components/footer"

export default function Analytics() {




  const handleLogOut = () => {
    localStorage.removeItem("token");
    window.location.reload();
};

  return (
    <div className="flex min-h-screen flex-col bg-black pb-6">
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
      <main className="flex-1 sm:ml-14 text-white">
        <div className="container py-6 md:py-10">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <div className="flex items-center space-x-2">
              <Select defaultValue="all-time">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-time">All Time</SelectItem>
                  <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                  <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Download className="mr-2 h-4 w-4" /> Export Report
              </Button>
            </div>
          </div>
         
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Events</CardTitle>
                <CardDescription>Based on ticket sales and revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Tickets Sold</TableHead>
                      <TableHead>Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Summer Beats</TableCell>
                      <TableCell>1,234</TableCell>
                      <TableCell>$24,680</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Tech Conference 2024</TableCell>
                      <TableCell>987</TableCell>
                      <TableCell>$19,740</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Food & Wine Expo</TableCell>
                      <TableCell>765</TableCell>
                      <TableCell>$15,300</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Art Gallery Opening</TableCell>
                      <TableCell>432</TableCell>
                      <TableCell>$8,640</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Ticket Type Distribution</CardTitle>
                <CardDescription>Breakdown of ticket sales by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">General Admission</span>
                        <span className="text-sm text-muted-foreground">65%</span>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-secondary">
                        <div className="h-2 w-[65%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">VIP</span>
                        <span className="text-sm text-muted-foreground">20%</span>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-secondary">
                        <div className="h-2 w-[20%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Early Bird</span>
                        <span className="text-sm text-muted-foreground">10%</span>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-secondary">
                        <div className="h-2 w-[10%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Group Discount</span>
                        <span className="text-sm text-muted-foreground">5%</span>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-secondary">
                        <div className="h-2 w-[5%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest financial activities across your events</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">#TR-0001</TableCell>
                    <TableCell>Summer Beats</TableCell>
                    <TableCell>alice@example.com</TableCell>
                    <TableCell>$120.00</TableCell>
                    <TableCell><Badge>Completed</Badge></TableCell>
                    <TableCell>2024-07-01</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#TR-0002</TableCell>
                    <TableCell>Tech Conference 2024</TableCell>
                    <TableCell>bob@example.com</TableCell>
                    <TableCell>$250.00</TableCell>
                    <TableCell><Badge>Completed</Badge></TableCell>
                    <TableCell>2024-07-02</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#TR-0003</TableCell>
                    <TableCell>Food & Wine Expo</TableCell>
                    <TableCell>carol@example.com</TableCell>
                    <TableCell>$75.00</TableCell>
                    <TableCell><Badge variant="outline">Pending</Badge></TableCell>
                    <TableCell>2024-07-03</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#TR-0004</TableCell>
                    <TableCell>Art Gallery Opening</TableCell>
                    <TableCell>david@example.com</TableCell>
                    <TableCell>$50.00</TableCell>
                    <TableCell><Badge>Completed</Badge></TableCell>
                    <TableCell>2024-07-04</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    <Footer />
    </div>
  )
}