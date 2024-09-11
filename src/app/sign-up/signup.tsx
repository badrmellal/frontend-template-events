
import { useState, useCallback, useEffect } from 'react'
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
import { Eye, EyeOff } from 'lucide-react'

export default function SignUp() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [dirty, setDirty] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const { toast } = useToast()

  const roles = [
    { label: "I want to buy tickets", value: "ROLE_BASIC_USER" },
    { label: "I want to publish an event", value: "ROLE_PUBLISHER" },
  ]

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
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match."
      }
      if (!role) {
        newErrors.role = "Please select the account type."
      }
    }
    setErrors(newErrors)
  }, [email, password, role, dirty, confirmPassword])

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
        "http://localhost:8080/user/register",
        new URLSearchParams({ username, email, password, role }),
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
        setTimeout(()=>{
          router.push("/login")
        }, 3000)
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status === 409) {
          toast({ 
            title: "Please try again!",
            description: "Email or username already exists.",
            variant: "destructive"
          })
        } else {
          toast({ 
            title: "Please try again!",
            description: "Failed to create your account.",
            variant: "destructive"
          })
        }
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = () => {
    //  Google sign-up logic later
    console.log("Google sign-up")
  }

  const handleAppleSignUp = () => {
    //  Apple sign-up logic later
    console.log("Apple sign-up")
  }

  const handleLoginClick = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row items-center justify-center bg-cover bg-center">
      <div className="w-full md:w-1/2 p-4 flex justify-center items-center">
        <Image src="/logo-with-bg.png" alt="Logo africa event" width={400} height={400} className="max-w-[250px] max-h-[200px] sm:max-h-[380px] sm:max-w-[400px]" />
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
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value)
                      setDirty(true)
                    }}
                    required
                  />
                  {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setDirty(true)
                    }}
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
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
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
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        setDirty(true)
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Account Type</Label>
                  <Select onValueChange={(value) => setRole(value)} value={role}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                </div>
              </div>
              <Button className="w-full mt-6" type="submit" disabled={isLoading || Object.keys(errors).length > 0}>
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
              <Button disabled={!role} onClick={handleGoogleSignUp} variant="outline">
                <Icons.google className="mr-2 h-4 w-4" /> Google
              </Button>
              <Button disabled={!role} onClick={handleAppleSignUp} variant="outline">
                <Icons.apple className="mr-2 h-4 w-4" /> Apple
              </Button>
            </div>
            {!role && (
              <p className="text-sm text-red-500 mt-2 text-center">
                Please select an account type to enable social sign-up options.
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-center">
            <p className="text-sm text-muted-foreground mt-4">
              Already have an account?{" "}
              <Button onClick={handleLoginClick} variant="ghost">
                Log in
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
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}
    </div>
  )
}