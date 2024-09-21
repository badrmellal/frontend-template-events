import React, { useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Zap, Globe, Ticket, ShieldCheck, QrCode, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
}

const features: Feature[] = [
  { icon: Zap, title: "Instant Setup", description: "Create and publish your event in minutes" },
  { icon: Globe, title: "Sell Anywhere in Africa", description: "Reach a global audience with multi-language support" },
  { icon: Ticket, title: "Dynamic Pricing", description: "Maximize revenue with different ticket types and prices" },
  { icon: ShieldCheck, title: "Secure Payments", description: "PCI-compliant transactions and fraud protection" },
  { icon: QrCode, title: "QR Code Check-in", description: "Scan QR codes for quick attendee check-ins using your mobile" },
  { icon: BarChart, title: "Real-time Analytics", description: "Track sales and attendance in real-time" },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="mb-16">
      <h3 className="text-2xl text-center font-semibold mb-8">Everything you need to host events and earn more</h3>
      <HoverEffect items={features} />
    </section>
  );
};

interface HoverEffectProps {
  items: Feature[];
  className?: string;
}

export const HoverEffect: React.FC<HoverEffectProps> = ({ items, className }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <AnimatedCard
          key={idx}
          item={item}
          idx={idx}
          hoveredIndex={hoveredIndex}
          setHoveredIndex={setHoveredIndex}
        />
      ))}
    </div>
  );
};

interface AnimatedCardProps {
  item: Feature;
  idx: number;
  hoveredIndex: number | null;
  setHoveredIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ item, idx, hoveredIndex, setHoveredIndex }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      className="relative group block p-2 h-full w-full"
      onMouseEnter={() => setHoveredIndex(idx)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <AnimatePresence>
        {hoveredIndex === idx && (
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
        "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};