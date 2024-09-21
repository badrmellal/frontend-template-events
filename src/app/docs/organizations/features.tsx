import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Building, Users, Globe, Ticket, ShieldCheck, BarChart, Calendar, CreditCard, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  { icon: Building, title: "Multi-Event Management", description: "Manage multiple events from a single dashboard" },
  { icon: Users, title: "Team Collaboration", description: "Assign roles and permissions to team members" },
  { icon: Globe, title: "Global Reach", description: "Sell tickets worldwide with multi-currency support" },
  { icon: Ticket, title: "Advanced Ticketing", description: "Create tiered pricing and group packages" },
  { icon: ShieldCheck, title: "Enhanced Security", description: "Advanced fraud protection for high-volume sales" },
  { icon: BarChart, title: "Comprehensive Analytics", description: "In-depth insights across all your events" },
  { icon: Calendar, title: "Event Series", description: "Easily manage recurring events and conferences" },
  { icon: CreditCard, title: "Flexible Payments", description: "Support for various payment methods and invoicing" }
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="mb-16">
      <h3 className="text-2xl text-center font-semibold mb-8">Powerful Tools for Organizational Event Management</h3>
      <HoverEffect items={features} />
    </section>
  );
};

interface HoverEffectProps {
  items: FeatureItem[];
  className?: string;
}

export const HoverEffect: React.FC<HoverEffectProps> = ({
  items,
  className,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <FeatureCard
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

interface FeatureCardProps {
  item: FeatureItem;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ item, index, isHovered, onHover, onLeave }) => {
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
        <CardIcon>{<item.icon className="h-8 w-8 text-amber-500" />}</CardIcon>
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </Card>
    </motion.div>
  );
};

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children }) => {
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

interface CardComponentProps {
  className?: string;
  children: React.ReactNode;
}

export const CardIcon: React.FC<CardComponentProps> = ({ className, children }) => {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardComponentProps> = ({ className, children }) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};

export const CardDescription: React.FC<CardComponentProps> = ({ className, children }) => {
  return (
    <p
      className={cn(
        "mt-4 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};