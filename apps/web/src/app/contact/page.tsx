"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  AlertCircle,
  Send,
  User,
  MessageSquare,
  Briefcase,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SERVICE_OPTIONS = [
  "Residential",
  "Commercial",
  "Renovation",
  "Finishing",
  "Special",
  "Consultation",
];

const CONTACT_INFO = [
  {
    id: "phones",
    icon: Phone,
    title: "Phone Numbers",
    color: "from-emerald-400 to-emerald-600",
    bgColor: "bg-emerald-50",
    items: [
      { label: "Eliyas Seyoum", value: "+251 913 59 70 51" },
      { label: "Yeshak Seyoum", value: "+251 992 861848" },
      { label: "Yosef Fikru", value: "+251 923 36 64 84" },
    ],
  },
  {
    id: "email",
    icon: Mail,
    title: "Email Address",
    color: "from-blue-400 to-blue-600",
    bgColor: "bg-blue-50",
    items: [
      { label: "General Inquiries", value: "lamedconstructionbc1@gmail.com" },
    ],
  },
  {
    id: "location",
    icon: MapPin,
    title: "Our Location",
    color: "from-emerald-400 to-emerald-600",
    bgColor: "bg-emerald-50",
    items: [
      { label: "Head Office", value: "Bole Sub-City, Addis Ababa, Ethiopia" },
      {
        label: "Map Coordinates",
        value: "9.021306, 38.839587",
        isLink: true,
        href: "https://www.google.com/maps?q=9.021306,38.839587",
      },
    ],
  },
  {
    id: "hours",
    icon: Clock,
    title: "Working Hours",
    color: "from-purple-400 to-purple-600",
    bgColor: "bg-purple-50",
    items: [
      { label: "Monday – Saturday", value: "8:00 AM – 11:00 PM" },
      { label: "Sunday", value: "Closed" },
    ],
  },
  {
    id: "emergency",
    icon: AlertCircle,
    title: "Emergency Contact",
    color: "from-red-400 to-red-600",
    bgColor: "bg-red-50",
    items: [
      { label: "24/7 Emergency Line", value: "+251 913 59 70 51" },
      {
        label: "Site Emergencies",
        value: "Available round the clock for urgent site matters",
      },
    ],
  },
];

