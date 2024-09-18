'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { JwtPayload, jwtDecode } from 'jwt-decode'
import axios from 'axios'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Icons } from '@/components/ui/icons'
import { Eye, EyeOff } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface CustomJwtPayload extends JwtPayload {
  authorities: string[]
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [dirty, setDirty] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const {toast} = useToast();

  const validateEmail = (email: string) => {
    const regex = /\S+@\S+\.\S+/
    return regex.test(email)
  }

  const handleValidation = useCallback(() => {
    const newErrors: { [key: string]: string } = {}
    const validPassword = /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)

    if (dirty) {
      if (!validateEmail(email)) {
        newErrors.email = "Please enter a valid email address."
      }
      if (password.length < 7) {
        newErrors.password = "Password must be at least 7 characters long."
      }
      if (!validPassword) {
        newErrors.password = "Password must contain both letters and numbers."
      }
    }
    setErrors(newErrors)
  }, [email, password, dirty])

  useEffect(() => {
    handleValidation()
  }, [handleValidation])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setDirty(true)
    handleValidation()

    if (Object.keys(errors).length > 0) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.post(
        "http://localhost:8080/user/login",
        new URLSearchParams({ email, password }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )

      if (response.status === 200) {
        localStorage.setItem("token", response.data)
        const decodedToken = jwtDecode<CustomJwtPayload>(response.data)
        const userAuthorities = decodedToken.authorities

        const redirectPath = localStorage.getItem('redirectAfterLogin');
        localStorage.removeItem('redirectAfterLogin');

        if (userAuthorities.includes("user:delete")) {
          router.push("/admin/dashboard")
        } else if (userAuthorities.includes("event:create") && userAuthorities.includes("event:update")) {
          router.push(redirectPath || "/publisher/dashboard");
        } else if (userAuthorities.includes("user:read") && userAuthorities.includes("event:read")) {
          router.push(redirectPath || "/user/dashboard");
        } else {
          router.push("/access-denied")
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError("Invalid email or password!")
        } else if (err.response?.status === 403) {
          toast({
            title: "Please verify your email",
            description: "Check your inbox for a verification link.",
            variant: "destructive"
          })
        } else {
          toast({
            title: "Failed to log in.",
            description: "Please try again later!",
            variant: "destructive"
          })
        }
      } else {
        setError("An internal server error occurred. Please try again later.")
      }
    } finally {
      setIsLoading(false)
    }
  }


  const handleSignupClick = () => {
    router.push("/sign-up");
  }

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row items-center justify-center bg-cover bg-center">
      <div className="w-full md:w-1/2 p-4 flex justify-center items-center">
        <Image src="/logo-with-bg.png" alt="Logo africa event" width={400} height={400} className="max-w-[250px] max-h-[200px] sm:max-h-[380px] sm:max-w-[400px]" />
      </div>
      <div className="w-full md:w-1/2 p-8 flex justify-center items-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>Enter your email and password to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setDirty(true)
                    }}
                    required
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <div className="relative">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setDirty(true)
                    }}
                    required
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 pt-6 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                    </div>
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>
              </div>
              <Button className="w-full mt-6" type="submit" disabled={isLoading || Object.keys(errors).length > 0}>
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
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
              <Button variant="outline">
                <Icons.google className="mr-2 h-4 w-4" /> Google
              </Button>
              <Button variant="outline">
                <Icons.apple className="mr-2 h-4 w-4" /> Apple
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center">
            <p className="text-sm text-muted-foreground mt-4">
              Don&apos;t have an account?{" "}
              <Button onClick={handleSignupClick} variant="ghost">
                Sign up
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4"
        >
          <Alert className="bg-red-600 text-white" variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}
    </div>
  )
}