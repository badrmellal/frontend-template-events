"use client"

import * as React from "react"
import Link from "next/link"
import { FaMapLocationDot } from "react-icons/fa6";
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


const components: { title: string; href: string; description: string }[] = [
  {
    title: "For individuals",
    href: "/home/individuals",
    description:
      "Selling tickets as individuals? Once we verify your identity you can start selling tickets.",
  },
  {
    title: "For organizations",
    href: "/home/organizations",
    description:
      "Selling tickets as a registered business? Create and sell tickets to your live event.",
  },
  {
    title: "Virtual events",
    href: "/home/virtual-events",
    description:
      "Host and sell tickets to online experiences like webinars and classes from anywhere in the world.",
  },
  {
    title: "Promote event",
    href: "/home/promote-event",
    description: "Start promoting your event in 5 min.",
  }
]

export function NavigationMenuHome() {

  return (
    <NavigationMenu className="text-black hidden lg:block">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Buy Tickets</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/sign-up"
                  >
                    <FaMapLocationDot className="text-black h-7 w-7" />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Discover
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
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
          <Link href="/pricing" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Pricing
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/faqs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              FAQ&apos;s
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>

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
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
