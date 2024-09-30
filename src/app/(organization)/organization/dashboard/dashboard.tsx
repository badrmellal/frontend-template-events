import Footer from "@/app/components/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, BarChart2, Bell, Calendar, ChevronDown, DollarSign, Edit, HelpCircle, LogOut, MoreVertical, PlusCircle, Search, Settings, Ticket, Trash2, TrendingUp, Users } from "lucide-react";
import React, { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


const OrganizationDashboard: React.FC = () => {
    const [events, setEvents] = useState([
        { id: 1, name: 'Annual Tech Conference', date: '2024-09-15', attendees: 500, capacity: 600, revenue: 50000, status: 'Upcoming', ticketsSold: 450 },
        { id: 2, name: 'Product Launch Webinar', date: '2024-08-22', attendees: 1000, capacity: 1000, revenue: 0, status: 'Completed', ticketsSold: 1000 },
        { id: 3, name: 'Team Building Workshop', date: '2025-10-05', attendees: 50, capacity: 50, revenue: 2500, status: 'Upcoming', ticketsSold: 45 },
        { id: 4, name: 'Customer Appreciation Day', date: '2025-11-20', attendees: 200, capacity: 250, revenue: 10000, status: 'Planning', ticketsSold: 180 },
      ])
    
      const stats = [
        { title: 'Total Events', value: events.length, icon: Calendar, color: 'text-blue-500' },
        { title: 'Total Attendees', value: events.reduce((sum, event) => sum + event.attendees, 0), icon: Users, color: 'text-green-500' },
        { title: 'Total Revenue', value: `$${events.reduce((sum, event) => sum + event.revenue, 0).toLocaleString()}`, icon: DollarSign, color: 'text-amber-500' },
        { title: 'Avg. Attendance', value: Math.round(events.reduce((sum, event) => sum + event.attendees, 0) / events.length), icon: BarChart2, color: 'text-purple-500' },
      ]
    
      const revenueData = [
        { name: 'Jan', revenue: 4000 },
        { name: 'Feb', revenue: 3000 },
        { name: 'Mar', revenue: 5000 },
        { name: 'Apr', revenue: 4500 },
        { name: 'May', revenue: 6000 },
        { name: 'Jun', revenue: 5500 },
      ]
    
      
      const notifications = [
        { id: 1, message: 'New ticket sale for Annual Tech Conference', type: 'success' },
        { id: 2, message: 'Upcoming event: Team Building Workshop in 2 days', type: 'info' },
        { id: 3, message: 'Low ticket sales alert for Customer Appreciation Day', type: 'warning' },
      ]

      const handleLogout =() => {
        localStorage.removeItem("token");
        window.location.reload();
      }


    return(
        <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-800 border-b border-gray-600 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Organization Dashboard</h1>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex items-center p-2">
                    {notification.type === 'success' && <Ticket className="mr-2 h-4 w-4 text-green-500" />}
                    {notification.type === 'info' && <Calendar className="mr-2 h-4 w-4 text-blue-500" />}
                    {notification.type === 'warning' && <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />}
                    <span>{notification.message}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Organization Logo" />
                    <AvatarFallback>OL</AvatarFallback>
                  </Avatar>
                  <span>Badr LLC.</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white text-black">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <Card className="bg-white text-black">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />

                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Your Events</h2>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Event
            </Button>
          </div>
          <Card className="bg-white text-black">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Search events..." 
                    className="w-64"
                  />
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <Select>
                  <SelectTrigger className="w-[180px] mt-3 sm:mt-0">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Attendees</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ticket Sales</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.name}</TableCell>
                      <TableCell>{event.date}</TableCell>
                      <TableCell>{event.attendees}/{event.capacity}</TableCell>
                      <TableCell>${event.revenue.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={event.status === 'Completed' ? 'secondary' : 'default'}
                          className={
                            event.status === 'Upcoming' ? 'bg-green-500' :
                            event.status === 'Completed' ? 'bg-gray-500' :
                            'bg-amber-500'
                          }
                        >
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Progress value={(event.ticketsSold / event.capacity) * 100} className="mr-2" />
                          <span className="text-sm text-gray-600">{Math.round((event.ticketsSold / event.capacity) * 100)}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white text-black">
              <CardHeader>
                <CardTitle className="text-lg">Promote Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Boost visibility and ticket sales for your upcoming events.</p>
                <Button className="w-full">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Start Promotion
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-white text-black">
              <CardHeader>
                <CardTitle className="text-lg">Manage Team</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Add or remove team members and manage permissions.</p>
                <Button className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Team Settings
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-white text-black">
              <CardHeader>
                <CardTitle className="text-lg">Generate Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Create detailed reports for your events and financials.</p>
                <Button className="w-full">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Create Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
    )
}

export default OrganizationDashboard;