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


interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  profileImageUrl: string;
  joinDate: Date;
  lastLoginDate: Date;
}

export default function UsersDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<User["id"] | null>(null)
  const [newUser, setNewUser] = useState({ username: "", email: "", password:"", role: "" });
  const [editUser, setEditUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/user/all-users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.status === 200) {
          setUsers(response.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    console.log(editUser);
    if (editUser && editUser.id) {
        try {
            const response = await axios.put(`http://localhost:8080/user/update-role/${editUser.id}`, null, {
                params: {
                    assignedRole: editUser.role,  
                }, 
                headers: {
                   Authorization: `Bearer ${localStorage.getItem("token")}`,
               },
            }
            )
            if(response.status === 200){
                setUsers((prevUsers) => 
                prevUsers.map((user) => user.id === editUser.id ? { ...editUser} : user));
                setIsEditUserOpen(false);
                toast({
                  title: "Success",
                  description: "User role edited successfully!"
                })
            }
        } catch (error) {
            console.error("Error updating user:", error);
            toast({
              title: "Error",
              description: "Failed to update user role.",
              variant: "destructive",
            });
        }
    } else{
        toast({
            title: "Error",
              description: "Failed to recognize user.",
              variant: "destructive",
        })
        return;
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
<>
        <SidebarAdmin />
              <div className="flex justify-end pt-4 pr-4 md:pr-24">
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
                  <DropdownMenuItem><Headset className="h-4 w-4 mx-1" /> Support</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogOut}> <LogOut className="h-4 w-4 mx-1" /> Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
    <div className="w-full max-w-7xl mx-auto p-4 space-y-4 ">
     
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Users</h1>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
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
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
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
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
     
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="ROLE_ADMIN">Admin</SelectItem>
            <SelectItem value="ROLE_PUBLISHER">Publisher</SelectItem>
            <SelectItem value="ROLE_BASIC_USER">Basic User</SelectItem>
          </SelectContent>
        </Select>
        
      </div>
      <div className="hidden md:block">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Join Date</TableHead>
                <TableHead className="text-right">Last Active</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
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
                          : "secondary"
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div
                        className={`h-2 w-2 rounded-full mr-2 ${
                          user.lastLoginDate
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      {user.lastLoginDate ? "Active" : "Offline"}
                    </div>
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
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
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
                      : "secondary"
                  }
                >
                  {user.role}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Status:</span>
                <div className="flex items-center">
                  <div
                    className={`h-2 w-2 rounded-full mr-2 ${
                      user.lastLoginDate ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                  {user.lastLoginDate ? "Active" : "Offline"}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Join Date:</span>
                <span>{new Date(user.joinDate).toLocaleString()}</span>
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
                  <DropdownMenuItem className="cursor-pointer"
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
                    setDeleteUserId(user.id);
                    setIsDeleteDialogOpen(true);
                  }}
                  className="text-red-600 cursor-pointer">
                    Delete user
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredUsers.length} of {users.length} users
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>

      {/* Edit User Modal */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
</>
  );
}

