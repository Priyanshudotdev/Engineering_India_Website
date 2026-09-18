"use client";

import { FloatingCloud } from "@/components/landing/FloatingCloud";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import {
  ArrowRight,
  ClipboardCheck,
  Zap,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const FAQItem = ({
  faq,
  index,
}: {
  faq: { question: string; answer: string };
  index: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="overflow-hidden border-b border-white/10"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex w-full items-center justify-between py-5 text-left"
      >
        <span className="font-fraunces text-lg text-white transition-colors group-hover:text-[#D4EBFF] md:text-xl">
          {faq.question}
        </span>
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 ${isOpen ? "bg-white text-[#1D317D]" : "bg-white/10 text-white"}`}
        >
          <ArrowRight
            className={`h-3.5 w-3.5 transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"}`}
          />
        </div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="max-w-2xl pb-5 font-sans text-sm leading-relaxed text-white/60">
          {faq.answer}
        </p>
      </motion.div>
    </motion.div>
  );
};

const HelpItem = ({
  item,
  index,
}: {
  item: { title: string; desc: string };
  index: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      viewport={{ once: true }}
      className={`group mb-2 cursor-pointer rounded-2xl p-5 transition-all duration-300 md:p-6 ${isOpen ? "border border-white/5 bg-[#1D317D]" : "border border-transparent bg-white/5 hover:bg-white/10"}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-fraunces text-lg font-medium text-white md:text-xl">
            {item.title}
          </h3>
          <motion.div
            initial={false}
            animate={{
              height: isOpen ? "auto" : 0,
              opacity: isOpen ? 1 : 0,
              marginTop: isOpen ? 12 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl font-sans text-xs leading-relaxed text-white/60 md:text-sm">
              {item.desc}
            </p>
          </motion.div>
        </div>
        <div
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all duration-500 md:h-10 md:w-10 ${isOpen ? "bg-white text-[#1D317D]" : "bg-white/10 text-white group-hover:bg-white group-hover:text-[#1D317D]"}`}
        >
          <ArrowRight
            className={`h-4 w-4 transition-transform duration-500 md:h-5 md:w-5 ${isOpen ? "rotate-90" : "rotate-0"}`}
          />
        </div>
      </div>
    </motion.div>
  );
};

const timelineEvents = [
  {
    year: "2022 | August 23",
    title: "Establishment of Engineering India, YCCE & Uttishtha Bharat",
    description:
      "Founded to promote technical and social engagement, Engineering India, YCCE hosted its first event, Uttishtha Bharat, celebrating 75 years of independence with inspiring speeches and a Tiranga Rally.",
  },
  {
    year: "2023 | May 8-10",
    title: "Avyanna – Self-Defence Workshop",
    description:
      "A three-day workshop on Yeshti techniques and Prahar training empowered 60 participants with essential self-defense skills and awareness.",
  },
  {
    year: "2024 | January 3",
    title: "New Year Donation Drive",
    description:
      "Volunteers distributed food, clothing, and toys, spreading joy and fostering compassion in the community.",
  },
  {
    year: "2024 | March 2",
    title: "Shivaji Maharaj Jayanti Celebration",
    description:
      "Held at SDM Auditorium, this event featured Shivgoshna, Godhal dance, and an inspiring speech by Ram Wagh Sir, honoring Shivaji Maharaj’s legacy and fostering pride.",
  },
  {
    year: "2024 | April 27",
    title: "वाक् यज्ञः – Speech Competition",
    description:
      "An intercollegiate event where participants showcased their ideas. Winners were awarded certificates and cash prizes, promoting teamwork and a competitive spirit.",
  },
  {
    year: "2024 | August 10",
    title: "Rangeettalim 4.0",
    description:
      "Held at Omkar Nagar, Nagpur, this social initiative engaged slum children in education and cultural activities. With 70 volunteers, it fostered learning and community spirit.",
  },
  {
    year: "2025 | February 10",
    title: "Ultimate Socio-Technocrat – Social Hackathon",
    description:
      "As part of YASH 25.0, this offline hackathon at YCCE saw 75+ participants tackle real-world issues in Slum Development, Women Empowerment, and Carbon Footprint. Collaborating with NGOs, participants presented innovative solutions, with judges selecting the best.",
  },
];

const faqsData = [
  {
    question: "What is Engineering India?",
    answer:
      "Engineering India is a social and technical club at YCCE College, Nagpur. We organize various events, workshops, competitions, and social initiatives to enhance the technical skills and social awareness of engineering students.",
  },
  {
    question: "How can I join Engineering India?",
    answer:
      "Any student from YCCE College can join Engineering India. We conduct membership drives at the beginning of each academic year. You can also reach out to us through our contact form or visit our office in the college campus.",
  },
  {
    question: "What types of events does the club organize?",
    answer:
      "We organize a wide range of events including cultural events, technical workshops, coding competitions, hackathons, guest lectures, industry visits and social outreach programs.",
  },
  {
    question: "Are there any membership fees?",
    answer:
      "No, our club is open to everyone. We believe in inclusivity, so you can join and participate in all activities and events for free!",
  },
  {
    question: "Can first-year students join the club?",
    answer:
      "We encourage first-year students to join and participate in our activities. It's a great way to build skills, network, and enhance your college experience from the beginning.",
  },
  {
    question: "In what domain I can volunteer ?",
    answer:
      "Members can volunteer for various roles in event organization, technical teams, literature, photography, designing and more. Just reach out to any of the club heads or coordinators to express your interest.",
  },
];

const JourneyTimeline = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedEvents = isExpanded
    ? timelineEvents
    : timelineEvents.slice(0, 3);

  return (
    <div className="relative z-20 w-full overflow-hidden bg-gradient-to-b from-[#4F6D9A] to-[#3D5783] px-4 py-20 sm:px-6 md:px-8">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-12 text-center md:text-left">
          <h3 className="mb-3 font-fraunces text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
            Our Journey
          </h3>
          <p className="mx-auto max-w-xl text-xs leading-relaxed text-white/60 sm:text-sm md:mx-0">
            From humble beginnings to a thriving community of innovators and
            social change-makers.
          </p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute bottom-0 left-4 top-0 w-px -translate-x-1/2 bg-white/20 md:left-6" />

          <div className="space-y-12 md:space-y-16">
            {displayedEvents.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
                className="relative pl-10 md:pl-20"
              >
                <div className="absolute left-4 top-1.5 z-10 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-white md:left-6" />

                <div className="max-w-2xl">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#D4EBFF]/60">
                    {event.year}
                  </span>
                  <h3 className="mb-2 font-fraunces text-lg font-medium text-white transition-colors md:text-xl">
                    {event.title}
                  </h3>
                  <p className="max-w-xl font-sans text-xs leading-relaxed text-white/60 md:text-sm">
                    {event.description}
                  </p>

                  {index === 1 && (
                    <motion.div
                      initial={{ scale: 0.98, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="mt-6 overflow-hidden rounded-2xl border border-white/5"
                    >
                      <img
                        src="https://res.cloudinary.com/dzryfm8cb/image/upload/v1743217526/UST-Home_page_rnhpsv.jpg"
                        alt="Concept"
                        className="h-auto max-h-[300px] w-full object-cover"
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 flex justify-center md:justify-start md:pl-20">
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="premium"
              className="rounded-full px-8"
            >
              <span className="">{isExpanded ? "Show Less" : "Show More"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeedbackSection = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormState((prev) => ({
        ...prev,
        name: user.name ?? "",
        email: user.email ?? "",
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Failed to submit feedback.");
        return;
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormState((prev) => ({ ...prev, message: "" }));
      }, 3000);
    } catch (err) {
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-20 w-full bg-[#0F1B40] px-4 py-20 sm:px-6 md:px-8">
      <div className="container mx-auto max-w-xl">
        <div className="mb-10 text-center md:mb-12">
          <h2 className="mb-4 font-fraunces text-3xl font-semibold text-white md:text-4xl">
            Share Your Feedback
          </h2>
          <p className="mx-auto max-w-md font-sans text-xs text-white/60 md:text-sm">
            We value your thoughts. Let us know how we can make Engineering
            India even better.
          </p>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-md md:p-10">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-10"
            >
              <CheckCircle className="mb-6 h-16 w-16 text-green-400" />
              <h3 className="mb-2 font-fraunces text-2xl font-bold text-white">
                Thank You!
              </h3>
              <p className="text-center text-white/60">
                Your feedback has been received.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="rounded-lg border border-red-400/30 bg-red-400/20 p-3 text-sm text-red-100">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-wider text-white/60">
                    Name
                  </label>
                  <Input
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    placeholder="Your Name"
                    className="h-12 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:ring-[#6183B1]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-wider text-white/60">
                    Email
                  </label>
                  <Input
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    placeholder="your@email.com"
                    type="email"
                    className="h-12 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:ring-[#6183B1]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-xs font-bold uppercase tracking-wider text-white/60">
                    Message
                  </label>
                  <Textarea
                    value={formState.message}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
                    placeholder="Tell us what you think..."
                    className="min-h-[120px] rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:ring-[#6183B1]"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="premium"
                disabled={isLoading}
                className="h-12 w-full rounded-xl bg-white font-bold transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="text-[#1D317D]">Send Feedback</span>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const cloudX = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? ["0%", "-5%"] : ["0%", "-12%"],
  );
  const cloudY = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? ["0%", "8%"] : ["0%", "15%"],
  );

  const fortY = useTransform(
    scrollYProgress,
    [0.3, 0.8],
    isMobile ? ["15%", "-5%"] : ["20%", "-10%"],
  );

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      <div className="relative z-10 min-h-screen w-full bg-gradient-to-b from-[#6183B1] via-[#9A8EB8] to-[#C6B8CC]">
        <div className="relative z-50 flex min-h-screen flex-col items-center justify-center px-4 pb-20 text-center text-white sm:mb-0 sm:px-6 md:px-8">
          <h2 className="xxs:text-3xl xs:text-4xl max-w-[90vw] font-fraunces text-2xl font-semibold leading-tight sm:max-w-none sm:text-4xl">
            ENGINEERING INDIA YCCE
          </h2>
          <p className="xs:text-sm xs:max-w-xs mt-2 max-w-[85vw] font-fraunces text-xs italic tracking-tight text-white/80 sm:mt-3 sm:max-w-sm sm:text-base md:max-w-md md:text-lg lg:text-xl">
            "Think Nationally, Act Locally."
          </p>
          <div className="mt-4 flex items-center justify-center gap-3 sm:mt-6 sm:gap-4 md:mt-8">
            <Button
              className="group relative z-50 h-10 px-4 font-bold sm:h-12 sm:px-6 md:px-8"
              variant="premium"
              size="xl"
              onClick={() => router.push("/events")}
            >
              <span className="text-sm font-bold text-[#193486] sm:text-base md:text-lg">
                Join Now
              </span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 sm:h-5 sm:w-5"
                strokeWidth={2.5}
                color="#193486"
              />
            </Button>
          </div>
        </div>
      </div>

      <motion.div
        style={{
          x: cloudX,
          y: cloudY,
        }}
        className="xxs:top-[58vh] xxs:-left-[55%] xxs:h-[48vh] xxs:w-[180%] xs:top-[55vh] xs:-left-[50%] xs:h-[52vh] xs:w-[170%] pointer-events-none absolute -left-[60%] top-[60vh] z-30 h-[45vh] w-[200%] pb-16 sm:-left-[45%] sm:top-[50vh] sm:h-[60vh] sm:w-[150%] sm:pb-0 md:-left-[38%] md:top-[45vh] md:h-[70vh] md:w-[130%] lg:-left-[32%] lg:top-[40vh] lg:h-[85vh] lg:w-[115%] xl:-left-[28%] xl:top-[35vh] xl:h-screen xl:w-[110%]"
      >
        <img
          src="/landing/clouds/4.png"
          className="h-full w-full select-none object-contain object-bottom"
          alt="cloud"
          loading="eager"
          draggable="false"
          style={{
            willChange: "transform",
            transform: "translateZ(0)",
          }}
        />
      </motion.div>

      <FloatingCloud
        top="110vh"
        left="10%"
        speed={0.5}
        cloudNum={1}
        opacity="opacity-30"
      />
      <FloatingCloud
        top="140vh"
        left="70%"
        speed={0.8}
        cloudNum={2}
        opacity="opacity-20"
        scale={0.8}
      />

      <div className="z-15 relative hidden w-full bg-gradient-to-b from-[#C6B8CC] to-[#C6B8CC] sm:block sm:h-[30vh]" />

      <div
        id="about"
        className="relative z-20 min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#C6B8CC] via-[#9A8EB8] to-[#6183B1]"
      >
        <div className="flex min-h-screen flex-col items-center justify-between px-4 py-16 sm:flex-row sm:px-10 lg:px-14 xl:px-20">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full space-y-4 text-center sm:w-1/2 sm:text-left lg:max-w-2xl"
          >
            <h3 className="xxs:text-3xl xs:text-4xl max-w-[90vw] font-fraunces text-2xl font-semibold leading-tight text-white sm:max-w-none sm:text-4xl">
              About Engineering India
            </h3>
            <p className="text-xs leading-relaxed text-white/75 sm:text-sm md:text-base lg:text-lg">
              A dynamic student-led organization at YCCE College, Nagpur,
              dedicated to fostering innovation, technical excellence, and
              social responsibility among engineering students.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4 sm:justify-start sm:gap-6 md:gap-8 md:pt-4">
              <div className="text-center sm:text-left">
                <p className="text-2xl font-bold text-[#D4EBFF] sm:text-3xl md:text-4xl">
                  50+
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 sm:text-xs md:text-sm">
                  Events
                </p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-2xl font-bold text-[#D4EBFF] sm:text-3xl md:text-4xl">
                  250+
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 sm:text-xs md:text-sm">
                  Members
                </p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-2xl font-bold text-[#D4EBFF] sm:text-3xl md:text-4xl">
                  8+
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 sm:text-xs md:text-sm">
                  Social Leads
                </p>
              </div>
            </div>

            <div className="pt-2 sm:pt-4 md:pt-6">
              <Button
                className="group h-10 rounded-full border-white/50 px-5 font-bold text-white hover:bg-white/10"
                variant="premium"
                size="sm"
              >
                <span className="text-xs sm:text-sm md:text-base">
                  Our Story
                </span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
            className="flex w-full items-center justify-center sm:w-1/2"
          >
            <div className="relative w-full max-w-xl overflow-hidden rounded-[3rem] border-[12px] border-white/10 backdrop-blur-sm">
              <img
                src="/landing/about.png"
                className="h-full w-full object-cover"
                alt="Engineering India Team"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>
          </motion.div>
        </div>

        <div
          className="pointer-events-none absolute -bottom-8 -right-[50%] z-10 h-48 sm:-bottom-10 sm:h-56 md:h-64 lg:h-72 xl:h-80"
          style={{
            background:
              "linear-gradient(to top, #6183B1 0%, #6183B1 40%, transparent 100%)",
            left: "-100vw",
            width: "200vw",
          }}
        />
      </div>

      {/* ========== BENTO GRID EVENTS SECTION ========== */}
      <div
        id="events"
        className="relative z-20 w-full bg-gradient-to-b from-[#6183B1] to-[#4F6D9A] px-4 py-16 sm:px-6 md:px-8 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="mb-10 text-center md:mb-12">
            <h3 className="mb-3 font-fraunces text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
              Our Events
            </h3>
            <p className="mx-auto max-w-xl px-4 text-xs leading-relaxed text-white/60 sm:text-sm">
              A glimpse of the various events, workshops, and social initiatives
              organized by Engineering India.
            </p>
          </div>

          <div className="grid h-auto grid-cols-1 gap-4 md:h-[500px] md:grid-cols-4 md:grid-rows-2">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-3xl md:col-span-2 md:row-span-2"
            >
              <img
                src="https://res.cloudinary.com/priyanshukayarkar/image/upload/v1741540145/EI-Events/Donation%20Drive/Donation%20drive%20%28orphanage%29/Copy_of_IMG_0377_alioxw.jpg"
                alt="Donation Drive"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6">
                <h4 className="mb-1 text-xl font-bold text-white">
                  Donation Drive
                </h4>
                <p className="text-xs text-white/70">
                  Spreading joy through compassion and community support.
                </p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group relative overflow-hidden rounded-3xl md:col-span-2"
            >
              <img
                src="https://res.cloudinary.com/dzryfm8cb/image/upload/v1743217526/UST-Home_page_rnhpsv.jpg"
                alt="UST"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6">
                <h4 className="mb-1 text-lg font-bold text-white">
                  Social Technocart
                </h4>
                <p className="text-nowrap text-xs text-white/70">
                  Solving real-world challenges with tech.
                </p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative overflow-hidden rounded-3xl md:col-span-1"
            >
              <img
                src="https://res.cloudinary.com/priyanshukayarkar/image/upload/v1741540002/EI-Events/Rangittalim3/IMG20231022171239_nnmgko.jpg"
                alt="Rangittalim"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4">
                <h4 className="text-sm font-bold text-white">Rangittalim</h4>
              </div>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group relative overflow-hidden rounded-3xl md:col-span-1"
            >
              <img
                src="https://res.cloudinary.com/dzryfm8cb/image/upload/v1743217795/abhudaya_tt2su2.jpg"
                alt="Abhyudhaya"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4">
                <h4 className="text-sm font-bold text-white">Abhyudhaya</h4>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <FloatingCloud
        top="220vh"
        left="-5%"
        speed={0.4}
        cloudNum={3}
        opacity="opacity-20"
        scale={1.2}
      />
      <FloatingCloud
        top="280vh"
        left="80%"
        speed={0.6}
        cloudNum={4}
        opacity="opacity-15"
        scale={0.9}
      />

      {/* ========== JOURNEY TIMELINE SECTION ========== */}
      <div id="journey">
        <JourneyTimeline />
      </div>

      {/* ========== HOW IT WORKS SECTION (Callbaba Style) ========== */}
      <div className="relative z-20 w-full overflow-hidden bg-gradient-to-b from-[#3D5783] to-[#2B416C] px-4 py-20 sm:px-6 md:px-8">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-3 px-4 font-fraunces text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
              Here's how it works:
            </h2>
            <p className="mx-auto max-w-xl px-6 font-fraunces text-sm italic tracking-tight text-white/80 sm:text-base">
              At Engineering India, we believe learning begins with engagement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col justify-between overflow-hidden rounded-[32px] bg-[#1D317D] p-6 pb-0 transition-transform hover:scale-[1.02]"
            >
              <div>
                <h3 className="mb-3 font-fraunces text-xl font-medium text-white">
                  1. Discovery
                </h3>
                <p className="mb-6 font-sans text-xs leading-relaxed text-white/70">
                  Start with a quick interaction to share your technical
                  interests and academic goals.
                </p>
              </div>
              <div className="relative mt-auto">
                <img
                  src="https://res.cloudinary.com/priyanshukayarkar/image/upload/v1741540145/EI-Events/Donation%20Drive/Donation%20drive%20%28orphanage%29/Copy_of_IMG_0377_alioxw.jpg"
                  alt="Discovery"
                  className="h-auto w-full rounded-t-2xl border-t-2 border-white/10 object-cover"
                />
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col justify-between overflow-hidden rounded-[32px] bg-[#FCFAF2] p-6 transition-transform hover:scale-[1.02]"
            >
              <div>
                <h3 className="mb-3 font-fraunces text-xl font-medium text-[#1D317D]">
                  2. Peer Mentorship
                </h3>
                <p className="mb-6 font-sans text-xs leading-relaxed text-[#1D317D]/70">
                  You're matched with a dedicated student lead who guides you
                  through club activities.
                </p>

                <div className="space-y-4">
                  <div className="border-l-2 border-[#1D317D]/10 pl-3">
                    <p className="mb-1 font-fraunces text-3xl font-bold leading-none text-[#1D317D]">
                      20+
                    </p>
                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#1D317D]/40">
                      Categories
                    </p>
                  </div>
                  <div className="border-l-2 border-[#1D317D]/10 pl-3">
                    <p className="mb-1 font-fraunces text-3xl font-bold leading-none text-[#1D317D]">
                      50+
                    </p>
                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#1D317D]/40">
                      Active Mentors
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative mt-6">
                <img
                  src="https://res.cloudinary.com/dzryfm8cb/image/upload/v1743217526/UST-Home_page_rnhpsv.jpg"
                  alt="Mentorship"
                  className="ml-auto h-auto w-32 rounded-br-2xl rounded-tl-3xl object-cover"
                />
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col justify-between overflow-hidden rounded-[32px] bg-[#1D317D] p-6 transition-transform hover:scale-[1.02]"
            >
              <div className="mb-0">
                <h3 className="mb-3 font-fraunces text-xl font-medium text-white">
                  3. Skill Building
                </h3>
                <p className="mb-6 font-sans text-xs leading-relaxed text-white/70">
                  We handle the resources and tools while you focus on building
                  your technical foundation.
                </p>
              </div>

              <div className="mt-auto">
                <p className="mb-3 font-fraunces text-5xl font-bold leading-none text-white">
                  +98%
                </p>
                <p className="text-sm font-medium text-white/70">
                  Increased confidence in core engineering skills
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <FloatingCloud
        top="450vh"
        left="15%"
        speed={0.7}
        cloudNum={1}
        opacity="opacity-10"
        scale={1.5}
      />
      <FloatingCloud
        top="520vh"
        left="75%"
        speed={0.5}
        cloudNum={2}
        opacity="opacity-15"
        scale={1.1}
      />

      {/* ========== HOW WE CAN HELP SECTION (Interactive Style) ========== */}
      <div className="relative z-20 w-full overflow-hidden bg-gradient-to-b from-[#2B416C] to-[#1D317D] px-4 py-20 sm:px-6 md:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-12 text-center md:text-left">
            <h2 className="mb-3 font-fraunces text-2xl font-semibold text-white sm:text-3xl md:text-4xl">
              How we can help you
            </h2>
            <p className="mx-auto max-w-xl px-4 font-sans text-xs text-white/60 sm:text-sm md:mx-0 md:px-0 md:text-base">
              Your growth as an engineer is our priority. We provide the support
              you deserve.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-1 md:grid-cols-1">
            {[
              {
                title: "Technical Excellence",
                desc: "Gain hands-on experience through project-based learning and specialized workshops curated by industry professionals.",
              },
              {
                title: "Soft Skills & Leadership",
                desc: "Develop critical communication, leadership, and management skills through organizing events and lead roles.",
              },
              {
                title: "Industrial Exposure",
                desc: "Get connected with industry leaders and alumni through our networking summits and career guidance sessions.",
              },
              {
                title: "Social Impact & Community",
                desc: "Participate in social hackathons and donation drives to apply your skills for the betterment of society.",
              },
            ].map((item, i) => (
              <HelpItem key={item.title} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* ========== BENEFITS SECTION (Callbaba Style) ========== */}
      <div className="relative z-20 w-full overflow-hidden bg-gradient-to-b from-[#1D317D] to-[#0F1B40] px-4 py-20 sm:px-6 md:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative mx-auto max-w-md overflow-hidden rounded-[40px] bg-[#FCFAF2] lg:mx-0"
            >
              <img
                src="https://res.cloudinary.com/priyanshukayarkar/image/upload/v1741540002/EI-Events/Rangittalim3/IMG20231022171239_nnmgko.jpg"
                alt="Support"
                className="aspect-[4/5] h-auto w-full object-cover opacity-90 mix-blend-multiply"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 font-fraunces text-3xl font-semibold leading-tight text-white md:text-4xl">
                No more confusion, or missed opportunities.
              </h2>
              <p className="mb-10 max-w-lg font-sans text-sm leading-relaxed text-white/70">
                Your career path should be clear. Engineering India takes over
                the hard parts, from resource gathering to planning, so you can
                focus on building your future.
              </p>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                    <ClipboardCheck className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-fraunces text-lg font-medium text-white">
                      Resources & Benefits
                    </h4>
                    <p className="font-sans text-xs leading-relaxed text-white/60">
                      No more searching for tools. Get access to premium
                      resources and mentorship instantly.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-fraunces text-lg font-medium text-white">
                      Projects & Certifications
                    </h4>
                    <p className="font-sans text-xs leading-relaxed text-white/60">
                      Your work earns recognition. Validated projects that stand
                      out on your professional profile.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <Button
                  variant="premium"
                  className="group flex items-center gap-2 rounded-full bg-white px-8 py-5 text-sm font-bold text-[#1D317D] transition-all duration-300 hover:scale-105 hover:bg-[#FCFAF2] active:scale-95"
                >
                  Join the Club
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Aesthetic Cloud Decoration at Bottom Right */}
        <motion.div
          style={{
            y: useTransform(scrollYProgress, [0.8, 1], ["20%", "-20%"]),
          }}
          className="pointer-events-none absolute bottom-0 right-[-5%] z-30 w-[30%] select-none opacity-30"
        >
          <img src="/landing/clouds/4.png" className="h-auto w-full" alt="" />
        </motion.div>
      </div>

      {/* ========== FEEDBACK SECTION ========== */}
      <div id="contact">
        <FeedbackSection />
      </div>

      {/* ========== FAQ SECTION (Callbaba Style) ========== */}
      <div
        id="faq"
        className="relative z-20 w-full bg-[#0F1B40] px-4 py-20 sm:px-6 md:px-8"
      >
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="font-fraunces text-3xl font-semibold text-white md:text-4xl">
              Frequently asked questions
            </h2>
          </motion.div>

          <div className="space-y-1">
            {faqsData.map((faq, i) => (
              <FAQItem key={faq.question} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
