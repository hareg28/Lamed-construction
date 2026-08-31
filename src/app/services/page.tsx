'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Home,
  Building2,
  Hammer,
  Layers,
  Castle,
  Compass,
  ArrowRight,
  MessageSquare,
  PencilRuler,
  HardHat,
  Handshake,
} from 'lucide-react';
import { Navbar, Footer } from '@/components/layout';
import SectionHeading from '@/components/public/SectionHeading';
import ServicesCard from '@/components/public/ServicesCard';
import { cn } from '@/lib/utils';
import { useLanguageStore } from '@/store/languageStore';
import { useTranslation } from '@/lib/i18n';

const HERO_BG = '/assets/images/back image3.webp';

const SERVICES = [
  {
    icon: Home,
    title: 'Residential Construction',
    description:
      'From cozy family homes to sprawling housing complexes, we design and build residential spaces that blend comfort, durability, and timeless aesthetics — tailored to how Ethiopian families truly live.',
    points: [
      'Custom homes tailored to your lifestyle',
      'Apartment buildings and multi-unit complexes',
      'Luxury villas and estates',
      'Affordable housing developments',
    ],
  },
  {
    icon: Building2,
    title: 'Commercial Construction',
    description:
      'We construct commercial spaces that drive business success — from sleek office towers that command skyline presence to vibrant retail centers and hospitality destinations that welcome the world.',
    points: [
      'Corporate office towers and HQ buildings',
      'Retail centers, malls, and storefronts',
      'Hotels, resorts, and hospitality venues',
      'Mixed-use commercial-residential developments',
    ],
  },
  {
    icon: Hammer,
    title: 'Renovation & Remodeling',
    description:
      'Give existing structures a new lease on life. Our renovation experts transform outdated buildings into modern, functional spaces — preserving character while elevating every finish, layout, and system.',
    points: [
      'Full home renovations and additions',
      'Office and retail space remodeling',
      'Structural upgrades and retrofits',
      'Historic building restoration',
    ],
  },
  {
    icon: Layers,
    title: 'Interior & Exterior Finishing',
    description:
      'The details make the difference. Our finishing teams deliver precision craftsmanship across interiors and exteriors, ensuring every surface, fixture, and facade meets the highest quality standards.',
    points: [
      'Premium interior finishes and cabinetry',
      'Flooring, tiling, and stonework',
      'Facade cladding and exterior detailing',
      'Painting, lighting, and fixture installation',
    ],
  },
  {
    icon: Castle,
    title: 'Special Buildings',
    description:
      'Landmark structures that serve communities and inspire generations. We approach special buildings with reverence, cultural sensitivity, and architectural ambition worthy of their significance.',
    points: [
      'Churches and places of worship',
      'Cultural centers and museums',
      'Schools, universities, and educational facilities',
      'Hospitals and healthcare complexes',
    ],
  },
  {
    icon: Compass,
    title: 'Consultation & Design',
    description:
      'Before a single brick is laid, our design and consulting team lays the foundation for success. We translate ideas into actionable, buildable, and budget-aligned plans you can trust.',
    points: [
      'Architectural design and 3D visualization',
      'Feasibility studies and site analysis',
      'Cost estimation and project budgeting',
      'Permitting, regulatory, and compliance support',
    ],
  },
];

const PROCESS_STEPS = [
  {
    step: '01',
    icon: MessageSquare,
    title: 'Consultation',
    description:
      'We start by listening. An initial meeting to understand your vision, goals, budget, and timeline. We ask the right questions to ensure we truly get what you want to build.',
  },
  {
    step: '02',
    icon: PencilRuler,
    title: 'Design & Plan',
    description:
      'Our architects and engineers translate your vision into detailed plans, 3D visuals, and a clear project roadmap — including materials, timelines, and transparent cost breakdowns.',
  },
  {
    step: '03',
    icon: HardHat,
    title: 'Build & Monitor',
    description:
      'Construction begins with expert project management. You get regular updates, site access, and a dedicated point person as our skilled teams bring the plans to life with precision and care.',
  },
  {
    step: '04',
    icon: Handshake,
    title: 'Deliver & Support',
    description:
      'We hand over a fully finished, thoroughly inspected space you can be proud of — backed by warranties, maintenance support, and a long-term partnership you can count on.',
  },
];

