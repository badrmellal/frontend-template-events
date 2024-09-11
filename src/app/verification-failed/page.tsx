import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import Link from 'next/link'

export default function VerificationFailed() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-cover bg-center">
      <Card className="w-full max-w-[90vw] sm:max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Verification Failed</CardTitle>
          <CardDescription className="text-center">We couldn&apos;t verify your email. The verification link may have expired.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Icons.xCircle className="h-16 w-16 text-red-500" />
        </CardContent>
        <CardFooter className="flex sm:flex-row flex-col justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/resend-verification">
            <Button variant="outline">
              Resend Verification
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