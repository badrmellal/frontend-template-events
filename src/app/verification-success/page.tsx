import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import Link from 'next/link'

export default function VerificationSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-black bg-center">
      <Card className="w-full max-w-[90vw] sm:max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Email Verified!</CardTitle>
          <CardDescription className="text-center">Your email has been successfully verified.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Icons.checkCircle className="h-16 w-16 text-green-500" />
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/login">
            <Button>
              Proceed to Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}