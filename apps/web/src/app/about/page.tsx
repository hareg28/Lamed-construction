'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Eye, Users, Package, Clock, Heart, Award, Shield, CheckCircle2 } from 'lucide-react';
import { Navbar, Footer } from '@/components/layout';
import SectionHeading from '@/components/public/SectionHeading';
import { cn } from '@/lib/utils';
import { useLanguageStore } from '@/store/languageStore';
import { useTranslation } from '@/lib/i18n';
import type { Certificate } from '@/types';

const HERO_BG = '/assets/images/back image.webp';

const LOGO_IMAGE = '/assets/LAMED-Photoroom.png';
const COMPANY_IMAGE = '/assets/mission.jpg';

const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-1',
    title: 'Project Completion Certificate',
    description: 'Official Project Completion Certificate awarded by Ethiopian Orthodox Church leadership honoring Lamed Construction for outstanding structural craftsmanship and successful project completion.',
    image: '/assets/images/certeficate.jpg',
    issuer: 'Ethiopian Orthodox Tewahedo Church',
    year: '2024',
    createdAt: '',
  },
  {
    id: 'cert-2',
    title: 'Project Completion Certificate',
    description: 'Project Completion and Dedication Certificate presented to Lamed Construction upon the successful finalization, ceremonial blessing, and handover of sanctuary buildings.',
    image: '/assets/images/certeficate2.jpg',
    issuer: 'Archbishops & Synod Council',
    year: '2023',
    createdAt: '',
  },
  {
    id: 'cert-3',
    title: 'Project Visit & Presentation',
    description: 'Official site visit and progress presentation ("Entoto Geletsa") delivered to the Archbishops and religious fathers, reviewing ongoing progress on the Entoto Kidane Mihret 2B+G+5 assembly halls and residential quarters for 80 monks.',
    image: '/assets/images/Entot geletsa 1.png',
    issuer: 'Entoto Kidane Mihret Project Leadership',
    year: '2025',
    createdAt: '',
  },
];

