import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown, Headset, LogOut, MoreHorizontal, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import SidebarAdmin from "@/app/components/sidebar-admin";
import Footer from "@/app/components/footer";
import { africanCountries } from "@/app/api/currency/route";


interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  profileImageUrl: string;
  joinDate: Date;
  lastLoginDate: Date;
  enabled: boolean;
  countryCode: string | null;
  phoneNumber: string | null;

}

// TODO: filter users by roles

export default function UsersDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<User["id"] | null>(null)
  const [newUser, setNewUser] = useState({ username: "", email: "", password:"", role: "" });
  const [editUser, setEditUser] = useState<User | null>(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/user/all-users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error("Unexpected data structure:", response.data);
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    };
  
    fetchUsers();
  }, []);

  const filteredUsers = Array.isArray(users) 
  ? users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (roleFilter === 'all' || user.role === roleFilter)
    )
  : [];

  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter]);

  //current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // to change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    // request to backend endpoint to add a new user
    try {
      const response = await axios.post("http://localhost:8080/user/register", null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        params: {
          email: newUser.email,
          username: newUser.username,
          password: newUser.password,
          role: newUser.role
        }
      });
      if(response.status === 201){
        console.log("new user has been created.");
        toast({
          title: "Success",
          description: "User created successfully."
        })
      } else {
        toast({
          title: "Error",
          description: "Unexpected error occurred.",
          variant: "destructive"
        })
      }
    } catch (error: any) {
      if(error.response && error.response.status === 409){
        toast({
          title: "Error",
          description: "Email or username already exists.",
          variant: "destructive"
        })
      } else{
        toast({
          title: "Error",
          description: "During registration: ", 
          onError: error,
          variant: "destructive"
        })
      }
    }
    setIsAddUserOpen(false);
    setNewUser({ username: "", email: "", password: "", role: "" });
  };


  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (editUser && editUser.id) {
      try {
        const response = await axios.put(`http://localhost:8080/user/update-role/${editUser.id}`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            assignedRole: editUser.role,
            phoneNumber: editUser.phoneNumber,
            countryCode: editUser.countryCode,
            enabled: editUser.enabled
          },
        });

        if (response.status === 200) {
          setUsers((prevUsers) =>
            prevUsers.map((user) => user.id === editUser.id ? { ...editUser } : user)
          );
          setIsEditUserOpen(false);
          toast({
            title: "Success",
            description: "User updated successfully!"
          });
        }
      } catch (error) {
        console.error("Error updating user:", error);
        toast({
          title: "Error",
          description: "Failed to update user.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Failed to recognize user.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async(e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if(deleteUserId){
      const response = await axios.delete(`http://localhost:8080/user/delete/${deleteUserId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })
      if(response.status === 200){
        setUsers((prevUsers)=> prevUsers.filter((user) => user.id != deleteUserId));
        toast({
          title: "Success",
          description: "User deleted successfully"
        })
        setIsDeleteDialogOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: "Somthing went wong",
          description: "Please try again later"
        })
      }
    } else {
      toast({
        variant: "destructive",
        title: "Can't find user id",
        description: "Please contact the dev team."
      })
      return;
    }
  }

  const handleLogOut = () => {
    localStorage.removeItem("token");
    window.location.reload();
}

  return (
<div className="w-full bg-black sm:pl-14 ml-0 min-h-screen">
        <SidebarAdmin />
              <div className="flex justify-end pt-4 pr-4 md:pr-6">
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
    <div className="w-full max-w-7xl mx-auto p-4 mb-6 space-y-4 ">
     
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-100">User Management</h1>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="hover:text-black hover:bg-white">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-md max-w-[325px] sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Enter the details of the new user here. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddUser}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ROLE_ADMIN">Admin</SelectItem>
                      <SelectItem value="ROLE_PUBLISHER">Publisher</SelectItem>
                      <SelectItem value="ROLE_BASIC_USER">Basic user</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
   
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative text-black bg-white rounded-md w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 " />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
     
         <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="ROLE_ADMIN">Admin</SelectItem>
                <SelectItem value="ROLE_PUBLISHER">Publisher</SelectItem>
                <SelectItem value="ROLE_ORGANIZATION_OWNER">Organization Owner</SelectItem>
                <SelectItem value="ROLE_BASIC_USER">Basic User</SelectItem>
              </SelectContent>
            </Select>
        
      </div>
      <div className="hidden md:block">
        <div className="rounded-lg mt-10 border">
          <Table className="bg-white rounded-md">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-center">Join Date</TableHead>
                <TableHead className="text-right">Last Active</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {Array.isArray(currentUsers) && currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={user.profileImageUrl} alt={user.username} />
                        <AvatarFallback>
                          {user.username.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{user.username}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === "ROLE_ADMIN"
                          ? "destructive"
                          : user.role === "ROLE_PUBLISHER"
                          ? "default"
                          : user.role === "ROLE_ORGANIZATION_OWNER"
                          ? "outline"
                          : "secondary"
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                 
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-2 ${user.enabled ? 'bg-green-500' : 'bg-red-500'}`} />
                      {user.enabled ? 'Active' : 'Inactive'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.phoneNumber && user.countryCode
                      ? `${user.countryCode} ${user.phoneNumber}`
                      : 'Not provided'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div
                        className="h-2 w-2 rounded-full mr-2"
                      />
                      {new Date(user.joinDate).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {new Date(user.lastLoginDate).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditUser(user);
                            setIsEditUserOpen(true);
                          }}
                        >
                          Edit user
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                        onClick={()=> {
                          setIsDeleteDialogOpen(true);
                          setDeleteUserId(user.id);
                        }} 
                        className="text-red-600">
                          Delete user
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
               ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>



      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={user.profileImageUrl} alt={user.username} />
                  <AvatarFallback>
                    {user.username.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div>{user.username}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">Role:</span>
                <Badge
                  variant={
                    user.role === "ROLE_ADMIN"
                      ? "destructive"
                      : user.role === "ROLE_PUBLISHER"
                      ? "default"
                      : user.role === "ROLE_ORGANIZATION_OWNER"
                      ? "outline"
                      : "secondary"
                  }
                >
                  {user.role.replace('ROLE_', '')}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Status:</span>
                <div className="flex items-center">
                  <div
                    className={`h-2 w-2 rounded-full mr-2 ${
                      user.enabled ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  {user.enabled ? "Active" : "Inactive"}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Country:</span>
                <span>{africanCountries.find(c => c.code === user.countryCode)?.name || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Phone:</span>
                <span>{user.phoneNumber || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Join Date:</span>
                <span>{new Date(user.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Last Active:</span>
                <span>{new Date(user.lastLoginDate).toLocaleString()}</span>
              </div>
            </CardContent>
            <CardFooter>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Actions
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-full">
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => {
                      setEditUser(user);
                      setIsEditUserOpen(true);
                    }}
                  >
                    Edit user
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem  
                    onClick={() => {
                      setDeleteUserId(user.id);
                      setIsDeleteDialogOpen(true);
                    }}
                    className="text-red-600 cursor-pointer"
                  >
                    Delete user
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
        </p>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
          >
            Next
          </Button>
        </div>
      </div>



      {/* Edit User Modal */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[425px] max-w-[90vw] rounded-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the details of the user here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          {editUser && (
            <form onSubmit={handleEditUser}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    disabled
                    id="username"
                    value={editUser.username}
                    onChange={(e) =>
                      setEditUser({ ...editUser, username: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    disabled
                    id="email"
                    type="email"
                    value={editUser.email}
                    onChange={(e) =>
                      setEditUser({ ...editUser, email: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-country-code" className="text-right">
                  Country
                </Label>
                <Select
                  value={editUser.countryCode || ''}
                  onValueChange={(value) => setEditUser({ ...editUser, countryCode: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {africanCountries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name} ({country.dial_code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-phone" className="text-right">
                      Phone
                    </Label>
                    <Input
                      id="edit-phone"
                      value={editUser.phoneNumber || ''}
                      onChange={(e) => setEditUser({ ...editUser, phoneNumber: e.target.value })}
                      className="col-span-3"
                      placeholder="Enter phone number"
                    />
                  </div>
                 
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select
                    value={editUser.role}
                    onValueChange={(value) =>
                      setEditUser({ ...editUser, role: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ROLE_ADMIN">Admin</SelectItem>
                      <SelectItem value="ROLE_PUBLISHER">Publisher</SelectItem>
                      <SelectItem value="ROLE_BASIC_USER">Basic user</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-status" className="text-right">
                      Status
                    </Label>
                    <Select
                      value={editUser.enabled ? 'active' : 'inactive'}
                      onValueChange={(value) => setEditUser({ ...editUser, enabled: value === 'active' })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* delete user dialog */}
      <AlertDialog open={isDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this account
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={()=> setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md" onClick={handleDeleteUser}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
    <Footer />
</div>
  );
}

