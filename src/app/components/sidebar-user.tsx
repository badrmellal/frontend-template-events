'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LineChart, PanelLeft, Settings, Users2, PartyPopper, ArrowBigLeftDash, MonitorPlay, Ticket } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

export default function SidebarUser() {
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
              Africa Events
            </Link>
            <Link href="/user/dashboard" className={linkClass('/user/dashboard')}>
              <Home className="h-5 w-5" />
              Dashboard
            </Link>
            <Link href="/user/my-events" className={linkClass('/user/my-events')}>
              <PartyPopper className="h-5 w-5" />
              My upcoming events
            </Link>
            <Link href="/user/virtual-sessions" className={linkClass('/user/virtual-sessions')}>
              <MonitorPlay className="h-5 w-5" />
              My virtual sessions
            </Link>
            <Link href="/user/my-tickets" className={linkClass('/user/my-tickets')}>
              <Ticket className="h-5 w-5" />
              My tickets
            </Link>
            <Separator />
            <Link href="/user/settings" className={linkClass('/user/settings')}>
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
            <span className="sr-only">Africa Events</span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/user/dashboard" className={iconClass('/user/dashboard')}>
                <Home className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/user/my-events" className={iconClass('/user/my-events')}>
                <PartyPopper className="h-5 w-5" />
                <span className="sr-only">My upcoming events</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">My upcoming events</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/user/virtual-sessions" className={iconClass('/user/virtual-sessions')}>
                <MonitorPlay className="h-5 w-5" />
                <span className="sr-only">Virtual sessions</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Virtual sessions</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/user/my-tickets" className={iconClass('/user/my-tickets')}>
                <Ticket className="h-5 w-5" />
                <span className="sr-only">My tickets</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">My tickets</TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/user/settings" className={iconClass('/user/settings')}>
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