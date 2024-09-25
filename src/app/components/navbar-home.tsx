"use client"

import * as React from "react"
import Link from "next/link"
import { FaMapLocationDot, FaInstagram, FaYoutube, FaFacebook, FaLinkedin, FaChevronUp, FaChevronDown } from "react-icons/fa6";
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
import { DollarSign, FileChartColumnIncreasing, FileQuestion, HandCoins, LucideIcon, Mail, MapPin, Menu, ShieldAlert, Ticket } from "lucide-react";
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
];

interface ExpandableMenuItemProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

const ExpandableMenuItem: React.FC<ExpandableMenuItemProps> = ({ title, icon: Icon, children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 text-left text-gray-800 hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-gray-600" />
          <span className="font-medium">{title}</span>
        </div>
        <FaChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-2 bg-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
};

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
            <Link href="/docs/qrcode" legacyBehavior passHref>
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
        <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
          <nav className="h-full flex flex-col bg-white">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <Link href="/" className="flex items-center gap-2 font-semibold text-gray-800">
                <FaMapLocationDot className="h-6 w-6 text-amber-500" />
                <span className="text-lg">Africa Showtime</span>
              </Link>
            </div>
            <Link href="/events-in-my-area" className="flex items-center gap-3 px-4 py-6 text-gray-800 hover:bg-gray-50 transition-colors">
              <MapPin className="h-5 w-5 text-amber-600" /> 
              <span className="font-semibold">Events in My Area</span>
            </Link>
            <div className="flex-grow overflow-y-auto py-2">
              <ExpandableMenuItem title="Buy Tickets" icon={Ticket}>
                <Link href="/popular-events" className="block py-2 text-sm text-gray-600 hover:text-amber-500 transition-colors">Popular Events</Link>
                <Link href="/free-events" className="block py-2 text-sm text-gray-600 hover:text-amber-500 transition-colors">Free Events</Link>
                <Link href="/experiences" className="block py-2 text-sm text-gray-600 hover:text-amber-500 transition-colors">Experiences</Link>
              </ExpandableMenuItem>
              <ExpandableMenuItem title="Sell Tickets" icon={HandCoins}>
                <Link href="/docs/individuals" className="block py-2 text-sm text-gray-600 hover:text-amber-500 transition-colors">For individuals</Link>
                <Link href="/docs/organizations" className="block py-2 text-sm text-gray-600 hover:text-amber-500 transition-colors">For organizations</Link>
                <Link href="/docs/virtual-events" className="block py-2 text-sm text-gray-600 hover:text-amber-500 transition-colors">Virtual events</Link>
                <Link href="/docs/promote-event" className="block py-2 text-sm text-gray-600 hover:text-amber-500 transition-colors">Promote event</Link>
              </ExpandableMenuItem>
              <Link href="/docs/qrcode" className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-gray-50 transition-colors">
                <FileChartColumnIncreasing className="h-5 w-5 text-gray-600" />
                <span className="font-medium">QR Code Guide</span>
              </Link>
              <Link href="/faqs" className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-gray-50 transition-colors">
                <FileQuestion className="h-5 w-5 text-gray-600" />
                <span className="font-medium">FAQ&apos;s</span>
              </Link>
              <Separator className="my-2" />
              <Link href="/support" className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-gray-50 transition-colors">
                <Mail className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Contact us</span>
              </Link>
              <Link href="/privacy-policy" className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-gray-50 transition-colors">
                <ShieldAlert className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Privacy Policy</span>
              </Link>
            </div>
            <div className="mt-auto p-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Follow us</p>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-amber-500 transition-colors"
                  >
                    <social.icon className="h-6 w-6" />
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