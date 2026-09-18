"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { useEvents } from "@/context/eventContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Clock,
  Trophy,
  Share2,
  Award,
  Target,
  Zap,
  ArrowLeft,
  ImageIcon,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
// import { FloatingCloud } from "@/components/landing/FloatingCloud"; // Ensure this component exists or keep it commented if unused

interface Prize {
  position: string;
  description: string;
  amount?: string;
  value?: string;
}

interface TimelineItem {
  time: string;
  activity: string;
  location?: string;
  description?: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface GalleryItem {
  src: string;
  alt?: string;
}

export default function EventPage() {
  const router = useRouter();
  const params = useParams();
  const { events, loading } = useEvents();
  const [activeTab, setActiveTab] = useState("about");

  // FIX: Normalize slug to ensure it is a string, even if useParams returns an array
  const eventId = useMemo(() => {
    const rawSlug = params?.slug;
    if (Array.isArray(rawSlug)) return rawSlug[0];
    return rawSlug;
  }, [params?.slug]);

  // FIX: Compare normalized eventId with event.id
  const event = events.find((ev) => ev.id === eventId);

  const parseJsonField = <T,>(
    jsonString: string | null | undefined,
    defaultValue: T,
  ): T => {
    try {
      return jsonString ? (JSON.parse(jsonString) as T) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };

  const parsedPrizes = parseJsonField<Prize[]>(event?.prizes, []);
  const parsedFaqs = parseJsonField<FAQ[]>(event?.faqs, []);
  const parsedTimeline = parseJsonField<TimelineItem[]>(event?.timeline, []);
  const parsedGallery = parseJsonField<GalleryItem[]>(event?.gallery, []);

  const getDaysUntil = () => {
    if (!event?.startDate) return null;
    const diff = new Date(event.startDate).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : null;
  };

  const daysUntilEvent = getDaysUntil();

  const isEventEnded = () => {
    if (!event?.endDate) return false;
    return new Date(event.endDate).getTime() < new Date().getTime();
  };

  const eventEnded = isEventEnded();

  const handleShare = async () => {
    const shareData = {
      title: event?.name || "Event",
      text: `Check out this event: ${event?.name}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const handleRegister = () => {
  if (event?.googleFormLink) {
    window.open(event.googleFormLink, "_blank");
  } else {
    alert("Registration form is not available yet.");
  }
};

  if (loading || !event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F1B40]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#D4EBFF] border-t-transparent"></div>
          <p className="font-sans text-white/50">Loading event details...</p>
        </div>
      </div>
    );
  }

  const tabItems = [
    { id: "about", label: "About", icon: Target, show: true },
    {
      id: "prizes",
      label: "Prizes",
      icon: Trophy,
      show: parsedPrizes.length > 0,
    },
    {
      id: "timeline",
      label: "Timeline",
      icon: Calendar,
      show: parsedTimeline.length > 0,
    },
    {
      id: "gallery",
      label: "Gallery",
      icon: ImageIcon,
      show: parsedGallery.length > 0,
    },
    { id: "faq", label: "FAQs", icon: Zap, show: parsedFaqs.length > 0 },
  ].filter((tab) => tab.show);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0F1B40] pb-24 text-white">
      {/* Hero Section */}
      <section className="relative z-10 flex min-h-[60vh] flex-col items-center justify-center bg-gradient-to-b from-[#6183B1] via-[#4A6B9D] to-[#0F1B40] px-4 pb-20 pt-32 text-center">
        {/* Back Button */}
        <div className="container mx-auto mb-12 max-w-7xl px-4 text-left">
          <Button
            variant="default" // Changed from "premium" to "default" as premium might not exist in ui/button
            size="sm"
            onClick={() => router.back()}
            className="bg-white/10 backdrop-blur-md hover:bg-white/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto max-w-7xl px-4"
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6 text-left">
              <Badge className="border-[#D4EBFF]/30 bg-[#D4EBFF]/20 px-4 py-1 text-sm font-medium text-[#D4EBFF] backdrop-blur-sm">
                {event.category || "Featured Event"}
              </Badge>
              <h1 className="font-fraunces text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
                {event.name}
              </h1>

              <div className="flex flex-wrap gap-6 text-white/80">
                {event.startDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#D4EBFF]" />
                    <span className="font-sans font-medium">
                      {format(new Date(event.startDate), "MMM dd, yyyy")}
                    </span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#D4EBFF]" />
                    <span className="font-sans font-medium">
                      {event.location}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {event.bannerImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative aspect-video w-full overflow-hidden rounded-[32px] border border-white/20 shadow-2xl"
              >
                <Image
                  src={event.bannerImage}
                  alt={event.name}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Content Section */}
      <section className="relative z-20 -mt-10 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left/Middle Column (Tabs) */}
            <div className="space-y-8 lg:col-span-2">
              <div className="overflow-hidden rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-xl">
                {/* Tabs Hub */}
                <div className="scrollbar-none flex overflow-x-auto border-b border-white/10 p-2">
                  {tabItems.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "flex items-center gap-2 whitespace-nowrap rounded-full px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-300",
                          isActive
                            ? "bg-[#D4EBFF] text-[#0F1B40] shadow-lg"
                            : "text-white/60 hover:bg-white/5 hover:text-white",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <div className="p-8 md:p-12">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      {activeTab === "about" && (
                        <div className="prose prose-invert max-w-none">
                          <h2 className="font-fraunces mb-8 text-3xl font-bold text-white">
                            About the Event
                          </h2>
                          <div className="font-sans text-lg leading-relaxed text-white/80">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                h1: ({ ...props }) => (
                                  <h1
                                    className="font-fraunces mb-6 mt-12 text-4xl font-bold text-white"
                                    {...props}
                                  />
                                ),
                                h2: ({ ...props }) => (
                                  <h2
                                    className="font-fraunces mb-5 mt-10 text-3xl font-bold text-white"
                                    {...props}
                                  />
                                ),
                                h3: ({ ...props }) => (
                                  <h3
                                    className="font-fraunces mb-4 mt-8 text-2xl font-bold text-white"
                                    {...props}
                                  />
                                ),
                                p: ({ ...props }) => (
                                  <p
                                    className="mb-6 leading-relaxed"
                                    {...props}
                                  />
                                ),
                                li: ({ ...props }) => (
                                  <li className="mb-2" {...props} />
                                ),
                                strong: ({ ...props }) => (
                                  <strong
                                    className="font-bold text-[#D4EBFF]"
                                    {...props}
                                  />
                                ),
                                blockquote: ({ ...props }) => (
                                  <blockquote
                                    className="my-8 rounded-r-2xl border-l-4 border-[#D4EBFF] bg-white/5 py-2 pl-6 italic"
                                    {...props}
                                  />
                                ),
                              }}
                            >
                              {event.description || "No description available."}
                            </ReactMarkdown>
                          </div>

                          <div className="mt-12 grid gap-6 sm:grid-cols-2">
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10">
                              <Award className="mb-4 h-10 w-10 text-[#D4EBFF]" />
                              <h3 className="font-fraunces mb-2 text-xl font-bold text-white">
                                Open to All
                              </h3>
                              <p className="text-white/60">
                                Students and enthusiasts from all backgrounds
                                are welcome to join.
                              </p>
                            </div>
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10">
                              <Trophy className="mb-4 h-10 w-10 text-[#D4EBFF]" />
                              <h3 className="font-fraunces mb-2 text-xl font-bold text-white">
                                Exciting Rewards
                              </h3>
                              <p className="text-white/60">
                                Top performers receive certificates, prizes, and
                                global recognition.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === "prizes" && (
                        <div className="space-y-8">
                          <h2 className="font-fraunces text-3xl font-bold text-white">
                            Prizes & Rewards
                          </h2>
                          <div className="grid gap-6 sm:grid-cols-2">
                            {parsedPrizes.map((prize: Prize, index: number) => (
                              <div
                                key={index}
                                className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition-all hover:border-[#D4EBFF]/30 hover:bg-white/10"
                              >
                                <Trophy className="mb-4 h-8 w-8 text-[#D4EBFF] transition-transform group-hover:scale-110" />
                                <h3 className="font-fraunces mb-2 text-2xl font-bold text-white">
                                  {prize.position}
                                </h3>
                                <p className="mb-4 text-white/60">
                                  {prize.description}
                                </p>
                                {prize.amount && (
                                  <div className="text-2xl font-bold text-[#00C853]">
                                    {prize.amount}
                                  </div>
                                )}
                                {prize.value && (
                                  <div className="text-2xl font-bold text-[#D4EBFF]">
                                    {prize.value}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeTab === "timeline" && (
                        <div className="space-y-8">
                          <h2 className="font-fraunces text-3xl font-bold text-white">
                            Event Timeline
                          </h2>
                          <div className="relative space-y-8 pl-8 before:absolute before:left-3 before:top-2 before:h-full before:w-[2px] before:bg-white/10">
                            {parsedTimeline.map(
                              (item: TimelineItem, index: number) => (
                                <div key={index} className="relative">
                                  <div className="absolute -left-[29px] top-1 h-5 w-5 rounded-full border-4 border-[#0F1B40] bg-[#D4EBFF]" />
                                  <div className="rounded-3xl border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10">
                                    <div className="mb-4 flex flex-wrap items-center gap-4">
                                      <Badge className="bg-[#D4EBFF]/20 text-[#D4EBFF]">
                                        {item.time}
                                      </Badge>
                                      {item.location && (
                                        <span className="flex items-center gap-1 text-sm text-white/50">
                                          <MapPin className="h-4 w-4" />{" "}
                                          {item.location}
                                        </span>
                                      )}
                                    </div>
                                    <h3 className="font-fraunces mb-2 text-xl font-bold text-white">
                                      {item.activity}
                                    </h3>
                                    {item.description && (
                                      <p className="text-sm leading-relaxed text-white/60">
                                        {item.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                      {activeTab === "gallery" && (
                        <div className="space-y-8">
                          <h2 className="font-fraunces text-3xl font-bold text-white">
                            Event Gallery
                          </h2>
                          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                            {parsedGallery.map((image, index) => (
                              <div
                                key={index}
                                className="group relative aspect-video overflow-hidden rounded-3xl border border-white/10 bg-white/5"
                              >
                                <Image
                                  src={image.src}
                                  alt={
                                    image.alt || `Gallery image ${index + 1}`
                                  }
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                                  onError={(e) => {
                                    // Fallback for HEIC if not supported
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/notfound.svg";
                                  }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                  <ImageIcon className="h-8 w-8 text-white" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeTab === "faq" && (
                        <div className="space-y-8">
                          <h2 className="font-fraunces text-3xl font-bold text-white">
                            Frequently Asked Questions
                          </h2>
                          <div className="space-y-4">
                            {parsedFaqs.map((faq: FAQ, index: number) => (
                              <div
                                key={index}
                                className="rounded-3xl border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10"
                              >
                                <h3 className="font-fraunces mb-4 flex items-start gap-4 text-xl font-bold text-white">
                                  <span className="text-[#D4EBFF]">Q.</span>
                                  {faq.question}
                                </h3>
                                <p className="pl-8 leading-relaxed text-white/60">
                                  {faq.answer}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Right Column (Info/CTA) */}
            <div className="space-y-8">
              <div className="sticky top-24 rounded-[40px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <h2 className="font-fraunces mb-6 text-2xl font-bold text-white">
                  Reservation
                </h2>

                {/* Deadline */}
                {event.endDate && (
                  <div className="mb-8 rounded-3xl border border-[#D4EBFF]/20 bg-[#D4EBFF]/10 p-6 text-center">
                    <div className="mb-2 flex items-center justify-center gap-2 text-[#D4EBFF]">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Registration Deadline
                      </span>
                    </div>
                    <p className="font-fraunces text-2xl font-bold text-[#D4EBFF]">
                      {format(new Date(event.endDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                )}

                {/* Pricing / Stats */}
                <div className="mb-8 space-y-4">
                  <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
                    <span className="font-sans text-white/60">Entry Fee</span>
                    <span className="text-xl font-bold text-[#D4EBFF]">
                      {!(event as any).registrationFee ||
                      (event as any).registrationFee === "0"
                        ? "FREE"
                        : `₹${(event as any).registrationFee}`}
                    </span>
                  </div>
                  {parsedPrizes.length > 0 && parsedPrizes[0]?.value && (
                    <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
                      <span className="font-sans text-white/60">
                        Prize Pool
                      </span>
                      <span className="text-xl font-bold text-[#00C853]">
                        {parsedPrizes[0].value}
                      </span>
                    </div>
                  )}
                  {daysUntilEvent && (
                    <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
                      <span className="font-sans text-white/60">Starts In</span>
                      <span className="text-xl font-bold text-white">
                        {daysUntilEvent} Days
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <Button
                    variant="default"
                    size="lg"
                    className={cn(
                      "h-14 w-full text-lg font-bold uppercase tracking-widest",
                      eventEnded && "cursor-not-allowed opacity-50 grayscale",
                    )}
                    onClick={handleRegister}
                    disabled={eventEnded}
                  >
                    {eventEnded ? "Closed" : "Register Now"}
                  </Button>

                  <Button
                    variant="ghost"
                    size="lg"
                    className="h-14 w-full border border-white/10 font-bold uppercase tracking-widest text-white hover:bg-white/5"
                    onClick={handleShare}
                  >
                    <Share2 className="mr-2 h-5 w-5" />
                    Share
                  </Button>
                </div>

                {/* Organizer */}
                <div className="mt-10 border-t border-white/10 pt-8">
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                    Organized By
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="font-fraunces flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4EBFF] text-xl font-bold text-[#0F1B40]">
                      EI
                    </div>
                    <div>
                      <p className="font-bold text-white">Engineering India</p>
                      <p className="text-xs text-white/40">
                        Verified Organization
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating clouds removed */}
    </main>
  );
}