export default function AboutPage() {
  const { language } = useLanguageStore();
  const t = useTranslation(language);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);

  useEffect(() => {
    async function fetchCertificates() {
      try {
        const res = await fetch('/api/certificates');
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setCertificates(data.data);
        }
      } catch {}
    }
    fetchCertificates();
  }, []);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const missionVision = [
    {
      icon: Target,
      title: 'Our Mission',
      description:
        'To deliver exceptional construction services that exceed our clients\' expectations, employing skilled professionals, premium materials, and innovative techniques while maintaining the highest standards of safety, integrity, and sustainability.',
      color: 'bg-amber-500',
      cardBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
      textColor: 'text-white',
      descColor: 'text-amber-50',
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description:
        'To be Ethiopia\'s most trusted and respected construction company, renowned for building iconic structures that shape skylines, strengthen communities, and stand the test of time for generations to come.',
      color: 'bg-emerald-600',
      cardBg: 'bg-gradient-to-br from-emerald-700 to-teal-800',
      textColor: 'text-white',
      descColor: 'text-emerald-50',
    },
  ];

  const whyChooseUs = [
    {
      icon: Users,
      title: 'Expert Team',
      description:
        'Licensed architects, engineers, and craftsmen with decades of combined construction experience across Ethiopia.',
      cardBg: 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/40 dark:to-indigo-950/40',
      iconBg: 'bg-blue-500',
      border: 'border-blue-200 dark:border-blue-800',
    },
    {
      icon: Package,
      title: 'Quality Materials',
      description:
        'We source only the finest, certified materials to ensure every structure meets international quality standards.',
      cardBg: 'bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/40 dark:to-orange-950/40',
      iconBg: 'bg-amber-500',
      border: 'border-amber-200 dark:border-amber-800',
    },
    {
      icon: Clock,
      title: 'On-Time Delivery',
      description:
        'Meticulous project planning and execution ensure that every milestone and final deadline is met without compromise.',
      cardBg: 'bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950/40 dark:to-teal-950/40',
      iconBg: 'bg-emerald-600',
      border: 'border-emerald-200 dark:border-emerald-800',
    },
    {
      icon: Heart,
      title: 'Client-Focused',
      description:
        'Transparent communication, collaborative approach, and dedicated project managers keep you informed every step of the way.',
      cardBg: 'bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-950/40 dark:to-pink-950/40',
      iconBg: 'bg-rose-500',
      border: 'border-rose-200 dark:border-rose-800',
    },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-navy-950 text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative min-h-[60vh] h-auto flex items-center justify-center overflow-hidden bg-navy-950 text-white pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div className="absolute inset-0">
          <img
            src={HERO_BG}
            alt="Lamed Construction"
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
              Who We Are
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white mb-4 sm:mb-6 leading-tight font-bold drop-shadow-md">
              About <span className="text-emerald-400">Lamed Construction</span>
            </h1>
            <p className="text-slate-200 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
              A legacy of craftsmanship, integrity, and innovation — building Ethiopia&apos;s future, one structure at a time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Intro */}
      <section className="py-14 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:gap-20 items-center">
            {/* Left Side: Logo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="relative mt-6 lg:mt-0 flex justify-center items-center"
            >
              <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-emerald-900/10 via-slate-50 to-navy-900/10 dark:from-navy-900 dark:via-navy-900/80 dark:to-navy-950 p-8 sm:p-12 border border-slate-200 dark:border-navy-800 flex items-center justify-center min-h-[320px] sm:min-h-[400px]">
                <img
                  src={LOGO_IMAGE}
                  alt="Lamed Construction logo"
                  className="w-full max-w-xs sm:max-w-sm md:max-w-md h-auto object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute -bottom-5 -left-3 sm:-bottom-6 sm:-left-6 bg-white dark:bg-navy-800 rounded-2xl p-4 sm:p-5 shadow-xl border border-slate-200 dark:border-navy-700 max-w-[200px] sm:max-w-[220px] z-10">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="font-serif text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">11+ Years</div>
                    <div className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">of excellence</div>
                  </div>
                </div>
              </div>
              <div className="hidden sm:block absolute -top-6 -right-6 w-28 h-28 rounded-3xl bg-amber-500/10 border-2 border-amber-500/20 -z-10" />
            </motion.div>

            {/* Right Side: Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <SectionHeading
                eyebrow="Our Story"
                title="Building Trust Since Day One"
              />
              <div className="space-y-4 sm:space-y-5 text-slate-800 dark:text-slate-200 leading-relaxed text-sm sm:text-base font-medium">
                <p>
                  Lamed Construction is a trusted construction company based in Addis Ababa, Ethiopia. We specialize in delivering high-quality residential, commercial, and industrial projects with a commitment to excellence, innovation, and customer satisfaction.
                </p>
                <p>
                  Founded on the principles of honesty and hard work, we have grown into one of the region&apos;s most reliable construction partners. From humble beginnings to landmark projects that define cityscapes, our journey reflects our unwavering dedication to craftsmanship, ethical practices, and the communities we serve.
                </p>
                <p>
                  Every project we undertake is a testament to our promise — <span className="text-slate-950 dark:text-white font-bold">to build honestly</span>. Whether it&apos;s a family home, a corporate headquarters, or a cultural landmark, we pour the same level of care, expertise, and attention to detail into every nail, every beam, and every finished surface.
                </p>
              </div>
              <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-4">
                {[
                  { label: 'Founded', value: '2015' },
                  { label: 'Headquarters', value: 'Addis Ababa' },
                  { label: 'Team Size', value: '80+' },
                ].map((item) => (
                  <div key={item.label} className="text-center p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700">
                    <div className="font-serif text-base sm:text-xl md:text-2xl text-slate-950 dark:text-white font-bold break-words leading-tight">{item.value}</div>
                    <div className="text-[10px] sm:text-xs text-slate-700 dark:text-slate-400 mt-1 font-bold uppercase tracking-wider leading-tight">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-14 sm:py-16 lg:py-24 bg-slate-50 dark:bg-navy-900/60 border-y border-slate-200 dark:border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="Purpose"
            title="Mission & Vision"
            subtitle="The values that guide every project and shape everything we build."
            center
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {missionVision.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={cn(
                  'rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg relative overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1',
                  item.cardBg
                )}
              >
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 blur-2xl bg-white" />
                <div
                  className={cn(
                    'w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-5 sm:mb-7 relative bg-white/20 backdrop-blur-sm'
                  )}
                >
                  <item.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className={cn('font-serif text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 relative leading-tight', item.textColor)}>
                  {item.title}
                </h3>
                <p className={cn('leading-relaxed text-sm sm:text-lg relative', item.descColor)}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-14 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="Differentiators"
            title="Why Choose Us"
            subtitle="Four pillars that set Lamed Construction apart as your trusted building partner."
            center
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {whyChooseUs.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={cn(
                  'relative rounded-2xl p-5 sm:p-8 border hover:shadow-xl transition-all duration-300 group hover:-translate-y-1',
                  feature.cardBg,
                  feature.border
                )}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />
                <div className={cn('w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 sm:mb-6 transition-colors duration-300', feature.iconBg)}>
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="font-serif text-lg sm:text-xl text-slate-950 dark:text-white font-bold mb-2 sm:mb-3 leading-tight">{feature.title}</h3>
                <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed font-medium">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates Gallery */}
      <section className="py-14 sm:py-16 lg:py-24 bg-navy-800 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-emerald-400 mb-2 sm:mb-3">
              {t.about.credentials}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-3 sm:mb-4 leading-tight">
              {t.about.certificates}
            </h2>
            <p className="text-navy-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Recognized for excellence in construction quality, safety practices, and industry leadership across Ethiopia.
            </p>
            <div className="w-16 sm:w-20 h-1 bg-emerald-500 mx-auto mt-4 sm:mt-6 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {certificates.map((cert, idx) => {
              const imageUrl = cert.image;
              return (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  onClick={() => openLightbox(idx)}
                  className="group cursor-pointer flex flex-col h-full bg-navy-900/60 rounded-2xl p-4 border border-emerald-500/20 hover:border-emerald-400/60 transition-all duration-300 hover:-translate-y-1 shadow-xl"
                >
                  <div className="relative rounded-xl overflow-hidden shadow-md border-2 border-emerald-500/30 bg-black/40 aspect-[4/3]">
                    <img
                      src={imageUrl}
                      alt={cert.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="text-white">
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          View Full Image & Details
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex-1 flex flex-col text-left">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                      <h3 className="font-serif text-base sm:text-lg text-white font-bold leading-snug">{cert.title}</h3>
                    </div>
                    {cert.description && (
                      <p className="text-xs sm:text-sm text-navy-200 leading-relaxed line-clamp-3 mt-1 font-normal">
                        {cert.description}
                      </p>
                    )}
                    {cert.issuer && (
                      <div className="mt-auto pt-3 border-t border-navy-700/50 text-[11px] text-emerald-400/90 font-medium">
                        {cert.issuer} {cert.year ? `• ${cert.year}` : ''}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && certificates[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-navy-950/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            onClick={closeLightbox}
          >
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={closeLightbox}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </motion.button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full my-auto"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-500/30 bg-black/40">
                <img
                  src={certificates[lightboxIndex].image}
                  alt={certificates[lightboxIndex].title}
                  className="w-full max-h-[70vh] object-contain mx-auto"
                />
              </div>
              <div className="text-center mt-5 sm:mt-6 px-2">
                <h3 className="font-serif text-xl sm:text-2xl md:text-3xl text-white font-bold mb-2">
                  {certificates[lightboxIndex].title}
                </h3>
                {certificates[lightboxIndex].description && (
                  <p className="text-navy-200 text-sm sm:text-base max-w-2xl mx-auto mb-3 leading-relaxed">
                    {certificates[lightboxIndex].description}
                  </p>
                )}
                {certificates[lightboxIndex].issuer && (
                  <p className="text-emerald-400 text-xs sm:text-sm font-semibold tracking-wide">
                    {certificates[lightboxIndex].issuer} {certificates[lightboxIndex].year ? `• ${certificates[lightboxIndex].year}` : ''}
                  </p>
                )}
                <p className="text-navy-400 text-xs mt-2">
                  Item {lightboxIndex + 1} of {certificates.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
