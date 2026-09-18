"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export type Event = {
  id: string;
  name: string;
  description?: string | null;
  startDate?: number | null;
  endDate?: number | null;
  timeline?: string | null;
  prizes?: string | null;
  faqs?: string | null;
  organizerContact?: string | null;
  coOrganizerContact?: string | null;
  discordLink?: string | null;
  whatsappLink?: string | null;
  googleFormLink?: string | null;
  bannerImage?: string | null;
  gallery?: string | null;
  details?: string | null;
  rules?: string | null;
  createdAt: number;
  updatedAt: number;
  location?: string | null;
  category?: string | null;
  registrationFee?: string | null;
};

interface EventContextType {
  events: Event[];
  loading: boolean;
  error: string | null;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const gyaandeepEvent: Event = {
  id: "gyaandeep-3-0",

  name: "ज्ञानदीप 3.0",

  description: `LET KNOWLEDGE ILLUMINATE THE SPIRIT OF FREEDOM. ✨

This Independence Day, Engineering India, YCCE presents ज्ञानदीप 3.0 — an exciting online quiz that brings together knowledge, curiosity, and the spirit of India! 🧠

🌟 ज्ञानदीप 3.0 | ONLINE QUIZ COMPETITION 🌟

Challenge yourself, test your knowledge, and celebrate the essence of Independence Day in an exciting way!

📅 18th August 2026
⏰ 10:00 AM onwards
💻 Online
💰 Entry Fee: ₹29/-
🏆 Prize Pool: Up to ₹1500/-
🎖️ Awards & Recognition

Think. Participate. Learn. Win!!

Let your knowledge be the light that guides you forward.

With Regards,
Engineering India, YCCE 🇮🇳`,

  startDate: new Date("2026-08-18T10:00:00").getTime(),

  endDate: new Date("2026-08-18T23:59:59").getTime(),

  location: "Online",

  category: "Quiz Competition",

  registrationFee: "29",

  bannerImage: "/gyaandeep 3.0.jpeg",

  googleFormLink:
    "https://forms.gle/jA2urQ8VVq97k8hv6",

  prizes: JSON.stringify([
    {
      position: "Prize Pool",
      description: "Prize Pool",
      value: "Up to ₹1500/-",
    },
  ]),

  createdAt: Date.now(),

  updatedAt: Date.now(),
};

export function EventProvider({ children }: { children: ReactNode }) {
  const {
    data: apiEvents = [],
    isLoading,
    error,
  } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await api.get<Event[]>("/event");
      return response.data;
    },
  });

  // Keep all previous events from the API
  // and add the new Gyaandeep event.
  const events = [
    gyaandeepEvent,
    ...apiEvents.filter((event) => event.id !== gyaandeepEvent.id),
    
  ];

  return (
    <EventContext.Provider
      value={{
        events,
        loading: isLoading,
        error: error ? error.message : null,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);

  if (!context) {
    throw new Error("useEvents must be used within an EventProvider");
  }

  return context;
}