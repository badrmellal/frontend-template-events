import React from 'react';
import { Check, User, Zap, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation';

const PricingSection: React.FC = () => {
  const router = useRouter();
  const handleGetStartedClick = () => {
    router.push('/sign-up');
  }
  return (
    <section className="mb-24 py-12 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">Flexible Pricing for Individual Publishers</h2>
        <p className="text-xl text-gray-400 mb-12 text-center">Host free events at no cost, pay only when you sell tickets</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-amber-500">Free Events</CardTitle>
              <CardDescription className="text-gray-400">Perfect for community gatherings and passion projects</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white mb-4">$0</p>
              <ul className="space-y-2">
                <PricingFeature>Unlimited free event creation</PricingFeature>
                <PricingFeature>Basic event management tools</PricingFeature>
                <PricingFeature>Standard support</PricingFeature>
              </ul>
            </CardContent>
            <CardFooter>
              <Button  onClick={handleGetStartedClick} className="w-full bg-amber-500 hover:bg-amber-600 text-black">Get Started</Button>
            </CardFooter>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-amber-500">Paid Events</CardTitle>
              <CardDescription className="text-gray-400">For monetizing your events and experiences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white mb-4">
                4.9% + $0.30 <span className="text-sm font-normal">per ticket sold</span>
              </p>
              <ul className="space-y-2">
                <PricingFeature>Advanced ticketing options</PricingFeature>
                <PricingFeature>Comprehensive analytics</PricingFeature>
                <PricingFeature>Priority support</PricingFeature>
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={handleGetStartedClick} className="w-full bg-amber-500 hover:bg-amber-600 text-black">Start Selling</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="text-center mb-16">
          <h3 className="text-2xl font-semibold mb-4 text-white">No Hidden Fees. No Surprises.</h3>
          <p className="text-gray-400">Host free events at no cost. For paid events, you only pay when you sell tickets. Keep more of your earnings with our competitive rates.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ValueProposition
            icon={User}
            title="Individual-Friendly"
            description="Pricing structure designed for solo event creators and small-scale publishers."
          />
          <ValueProposition
            icon={Zap}
            title="Powerful Features"
            description="Access professional event management tools without any upfront costs or commitments."
          />
          <ValueProposition
            icon={DollarSign}
            title="Flexible Monetization"
            description="Earn from your events with competitive per-ticket fees and no monthly charges."
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