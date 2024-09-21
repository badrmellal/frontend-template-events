import React, { useState, useRef } from 'react';
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Music, Cpu, Users, MapPin, DollarSign, TicketIcon, Utensils, GraduationCap, Palette, ShoppingBag, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";
import { IoMdPricetags } from 'react-icons/io';

const successStories = [
    { 
      icon: Music, 
      title: "Afrobeats Fusion Festival", 
      description: "A two-day music festival showcasing emerging Afrobeats artists, attracting fans from across West Africa.",
      income: "$15,000",
      location: "Lagos, Nigeria"
    },
    { 
      icon: Utensils, 
      title: "Moroccan Culinary Workshop", 
      description: "A series of hands-on cooking classes featuring traditional Moroccan dishes, led by local chefs.",
      income: "$3,800",
      location: "Marrakech, Morocco"
    },
    { 
      icon: GraduationCap, 
      title: "Tech Skills Bootcamp", 
      description: "An intensive weekend coding workshop for young professionals, focusing on web development and data science.",
      income: "$7,200",
      location: "Nairobi, Kenya"
    },
    { 
      icon: Palette, 
      title: "Contemporary African Art Fair", 
      description: "A three-day exhibition showcasing works from emerging artists across the continent, connecting them with international collectors.",
      income: "$22,500",
      location: "Cape Town, South Africa"
    },
    { 
      icon: ShoppingBag, 
      title: "Pan-African Fashion Week", 
      description: "A week-long event featuring runway shows, pop-up shops, and networking sessions for African fashion designers and enthusiasts.",
      income: "$18,000",
      location: "Accra, Ghana"
    },
    { 
      icon: Dumbbell, 
      title: "Saharan Desert Marathon", 
      description: "An annual ultra-marathon event through the Sahara, attracting international athletes and adventure seekers.",
      income: "$8,000",
      location: "Zagora, Morocco"
    }
];

export const SuccessStoriesSection: React.FC = () => {
  return (
    <section className="mb-16">
      <h3 className="text-3xl font-semibold mb-8 text-center">Proud Of Our Success Stories</h3>
      <HoverEffect items={successStories} />
    </section>
  );
};

interface SuccessStory {
  icon: React.ElementType;
  title: string;
  description: string;
  income: string;
  location: string;
}

interface HoverEffectProps {
  items: SuccessStory[];
  className?: string;
}

export const HoverEffect: React.FC<HoverEffectProps> = ({ items, className }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
    >
      {items.map((item, idx) => (
        <StoryCard
          key={idx}
          item={item}
          index={idx}
          isHovered={hoveredIndex === idx}
          onHover={() => setHoveredIndex(idx)}
          onLeave={() => setHoveredIndex(null)}
        />
      ))}
    </div>
  );
};

interface StoryCardProps {
  item: SuccessStory;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ item, index, isHovered, onHover, onLeave }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative group block p-2 h-full w-full"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.span
            className="absolute inset-0 h-full w-full bg-amber-500/[0.8] block rounded-3xl"
            layoutId="hoverBackground"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.15 },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.15, delay: 0.2 },
            }}
          />
        )}
      </AnimatePresence>
      <Card>
        <CardIcon>{<item.icon className="h-12 w-12 text-amber-500" />}</CardIcon>
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
        <CardDetails>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-amber-500 mr-2" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center">
            <IoMdPricetags className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-green-500 font-semibold">{item.income}</span>
          </div>
        </CardDetails>
      </Card>
    </motion.div>
  );
};

const Card: React.FC<{className?: string; children: React.ReactNode}> = ({className, children}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-gray-800 border border-transparent dark:border-white/[0.2] group-hover:border-amber-500/50 relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

const CardIcon: React.FC<{className?: string; children: React.ReactNode}> = ({className, children}) => {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
};

const CardTitle: React.FC<{className?: string; children: React.ReactNode}> = ({className, children}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide text-xl mb-2", className)}>
      {children}
    </h4>
  );
};

const CardDescription: React.FC<{className?: string; children: React.ReactNode}> = ({className, children}) => {
  return (
    <p className={cn("text-zinc-400 tracking-wide leading-relaxed text-sm mb-4", className)}>
      {children}
    </p>
  );
};

const CardDetails: React.FC<{className?: string; children: React.ReactNode}> = ({className, children}) => {
  return (
    <div className={cn("flex justify-between items-center text-sm text-zinc-300", className)}>
      {children}
    </div>
  );
};