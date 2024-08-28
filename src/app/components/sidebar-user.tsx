'use client'

import Link from "next/link"
import { Home, LineChart, PanelLeft, Settings, Users2, PartyPopper, ArrowBigLeftDash, MonitorPlay, Ticket } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

export default function SidebarUser() {
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
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <ArrowBigLeftDash className="h-5 w-5" />
              Africa Events
            </Link>
            <Link
              href="/user/dashboard"
              className="flex items-center gap-4 text-muted-foreground hover:text-foreground"
            >
              <Home className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/user/my-events"
              className="flex items-center gap-4 text-foreground"
            >
              <PartyPopper className="h-5 w-5" />
              My upcoming events
            </Link>
            <Link
              href="/user/virtual-sessions"
              className="flex items-center gap-4 text-muted-foreground hover:text-foreground"
            >
              <MonitorPlay className="h-5 w-5" />
              My virtual sessions
            </Link>
            <Link
              href="/user/my-tickets"
              className="flex items-center gap-4 text-muted-foreground hover:text-foreground"
            >
              <Ticket className="h-5 w-5" />
              My tickets
            </Link>
            <Separator className="my-4"/>
            <Link
              href="/user/settings"
              className="flex items-center gap-4 text-muted-foreground hover:text-foreground"
            >
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
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <ArrowBigLeftDash className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Africa Events</span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/user/dashboard"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Home className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
  
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/user/my-events"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <PartyPopper className="h-5 w-5" />
                <span className="sr-only">My upcoming events</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">My upcoming events</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/user/virtual-sessions"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <MonitorPlay className="h-5 w-5" />
                <span className="sr-only">Virtual sessions</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Virtual sessions</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/user/my-tickets"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
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
              <Link
                href="/user/settings"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
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