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