'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LineChart, PanelLeft, Settings, Users2, PartyPopper, ArrowBigLeftDash, Ticket } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

export default function SidebarPublisher() {
  const pathname = usePathname()

  const isActive = (href: string): boolean => pathname === href

  const linkClass = (href: string): string => `flex items-center gap-4 ${
    isActive(href) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
  }`

  const iconClass = (href: string): string => `flex h-9 w-9 items-center justify-center rounded-lg ${
    isActive(href) ? 'bg-gray-300' : ''
  } text-black transition-colors hover:text-gray-600 md:h-8 md:w-8`

  return (
    <TooltipProvider>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40 sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:hidden">
          <nav className="grid gap-8 text-lg font-medium">
            <Link
              href="/"
              className="flex rounded-full bg-black text-white p-2 mr-10 items-center gap-2 text-lg font-semibold"
            >
              <ArrowBigLeftDash className="h-5 w-5" />
              Home
            </Link>
            <Link href="/publisher/dashboard" className={linkClass('/publisher/dashboard')}>
              <Home className="h-5 w-5" />
              Dashboard
            </Link>
            <Link href="/publisher/my-events" className={linkClass('/publisher/my-events')}>
              <PartyPopper className="h-5 w-5" />
              My Events
            </Link>
            <Link href="/publisher/tickets" className={linkClass('/publisher/tickets')}>
              <Ticket className="h-5 w-5" />
              Tickets details
            </Link>
            <Link href="/publisher/attendees" className={linkClass('/publisher/attendees')}>
              <Users2 className="h-5 w-5" />
              Attendees
            </Link>
            <Link href="/publisher/analytics" className={linkClass('/publisher/analytics')}>
              <LineChart className="h-5 w-5" />
              Analytics 
            </Link>
            <Separator />
            <Link href="/publisher/settings" className={linkClass('/publisher/settings')}>
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <aside className="fixed bg-slate-50 inset-y-0 left-0 z-30 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 py-4">
          <Link
            href="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-black text-lg font-semibold text-white md:h-8 md:w-8 md:text-base"
          >
            <ArrowBigLeftDash className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Home</span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/publisher/dashboard" className={iconClass('/publisher/dashboard')}>
                <Home className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/publisher/my-events" className={iconClass('/publisher/my-events')}>
                <PartyPopper className="h-5 w-5" />
                <span className="sr-only">My events</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">My events</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/publisher/tickets" className={iconClass('/publisher/tickets')}>
                <Ticket className="h-5 w-5" />
                <span className="sr-only">Tickets details</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Tickets details</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/publisher/attendees" className={iconClass('/publisher/attendees')}>
                <Users2 className="h-5 w-5" />
                <span className="sr-only">Attendees</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Attendees</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/publisher/analytics" className={iconClass('/publisher/analytics')}>
                <LineChart className="h-5 w-5" />
                <span className="sr-only">Analytics</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Analytics</TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/publisher/settings" className={iconClass('/publisher/settings')}>
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
    </TooltipProvider>
  )
}