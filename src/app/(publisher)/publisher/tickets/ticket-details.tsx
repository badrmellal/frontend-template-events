
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  EllipsisVerticalIcon,
  MoreVertical,
  Truck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Ticket } from "@/types/user"
import { formatDate } from "date-fns"



interface TicketDetailsProps {
    ticket: Ticket | null
  }
  
  export default function TicketDetails({ ticket }: TicketDetailsProps) {
    if (!ticket) return null
  return (
    <Card className="flex flex-col h-[calc(100vh-2rem)] max-h-[800px]">
    <CardHeader className="flex-shrink-0 flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Ticket {ticket.id}
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Copy className="h-3 w-3" />
              <span className="sr-only">Copy Ticket ID</span>
            </Button>
          </CardTitle>
          <CardDescription>Date: {formatDate(ticket.purchaseDate,
                            "dd MMM yyyy, HH:mm"
          )}</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <MoreVertical className="h-3.5 w-3.5" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Contact</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <ScrollArea className="flex-grow">
      <CardContent className="flex-grow overflow-y-auto p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Order Details</div>
          <ul className="grid gap-3">
          <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {ticket.eventsDto.eventName} <span>1</span>
              </span>
              <span>$150.00</span> {/* Later should add a price field to the Ticket interface */}
            </li>
            <li className="flex items-center justify-between">
            <span className="text-muted-foreground">
                {ticket.ticketType}
              </span>
              <span>$4.00</span>
            </li>
          </ul>
          <Separator className="my-2" />
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>$154.00</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Our Fees</span>
              <span>$1.50</span>
            </li>
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Total</span>
              <span>$155.50</span>
            </li>
          </ul>
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-2 gap-4">
         
          <div className="grid auto-rows-max gap-3">
            <div className="font-semibold">Billing Information</div>
            <div className="text-muted-foreground">
            <address className="grid gap-0.5 not-italic text-muted-foreground">
            <span>{ticket.usersDto.username}</span>
              <span>23 Main St.</span>
              <span>London, UK 12B39</span>
            </address>
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Customer Information</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Customer</dt>
              <dd>{ticket.usersDto.username}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd>
                <a href={`mailto:${ticket.usersDto.email}`}>{ticket.usersDto.email}</a>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Phone</dt>
              <dd>
                <a href="tel:">+44 234 567 890</a>
              </dd>
            </div>
          </dl>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Payment Information</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-1 text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                Visa
              </dt>
              <dd>**** **** **** 4532</dd>
            </div>
          </dl>
        </div>
      </CardContent>
      </ScrollArea>
      <CardFooter className="flex-shrink-0 flex flex-row items-center border-t bg-muted/50 mb-16 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Updated <time dateTime={formatDate(ticket.purchaseDate,
                            "dd MMM yyyy, HH:mm"
                        )}>{formatDate(ticket.purchaseDate,
                          "dd MMM yyyy, HH:mm"
                      )}</time>
        </div>
      </CardFooter>
    </Card>
  )
}
