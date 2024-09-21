"use client"

import * as React from "react"
import Link from "next/link"
import { FaMapLocationDot, FaInstagram, FaYoutube, FaFacebook, FaLinkedin } from "react-icons/fa6";
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { DollarSign, FileChartColumnIncreasing, FileQuestion, Mail, Menu, ShieldAlert, Ticket } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "For individuals",
    href: "/docs/individuals",
    description:
      "Selling tickets as individuals? Once we verify your identity you can start selling tickets.",
  },
  {
    title: "For organizations",
    href: "/docs/organizations",
    description:
      "Selling tickets as a registered business? Create and sell tickets to your live event.",
  },
  {
    title: "Virtual events",
    href: "/docs/virtual-events",
    description:
      "Host and sell tickets to online experiences like webinars and classes from anywhere in the world.",
  },
  {
    title: "Promote event",
    href: "/docs/promote-event",
    description: "Start promoting your event in 5 min.",
  }
]

const socialLinks = [
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FaFacebook, href: "https://facebook.com", label: "Facebook" },
  { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
  { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
]

export function NavigationMenuHome() {
  return (
    <>
      {/* Desktop Navigation */}
      <NavigationMenu className="text-black hidden lg:block">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Buy Tickets</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-black to-gray-900 p-6 no-underline outline-none focus:shadow-md"
                      href="/sign-up"
                    >
                      <FaMapLocationDot className="text-gray-500 h-7 w-7" />
                      <div className="mb-2 mt-4 text-gray-500 text-lg font-medium">
                        Discover
                      </div>
                      <p className="text-sm leading-tight text-gray-300">
                        The current events available in your area.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/popular-events" title="Popular Events">
                  Most trending events.
                </ListItem>
                <ListItem href="/free-events" title="Free Events">
                  Get all free events.
                </ListItem>
                <ListItem href="/experiences" title="Experiences">
                  Explore fun things to do.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Sell Tickets</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/qrcode" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                QR Code Guide
              </NavigationMenuLink> 
            </Link>
          </NavigationMenuItem>
         
          <NavigationMenuItem>
            <NavigationMenuTrigger>More</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                <ListItem href="/privacy-policy" title="Privacy Policy">
                  Learn about how we protect your data and privacy.
                </ListItem>
                <ListItem href="/support" title="Contact Us">
                  Get in touch with our support team for any inquiries.
                </ListItem>
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <div className="flex flex-col gap-2 select-none rounded-md p-3 no-underline outline-none transition-colors">
                      <h3 className="text-sm font-medium leading-none mb-2">Follow Us</h3>
                      <div className="flex gap-4">
                        {socialLinks.map((social) => (
                          <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-800 transition-colors"
                          >
                            <social.icon className="h-5 w-5" />
                            <span className="sr-only">{social.label}</span>
                          </a>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Stay connected with us on social media.</p>
                    </div>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
         
        </NavigationMenuList>
      </NavigationMenu>

      {/* Mobile Navigation */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 text-black lg:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <nav className="grid gap-6 py-4">
            <Link href="/" className="flex items-center gap-2 font-semibold px-2">
              <FaMapLocationDot className="h-6 w-6" />
              <span className="">Africa Showtime</span>
            </Link>
            <Link href="#" className="flex items-center gap-4 rounded-xl px-3 py-2 text-gray-500 hover:text-gray-800">
              <Ticket className="h-5 w-5" />
              Buy Tickets
            </Link>
            <Link href="#" className="flex items-center gap-4 rounded-xl px-3 py-2 text-gray-500 hover:text-gray-800">
              <DollarSign className="h-5 w-5" />
              Sell Tickets
            </Link>
            <Link href="/qrcode" className="flex items-center gap-4 rounded-xl px-3 py-2 text-gray-500 hover:text-gray-800">
              <FileChartColumnIncreasing className="h-5 w-5" />
              QR Code Guide
            </Link>
            <Link href="/faqs" className="flex items-center gap-4 rounded-xl px-3 py-2 text-gray-500 hover:text-gray-800">
              <FileQuestion className="h-5 w-5" />
              FAQ&apos;s
            </Link>
            <Separator />
            <Link href="/support" className="flex items-center gap-4 rounded-xl px-3 py-2 text-gray-500 hover:text-gray-800">
              <Mail className="h-5 w-5" />
              Contact us
            </Link>
            <Link href="/privacy-policy" className="flex items-center gap-4 rounded-xl px-3 py-2 text-gray-500 hover:text-gray-800">
              <ShieldAlert className="h-5 w-5" />
              Privacy Policy
            </Link>
            <Separator />
            <div className="flex items-center gap-4 rounded-xl px-3 py-2 text-gray-500">
              <span className="font-medium">Follow us</span>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-800"
                  >
                    <social.icon className="h-5 w-5" />
                    <span className="sr-only">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 hover:text-gray-800 focus:bg-gray-100 focus:text-gray-800",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-gray-500">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"