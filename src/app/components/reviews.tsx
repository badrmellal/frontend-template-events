import Image from "next/image";
import { cn } from "../ui/cn";
import Marquee from "../ui/marquee";


const reviews = [
  {
    name: "Badr",
    username: "@pedro92",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://images.unsplash.com/photo-1697602251148-2e982bf40c5c?q=80&w=2453&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea",
  },
  {
    name: "Jihane",
    username: "@jihane11",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://images.unsplash.com/photo-1579338793787-6def1a032050?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea",
  },
  {
    name: "Chaimae",
    username: "@chaimae80",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://images.unsplash.com/photo-1702651389346-89ceec1a904d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea",
  },
  {
    name: "Sarune",
    username: "@missworld56",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://images.unsplash.com/photo-1702579450298-64d0c9f75a2d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea",
  },
  {
    name: "Ahmed",
    username: "@ahmed89",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://images.unsplash.com/photo-1464473156941-e0b49c623062?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea",
  },
  {
    name: "Sarah",
    username: "@sarah96",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://images.unsplash.com/photo-1673199952707-c630240a6db2?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea",
  },
  {
    name: "Wijdane",
    username: "@wij1996",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://images.unsplash.com/photo-1548661211-e559d8c17537?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea",
  }
];


const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Image 
        className="rounded-full" 
        width={32} 
        height={32} 
        alt="morocco party" 
        src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export function MarqueeForReviews() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-3/4 bg-gradient-to-r from-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-3/4 bg-gradient-to-l from-transparent"></div>
    </div>
  );
}
