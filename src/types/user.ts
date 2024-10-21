export interface User {
    id: number;
    username: string;
    email: string;
    profileImageUrl: string;
    phoneNumber?: string;
    role: string;
    joinDate: string;
    lastLoginDate: string;
    lastLoginDateDisplay?: string | null;
    enabled: boolean;
    verificationToken?: string;
    verificationTokenExpiryDate?: string;
    countryCode: string;
    totalTickets: number;
    loyaltyPoints: number;
    bio: string;
    socialLinks: SocialLink[];
  }
  
export interface SocialLink {
platform: string;
url: string;
}

export interface Event {
  id: number;
  eventCategory: string | null;
  eventName: string;
  eventDescription: string;
  eventVideo: string | null;
  eventCurrency: string | null;
  eventManagerUsername: string | null;
  eventDate: string;
  addressLocation: string | null;
  googleMapsUrl: string | null;
  eventCreationDate: string | null;
  totalTickets: number;
  remainingTickets: number;
  eventImages: string[] | null;
  ticketTypes: any | null; // You might want to define a more specific type here
  freeEvent: boolean;
  approved: boolean;
}

export interface Ticket {
  quantity: number;
  id: string;
  fees: number;
  vat: number;
  totalAmount: number;
  ticketType: string;
  paymentStatus: "PENDING"|"COMPLETED"|"FAILED"|"REFUNDED";
  usersDto: User;
  eventsDto: Event;
  ticketActive: boolean;
  purchaseDate: Date;
}