export default function ServicesPage() {
  const { language } = useLanguageStore();
  const t = useTranslation(language);

  return (
    <main className="min-h-screen bg-white dark:bg-navy-950 text-slate-900 dark:text-navy-100 transition-colors duration-300">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative min-h-[70vh] h-auto flex items-center justify-center overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-24 bg-navy-950 text-white">
        <div className="absolute inset-0">
          <img
            src={HERO_BG}
            alt="Construction services"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/85" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-5 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold mb-5 shadow-lg backdrop-blur-sm">
              What We Offer
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white mb-4 sm:mb-6 leading-tight font-bold drop-shadow-md">
              {t.services.title.split(" ")[0]}{" "}
              <span className="text-emerald-400">
                {t.services.title.split(" ").slice(1).join(" ") || "Services"}
              </span>
            </h1>
            <p className="text-slate-200 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
              {t.services.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-16 sm:py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Capabilities"
          title="Comprehensive Construction Solutions"
          subtitle="From foundation to final inspection, we bring technical excellence, craftsmanship, and total accountability to every project."
          center
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES.map((service, idx) => (
            <ServicesCard
              key={service.title}
              service={service}
              index={idx}
            />
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-slate-50 dark:bg-navy-900/60 border-y border-slate-200 dark:border-navy-800 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-3xl -z-0" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="How We Work"
            title="Our 4-Step Process"
            subtitle="A proven, transparent journey that turns your vision into reality — on time, on budget, and beyond expectations."
            center
          />

          <div className="relative">
            <div className="hidden lg:block absolute top-28 left-0 right-0 h-0.5 bg-slate-200 dark:bg-navy-700 z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8 relative z-10">
              {PROCESS_STEPS.map((step, idx) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: idx * 0.12 }}
                  className="relative"
                >
                  {idx < PROCESS_STEPS.length - 1 && (
                    <div className="hidden lg:flex absolute top-28 -right-3 sm:-right-4 z-20 items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-sm flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    </div>
                  )}

                  <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-navy-800 h-full hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-5 sm:mb-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 sm:rounded-2xl rounded-xl bg-slate-100 dark:bg-navy-800 group-hover:bg-emerald-500 flex items-center justify-center transition-colors duration-300">
                        <step.icon className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <span className="font-serif text-3xl sm:text-4xl sm:text-5xl font-bold text-slate-200 dark:text-navy-700 group-hover:text-emerald-500 transition-colors duration-300 leading-none">
                        {step.step}
                      </span>
                    </div>

                    <div className="relative mb-5 sm:mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full border-4 border-white dark:border-navy-900 shadow-md bg-emerald-500 group-hover:scale-110 transition-transform duration-300 shrink-0" />
                        <div className="flex-1 lg:hidden h-0.5 bg-slate-200 dark:bg-navy-700" />
                      </div>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl text-slate-950 dark:text-white font-bold mb-2 sm:mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-slate-800 dark:text-slate-300 leading-relaxed text-sm sm:text-base font-medium">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-navy-900" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-white mb-4 sm:mb-6 leading-tight">
              Ready to Start Your Project?
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base md:text-xl max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed">
              Whether it&apos;s a custom home, office tower, or community landmark — our team is ready to bring expertise, honesty, and passion to your next build.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full max-w-lg sm:max-w-none mx-auto">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 sm:px-10 sm:py-5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-all duration-300 shadow-xl shadow-emerald-950/30 text-sm sm:text-lg w-full sm:w-auto"
              >
                {t.sections.getFreeConsultation}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 sm:px-10 sm:py-5 bg-white/15 hover:bg-white/25 text-white font-bold rounded-xl border-2 border-white/50 backdrop-blur-sm transition-all duration-300 text-sm sm:text-lg w-full sm:w-auto"
              >
                See Our Work
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
