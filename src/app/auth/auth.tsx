import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"
import React, { useCallback, useEffect, useState } from "react"
import { FaApple } from "react-icons/fa6"
import { FcGoogle } from "react-icons/fc"
import DropdownAuth from "./dropdown-auth"

const OrSeparator = () => (
  <div className="relative flex items-center my-6">
    <Separator className="flex-1 border-t ml-5 border-gray-300" />
    <span className="px-4 text-sm font-semibold text-gray-500 bg-white">
      OR
    </span>
    <Separator className="flex-1 border-t mr-5 border-gray-300" />
  </div>
);

export default function TabsAuth() {
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();
  const [usernameField, setUsernameField] = useState("");
  const [emailField, setEmailField] = useState("");
  const [passwordField, setPasswordField] = useState("");
  const [roleField, setRoleField] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [googleAppleDisabled, setGoogleAppleDisabled] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const roles = [
    { label: "I want to buy tickets", value: "ROLE_BASIC_USER" },
    { label: "I want to publish an event", value: "ROLE_PUBLISHER" },
  ];

  const validateEmail = (emailField: string) => {
    const req = /\S+@\S+\.\S+/;
    return req.test(emailField);
  };

  const handleValidation = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    const validPassword = /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(passwordField);

    if (dirty) {
      if (!validateEmail(emailField)) {
        newErrors.emailField = "Please enter a valid email address.";
      }
      if (passwordField.length < 7) {
        newErrors.passwordField = "Password must be at least 7 characters long.";
      }
      if (!validPassword) {
        newErrors.passwordField = "Password must contain both letters and numbers.";
      }
      if (!roleField) {
        newErrors.roleField = "Please select the account type.";
      }
      setErrors(newErrors);
      setDisabled(Object.keys(newErrors).length > 0);
    }
  }, [emailField, passwordField, dirty, roleField]);

  useEffect(() => {
    if (!roleField) {
      setGoogleAppleDisabled(true);
      setErrors((prevErrors) => ({
        ...prevErrors,
        roleField: "Please select the account type first.",
      }));
      return;
    }
    setGoogleAppleDisabled(false);
    setErrors((prevErrors) => {
      const { roleField, ...rest } = prevErrors;
      return rest;
    });
  }, [roleField]);

  useEffect(() => {
    handleValidation();
  }, [handleValidation]);

  const handlePasswordChange = (e: any) => {
    setPasswordField(e.target.value);
    validatePassword(e.target.value, confirmPass)
  }
  const handleConfirmPasswordChange = (e: any) =>{
    setConfirmPass(e.target.value);
    validatePassword(passwordField, e.target.value)
  }
  const validatePassword = (pass: string, confirmPass: string) =>{
    if(pass != confirmPass){
      setPasswordError("Passwords didn't match.")
    } else{
      setPasswordError('');
    }
  }

  const handleSubmitSignup = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/user/register",
        new URLSearchParams({ usernameField, emailField, passwordField, roleField }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          }
        }
      );

      if (response.status === 201) {
        setUsernameField("");
        setEmailField("");
        setPasswordField("");
        setRoleField("");
        toast({ 
          title: "Login to continue!",
        })
        router.push("/login");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        let errorMessage = "Failed to create account! Please try again.";

        if (status === 409) {
          errorMessage = err.response?.data || "Email or username already exist! Please try again.";
          toast({
            variant: "destructive",
            title: "Email or username already exist!",
            description: "Please try again."
          })
        }
        toast({
          variant: "destructive",
          title: "Failed to create account!",
          description: "Please try again."
        })

      } else {
        toast({
          variant: "destructive",
          title: "An unexpected error occurred!",
          description: "Please try again."
        })
      }
    }
  };


  return (
    <Tabs defaultValue="sign-up" className="sm:w-[400px] w-[300px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="sign-up">Sign-up</TabsTrigger>
        <TabsTrigger value="login">Login</TabsTrigger>
      </TabsList>
      <TabsContent value="sign-up">
        <Card onSubmit={handleSubmitSignup}>
          <CardHeader>
            <CardTitle>Sign-up</CardTitle>
            <CardDescription>
              Create a new account to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
          
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={usernameField} onChange={(e)=> setUsernameField(e.target.value)} defaultValue="@badrmel" type="text" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={emailField} onChange={(e)=> setEmailField(e.target.value)} defaultValue="example@email.com" type="email" required />
            </div>
            {errors.emailField && <p className="text-red-500 text-sm">{errors.emailField}</p>}
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={passwordField} onChange={handlePasswordChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="passwordconfirm">Confirm password</Label>
              <Input id="passwordconfirm" type="password" required value={confirmPass} onChange={handleConfirmPasswordChange} />
            </div>
            {errors.passwordField && <p className="text-red-500 text-sm">{errors.passwordField}</p>}
            {passwordError && <span className="mt-2 text-red-500 text-sm">{passwordError}</span>}
            <div className="py-6">
            <label className="block text-gray-700 font-montserrat text-sm font-semibold mb-2" htmlFor="role">
              Choose account type
            </label>
            <DropdownAuth
              options={roles}
              selectedValue={roleField}
              onChange={(value) => setRoleField(value)}
            />
            {errors.roleField && <p className="text-red-500 mt-1 text-sm">{errors.roleField}</p>}
          </div>
            <div className="pt-3">
            <div className="items-top flex space-x-2">
              <Checkbox className="rounded" required id="terms1" />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms1"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Accept terms and conditions
                </label>
                <p className="text-sm text-gray-500 text-muted-foreground">
                  By signing up you agree on our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
            </div>
           
          </CardContent>
          <CardFooter className="flex justify-end space-x-3">
            <Button variant="secondary">Cancel</Button>
            <Button type="submit"
             className={`${passwordError !== '' ? "bg-gray-300 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-700"}`}
             disabled={passwordError !== ''}
            >
            Submit
            </Button>
          </CardFooter>
          <OrSeparator />
          <div className="flex items-center justify-center">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15, ease:"easeInOut"}}
              className="w-full max-w-[260px] mt-3 bg-transparent text-black border border-black hover:bg-black hover:text-white font-bold font-montserrat py-2 px-4 rounded-md shadow-md transition duration-150 ease-in-out"
            >
              <div className="flex justify-center items-center">
                <FcGoogle className="h-6 w-6 mx-4" />
                Sign up with Google
              </div>
            </motion.button>
          </div>
          <div className="flex mb-6 justify-center items-center">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15, ease:"easeInOut"}}
              className="w-full max-w-[260px] my-3 bg-transparent text-black border border-black hover:bg-black hover:text-white font-bold font-montserrat py-2 px-4 rounded-md shadow-md transition duration-150 ease-in-out"
            >
              <div className="flex justify-center items-center">
                <FaApple className="h-6 w-6 mx-4" />
                Sign up with Apple
              </div>
            </motion.button>
          </div>
        </Card>
      </TabsContent>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Login to your account here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
          <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue="example@email.com" type="email" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" defaultValue="" type="password" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-3">
            <Button variant="secondary">Cancel</Button>
            <Button>Submit</Button>
          </CardFooter>
        
            <OrSeparator />
            <div className="flex items-center justify-center">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15, ease:"easeInOut"}}
              className="w-full max-w-[260px] mt-3 bg-transparent text-black border border-black hover:bg-black hover:text-white font-bold font-montserrat py-2 px-4 rounded-md shadow-md transition duration-150 ease-in-out"
            >
              <div className="flex justify-center items-center">
                <FcGoogle className="h-6 w-6 mx-4" />
                Login with Google
              </div>
            </motion.button>
          </div>
          <div className="flex justify-center mb-6 items-center">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15, ease:"easeInOut"}}
              className="w-full max-w-[260px] my-3 bg-transparent text-black border border-black hover:bg-black hover:text-white font-bold font-montserrat py-2 px-4 rounded-md shadow-md transition duration-150 ease-in-out"
            >
              <div className="flex justify-center items-center">
                <FaApple className="h-6 w-6 mx-4" />
                Login with Apple
              </div>
            </motion.button>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
