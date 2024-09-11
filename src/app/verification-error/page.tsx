import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import Link from 'next/link'

export default function VerificationError() {
  return (
    <div className="min-h-screen flex bg-black items-center justify-center bg-cover bg-center">
      <Card className="w-full max-w-[90vw] sm:max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Oops! Something went wrong</CardTitle>
          <CardDescription className="text-center">We encountered an error while trying to verify your email.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Icons.alertTriangle className="h-16 w-16 text-yellow-500" />
        </CardContent>
        <CardFooter className="flex sm:flex-row flex-col justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/resend-verification">
            <Button variant="outline">
              Try Again
            </Button>
          </Link>
          <Link href="/support">
            <Button>
              Contact Support
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}