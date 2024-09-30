import React, { useState } from 'react'
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, Globe, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FaAndroid, FaApple, FaGooglePlay } from 'react-icons/fa6'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()
  const [language, setLanguage] = useState('en')

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    console.log(`Language changed to ${value}`)
  }

  return (
    <footer className="bg-black text-white border-t border-gray-700 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">myticket.africa</h2>
            <p className="text-gray-400 mb-6">
            Revolutionizing the event industry across Africa. We connect passionate organizers with eager attendees, creating memorable experiences through innovative ticketing solutions.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Instagram, Linkedin, Youtube].map((Icon, index) => (
                <Link key={index} href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                  <Icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['About Us', 'Browse Events', 'Create Event', 'Careers', 'Blog', 'Contact Us'].map((item, index) => (
                <li key={index}>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <ArrowRight className="h-4 w-4 mr-2" />{item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Get Our App</h3>
            <p className="text-gray-400 mb-6">Experience events like never before with our mobile app.</p>
            <div className="space-y-4">
              <Link href="#" className="flex items-center max-w-[180px] bg-white text-black rounded-lg px-3 py-1 transition-transform hover:scale-105">
                <FaApple className="h-8 w-8 mr-3" />
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="text-md font-semibold">App Store</div>
                </div>
              </Link>
              <Link href="#" className="flex items-center max-w-[180px] bg-white text-black rounded-lg px-3 py-1 transition-transform hover:scale-105">
                <FaGooglePlay className="h-7 w-7 mr-3" />
                <div>
                  <div className="text-xs">Get it on</div>
                  <div className="text-md font-semibold">Google Play</div>
                </div>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Stay updated with our latest news and events.</p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-black">Subscribe</Button>
            </form>
          </div>
        </div>
        <Separator className="bg-gray-700 my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} myticket.africa All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center">
              <Globe className="h-5 w-5 mr-2 text-gray-400" />
              <Select onValueChange={handleLanguageChange} defaultValue={language}>
                <SelectTrigger className="w-[120px] bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {['Terms of Service', 'Privacy Policy', 'Cookie Policy'].map((item, index) => (
              <Link key={index} href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer