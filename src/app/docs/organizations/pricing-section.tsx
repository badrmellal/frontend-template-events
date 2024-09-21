import React from 'react';
import { Check, Tag, Calendar, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const PricingSection: React.FC = () => {
  return (
    <section className="mb-24 py-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">Why Choose ShowtimeAfrica for Your Organization</h2>
        <p className="text-xl text-gray-400 mb-12 text-center">Competitive pricing with unmatched value for African events</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-amber-500">Free Events</CardTitle>
              <CardDescription className="text-gray-400">Perfect for community gatherings and non-profit events</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white mb-4">$0</p>
              <ul className="space-y-2">
                <PricingFeature>Create and publish events for free</PricingFeature>
                <PricingFeature>Basic event management tools</PricingFeature>
                <PricingFeature>Unlimited free ticket types</PricingFeature>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black">Get Started</Button>
            </CardFooter>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-amber-500">Paid Events</CardTitle>
              <CardDescription className="text-gray-400">For professional events and ticketed gatherings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white mb-4">
                3.5% + $0.30 <span className="text-sm font-normal">per ticket sold</span>
              </p>
              <ul className="space-y-2">
                <PricingFeature>Advanced ticketing options</PricingFeature>
                <PricingFeature>Comprehensive analytics</PricingFeature>
                <PricingFeature>Priority support</PricingFeature>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black">Start Selling</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="text-center mb-16">
          <h3 className="text-2xl font-semibold mb-4 text-white">No Hidden Fees. No Surprises.</h3>
          <p className="text-gray-400">We only charge when you sell tickets. Keep more of your earnings with our competitive rates.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ValueProposition
            icon={Tag}
            title="Competitive Pricing"
            description="Our fees are among the lowest in the industry, ensuring you maximize your event revenue."
          />
          <ValueProposition
            icon={Calendar}
            title="Flexible Event Creation"
            description="Create and manage multiple events, from free community gatherings to large-scale paid conferences."
          />
          <ValueProposition
            icon={DollarSign}
            title="Transparent Fees"
            description="No hidden charges. Pay only when you sell tickets, with clear and upfront pricing."
          />
        </div>
      </div>
    </section>
  );
};

const PricingFeature: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-center text-gray-300">
    <Check className="h-5 w-5 text-green-500 mr-2" />
    {children}
  </li>
);

const ValueProposition: React.FC<{ icon: React.ElementType; title: string; description: string }> = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center text-center">
    <Icon className="h-12 w-12 text-amber-500 mb-4" />
    <h4 className="text-xl font-semibold mb-2 text-white">{title}</h4>
    <p className="text-gray-400">{description}</p>
  </div>
);

export default PricingSection;