interface ContactFormState {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

const INITIAL_FORM_STATE: ContactFormState = {
  fullName: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

import { Navbar, Footer } from "@/components/layout";
import { useLanguageStore } from "@/store/languageStore";
import { useTranslation } from "@/lib/i18n";

export default function ContactPage() {
  const { language } = useLanguageStore();
  const t = useTranslation(language);

  const [formState, setFormState] = useState<ContactFormState>(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormState, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormState, string>> = {};

    if (!formState.fullName.trim()) {
      newErrors.fullName = "Please enter your full name";
    }

    if (!formState.email.trim()) {
      newErrors.email = "Please enter your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formState.service) {
      newErrors.service = "Please select a service";
    }

    if (!formState.message.trim()) {
      newErrors.message = "Please enter your message";
    } else if (formState.message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.fullName,
          email: formState.email,
          phone: formState.phone || undefined,
          service: formState.service || undefined,
          message: formState.message,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to send message");
      }

      toast.success("Message sent successfully!", {
        description: "We'll get back to you within 24 hours.",
        duration: 5000,
      });

      setFormState(INITIAL_FORM_STATE);
      setErrors({});
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg + " Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-navy-50">
      <Navbar />
      <Toaster position="top-right" richColors closeButton />

      <section className="relative bg-gradient-to-br from-navy-800 via-navy-900 to-navy-900 text-white pt-28 sm:pt-32 lg:pt-36 pb-14 sm:pb-16 lg:pb-20 sm:pb-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url(/assets/images/back%20image.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-navy-900" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-sm font-medium mb-6">
              <MessageSquare className="w-4 h-4" />
              We'd Love to Hear From You
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold font-serif mb-4 sm:mb-6 leading-tight">
              Get In{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">
                Touch
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-navy-200 leading-relaxed max-w-2xl mx-auto">
              Whether you have a project in mind, need a consultation, or just
              want to learn more about our services, our team is ready to help
              you build the future.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-5"
          >
            <h2 className="text-2xl font-extrabold text-slate-950 font-serif mb-6 flex items-center gap-3">
              <div className="w-1 h-8 rounded-full bg-emerald-500" />
              Contact Information
            </h2>

            {CONTACT_INFO.map((info) => {
              const IconComponent = info.icon;
              return (
                <div
                  key={info.id}
                  className="bg-white rounded-2xl shadow-card border border-slate-200 p-5 sm:p-6 hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-lg",
                        info.color
                      )}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-slate-950 mb-3">
                        {info.title}
                      </h3>
                      <div className="space-y-2">
                        {info.items.map((item, idx) => (
                          <div key={idx}>
                            <div className="text-xs text-slate-700 font-bold mb-0.5">
                              {item.label}
                            </div>
                            {item.isLink && item.href ? (
                              <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                              >
                                {item.value}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <div className="text-sm font-bold text-slate-900 break-words">
                                {item.value}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl shadow-card border border-slate-200 p-6 sm:p-8 lg:p-10 sticky top-6">
              <h2 className="text-2xl font-extrabold text-slate-950 font-serif mb-2 flex items-center gap-3">
                <div className="w-1 h-8 rounded-full bg-emerald-500" />
                Send Us a Message
              </h2>
              <p className="text-slate-800 font-medium mb-8">
                Fill out the form below and our team will get back to you
                within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-extrabold text-slate-950 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      name="fullName"
                      value={formState.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={cn(
                        "w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border text-slate-950 font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all",
                        errors.fullName
                          ? "border-red-300 focus:ring-red-500 focus:border-red-300"
                          : "border-slate-300 focus:ring-emerald-500 focus:border-transparent"
                      )}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-extrabold text-slate-950 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={cn(
                          "w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border text-slate-950 font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all",
                          errors.email
                            ? "border-red-300 focus:ring-red-500 focus:border-red-300"
                            : "border-slate-300 focus:ring-emerald-500 focus:border-transparent"
                        )}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1.5 text-sm text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-extrabold text-slate-950 mb-2">
                      Phone{" "}
                      <span className="text-slate-600 font-semibold">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="tel"
                        name="phone"
                        value={formState.phone}
                        onChange={handleChange}
                        placeholder="+251 911 234 567"
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-950 font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-slate-950 mb-2">
                    Service Interested In <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                    <select
                      name="service"
                      value={formState.service}
                      onChange={handleChange}
                      className={cn(
                        "w-full pl-12 pr-12 py-3.5 rounded-xl bg-slate-50 border text-slate-950 font-medium focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer",
                        !formState.service ? "text-slate-500" : "",
                        errors.service
                          ? "border-red-300 focus:ring-red-500 focus:border-red-300"
                          : "border-slate-300 focus:ring-emerald-500 focus:border-transparent"
                      )}
                    >
                      <option value="" disabled>
                        Select a service...
                      </option>
                      {SERVICE_OPTIONS.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.service && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.service}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-slate-950 mb-2">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
                    <textarea
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell us about your project, timeline, budget, or any questions you have..."
                      className={cn(
                        "w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border text-slate-950 font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all resize-none",
                        errors.message
                          ? "border-red-300 focus:ring-red-500 focus:border-red-300"
                          : "border-slate-300 focus:ring-emerald-500 focus:border-transparent"
                      )}
                    />
                  </div>
                  {errors.message && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.message}
                    </p>
                  )}
                  <p className="mt-1.5 text-xs text-slate-600 font-semibold text-right">
                    {formState.message.length}/500
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-white font-bold text-base transition-all duration-300 shadow-lg",
                    isSubmitting
                      ? "bg-navy-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-500/25 hover:shadow-emerald-500/40"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-700 font-semibold mt-4">
                  By submitting this form, you agree to our privacy policy.
                  We&apos;ll never share your information.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-1 rounded-full bg-emerald-500" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy-800 font-serif">
              Find Us on the Map
            </h2>
            <div className="w-12 h-1 rounded-full bg-emerald-500" />
          </div>
          <p className="text-navy-600 max-w-2xl mx-auto">
            Visit our head office in the heart of Addis Ababa. We&apos;re always
            happy to welcome clients for a face-to-face consultation.
          </p>
        </motion.div>

        <motion.a
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          href="https://www.google.com/maps?q=9.021306,38.839587"
          target="_blank"
          rel="noopener noreferrer"
          className="group block relative rounded-3xl overflow-hidden border-4 border-navy-800 shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500"
        >
          <div className="relative aspect-[21/9] bg-navy-100">
            <iframe
              title="Lamed Construction HQ - Addis Ababa Map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=38.81%2C9.005%2C38.86%2C9.035&layer=mapnik&marker=9.021306%2C38.839587"
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex flex-col items-center"
              >
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full bg-emerald-500/20 animate-ping" />
                  <div className="relative w-16 h-16 rounded-full bg-white shadow-2xl flex items-center justify-center border-4 border-emerald-500">
                    <MapPin className="w-8 h-8 text-emerald-600" />
                  </div>
                </div>
                <div className="mt-4 bg-navy-900/90 backdrop-blur-sm rounded-2xl px-6 py-3 text-center border border-navy-700">
                  <div className="text-white font-bold text-lg font-serif">
                    Lamed Construction HQ
                  </div>
                  <div className="text-emerald-300 text-sm">
                    Bole Sub-City, Addis Ababa, Ethiopia
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="absolute top-5 right-5 pointer-events-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white shadow-lg text-navy-800 font-semibold text-sm group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
              <ExternalLink className="w-4 h-4" />
              Open in Google Maps
            </div>

            <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-lg border border-navy-200 pointer-events-none">
              <div className="text-xs text-navy-500 font-semibold mb-0.5">
                COORDINATES
              </div>
              <div className="text-sm font-bold text-navy-800 font-mono">
                9.021306, 38.839587
              </div>
            </div>
          </div>
        </motion.a>
      </section>

      <Footer />
    </main>
  );
}
