import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import axios from 'axios'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Icons } from '@/components/ui/icons'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Eye, EyeOff, Info } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountType: string;
  isOrganization: boolean;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  accountType?: string;
}

const ACCOUNT_TYPES = [
  { label: "I want to buy tickets", value: "ROLE_BASIC_USER" },
  { label: "I want to publish an event", value: "ROLE_PUBLISHER" },
]

export default function SignUp() {
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: '',
    isOrganization: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showOrganizationTooltip, setShowOrganizationTooltip] = useState(false)

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {}
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.password.length < 7 || !/^(?=.*[a-zA-Z])(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = "Password must be at least 7 characters long and contain both letters and numbers"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.accountType) {
      newErrors.accountType = "Please select an account type"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAccountTypeChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      accountType: value,
      isOrganization: value !== 'ROLE_PUBLISHER' ? false : prev.isOrganization
    }))
  }

  const handleOrganizationChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isOrganization: checked }))
  }

  const getFinalRole = () => {
    if (formData.accountType === 'ROLE_PUBLISHER' && formData.isOrganization) {
      return 'ROLE_ORGANIZATION_OWNER'
    }
    return formData.accountType
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    const finalRole = getFinalRole()
    const endpoint = "http://localhost:8080/user/register"

    try {
      const response = await axios.post(
        endpoint,
        new URLSearchParams({ 
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: finalRole
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          }
        }
      )

      if (response.status === 201) {
        toast({ 
          title: "Account created successfully!",
          description: "Please confirm your email then log in."
        })
          setTimeout(() => router.push("/login"), 2000);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status
        if (status === 409) {
          toast({ 
            title: "Registration failed",
            description: "Email or username already exists.",
            variant: "destructive"
          })
        } else {
          toast({ 
            title: "Registration failed",
            description: "An error occurred while creating your account.",
            variant: "destructive"
          })
        }
      } else {
        toast({ 
          title: "Registration failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive"
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = () => {
    // Placeholder for google sign-up logic
    console.log(`google sign-up`)
  }

  const handleAppleSignUp = () => {
    // Placeholder for apple sign-up logic
    console.log(`apple sign-up`)
  }

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row items-center justify-center bg-cover bg-center">
      <div className="w-full md:w-1/2 p-4 flex justify-center items-center">
        <Image src="/myticket-logo.png" alt="Logo africa event" width={400} height={400} className="max-w-[250px] max-h-[200px] sm:max-h-[380px] sm:max-w-[400px]" />
      </div>
      <div className="w-full md:w-1/2 p-8 flex justify-center items-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
            <CardDescription>Create an account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="italic text-xs font-extralight text-gray-500">This email will be verified. You will use it to access your tickets.</span>
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select onValueChange={handleAccountTypeChange} value={formData.accountType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACCOUNT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.accountType && <p className="text-sm text-red-500">{errors.accountType}</p>}
                </div>
                {formData.accountType === 'ROLE_PUBLISHER' && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="isOrganization"
                        className="rounded"
                        checked={formData.isOrganization}
                        onCheckedChange={handleOrganizationChange}
                      />
                      <Label htmlFor="isOrganization" className="flex items-center">
                        I am registering as an organization
                        <TooltipProvider>
                          <Tooltip open={showOrganizationTooltip} onOpenChange={setShowOrganizationTooltip}>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                className="p-0 h-auto ml-1"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setShowOrganizationTooltip(!showOrganizationTooltip)
                                }}
                              >
                                <Info className="h-4 w-4 text-gray-500" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Please select this only if you are representing an organization</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                    </div>
                  </div>
                )}
              </div>
              <Button className="w-full mt-6" type="submit" disabled={isLoading}>
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Sign Up
              </Button>
            </form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={handleGoogleSignUp} variant="outline" disabled={!formData.accountType}>
                <Icons.google className="mr-2 h-4 w-4" /> Google
              </Button>
              <Button onClick={handleAppleSignUp} variant="outline" disabled={!formData.accountType}>
                <Icons.apple className="mr-2 h-4 w-4" /> Apple
              </Button>
            </div>
            {!formData.accountType && (
              <p className="text-sm text-red-500 mt-2 text-center">
                Please select an account type to enable social sign-up options.
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-center">
            <p className="text-sm text-muted-foreground mt-4">
              Already have an account?{" "}
              <Button onClick={() => router.push("/login")} variant="ghost">
                Log in
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
