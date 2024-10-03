
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useToast } from '@/components/ui/use-toast'
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/ui/icons"
import { Eye, EyeOff } from 'lucide-react'

export default function Invited() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const inviteCode = searchParams.get('inviteCode')
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (inviteCode) {
      validateInviteCode(inviteCode)
    }
  }, [inviteCode])

  const validateInviteCode = async (code: string) => {
    try {
      const response = await axios.get(`http://localhost:8080/user/validate-invite/${code}`)
      if (!response.data.valid) {
        toast({
          title: "Invalid Invite Code",
          description: "This invite code is not valid.",
          variant: "destructive",
        })
        router.push('/')
      }
    } catch (error) {
      console.error("Error validating invite code:", error)
      toast({
        title: "Error",
        description: "Failed to validate invite code.",
        variant: "destructive",
      })
      router.push('/')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    validateField(name, value)
  }

  const validateField = (name: string, value: string) => {
    let error = ''
    switch (name) {
      case 'email':
        if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Please enter a valid email address'
        }
        break
      case 'password':
        if (value.length < 8) {
          error = 'Password must be at least 8 characters long'
        }
        break
      case 'confirmPassword':
        if (value !== formData.password) {
          error = 'Passwords do not match'
        }
        break
    }
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (Object.values(errors).some(error => error !== '') || formData.password !== formData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form.",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    try {
      await axios.post('http://localhost:8080/user/register-invited', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        inviteCode,
      })
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Please log in.",
      })
      router.push('/login')
    } catch (error) {
      console.error("Error registering user:", error)
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Join myticket.africa</CardTitle>
          <CardDescription className="text-center">
            You have been invited to our community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              <p className="text-xs text-gray-500 italic">
                Please provide a valid email. We&apos;ll verify it.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={isLoading || Object.values(errors).some(error => error !== '')}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Register
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}