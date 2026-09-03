'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Home,
  Building2,
  Hammer,
  Layers,
  Church,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  Users,
  Calendar,
} from 'lucide-react';
import { Navbar, Footer } from '@/components/layout';
import AnimatedCounter from '@/components/public/AnimatedCounter';
import SectionHeading from '@/components/public/SectionHeading';
import ServicesCard from '@/components/public/ServicesCard';
import ProjectCard from '@/components/public/ProjectCard';
import seedData from '@/lib/seedData';
import { cn } from '@/lib/utils';
import logoImage from '../../assets/LAMED-Photoroom.png';

import { useLanguageStore } from '@/store/languageStore';
import { useTranslation } from '@/lib/i18n';

const HERO_IMAGE = '/assets/images/back_lamed.jpg';

const FILTERS = ['All', 'Residential', 'Commercial', 'Renovation', 'Special'];

export default function HomePage() {
  const { language } = useLanguageStore();
  const t = useTranslation(language);
  const [activeFilter, setActiveFilter] = useState('All');

  const featuredProjects = seedData.projects.slice(0, 3);

  const stats = [
    {
      icon: CheckCircle2,
      label: 'Projects Completed',
      value: 30,
      suffix: '+',
    },
    {
      icon: Briefcase,
      label: 'Ongoing Projects',
      value: 6,
      suffix: '',
    },
    {
      icon: Users,
      label: 'Happy Clients',
      value: 40,
      suffix: '+',
    },
    {
      icon: Calendar,
      label: 'Years Experience',
      value: 11,
      suffix: '+',
    },
  ];

  const services = [
    { icon: Home, title: 'Residential', description: 'Custom homes, apartments, and housing complexes built with integrity.' },
    { icon: Building2, title: 'Commercial', description: 'Office towers, retail centers, hotels, and mixed-use developments.' },
    { icon: Hammer, title: 'Renovation', description: 'Breathing new life into existing structures with modern upgrades.' },
    { icon: Layers, title: 'Finishing', description: 'Premium interior and exterior finishing for a polished final look.' },
    { icon: Church, title: 'Special Buildings', description: 'Churches, cultural centers, and landmark structures.' },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-navy-950 text-slate-900 dark:text-navy-100 transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex min-h-[85vh] sm:min-h-screen items-center justify-center overflow-hidden pt-24 pb-16 bg-navy-950 text-white">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Construction site"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/85" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 text-center py-8">
          {/* LOGO */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-4 flex justify-center"
          >
            <div className="relative h-28 w-64 sm:h-36 sm:w-80 md:h-44 md:w-[22rem] overflow-hidden">
              <Image
                src={logoImage}
                alt="Lamed Construction PLC logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* COMPANY MOTTO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-4 sm:mb-6"
          >
            <p
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-[0.15em] font-serif leading-tight"
              style={{ color: '#fde047', textShadow: '0 2px 16px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,1)' }}
            >
              {t.hero.tagline}
            </p>
          </motion.div>

          {/* BADGE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="mb-4 sm:mb-6 inline-block rounded-full border border-sky-300/60 bg-sky-500/20 px-5 py-2 text-xs sm:text-sm md:text-base font-bold text-sky-100 shadow-lg backdrop-blur-sm" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
              {t.hero.badge}
            </span>
          </motion.div>



          {/* CTA BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 mt-4 sm:mt-6 w-full max-w-lg sm:max-w-none mx-auto"
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-7 py-4 font-bold text-white transition-all duration-300 shadow-xl shadow-emerald-500/30 text-base sm:text-lg w-full sm:w-auto"
            >
              {t.hero.cta_contact}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl border border-white/30 backdrop-blur-md transition-all duration-300 text-base sm:text-lg w-full sm:w-auto"
            >
              {t.hero.cta_projects}
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 0.8, delay: 1, repeat: Infinity, repeatDelay: 1 }}
          className="hidden sm:block absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-slate-200/70 text-center hover:border-emerald-200 transition-all"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-5">
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-emerald-600" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-slate-900 font-bold mb-1 sm:mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-slate-600 text-xs sm:text-sm font-medium leading-tight">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="What We Do"
            title="Our Core Services"
            subtitle="From concept to completion, we deliver excellence across every aspect of construction."
            center
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6">
            {services.map((service) => (
              <ServicesCard
                key={service.title}
                icon={service.icon}
                title={service.title}
                description={service.description}
              />
            ))}
          </div>
          <div className="text-center mt-10 sm:mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold text-base sm:text-lg"
            >
              Explore All Services
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 sm:py-20 lg:py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            eyebrow="Portfolio"
            title="Featured Projects"
            subtitle="A selection of our finest work across residential, commercial, and special construction."
            center
          />

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  'px-3.5 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300',
                  activeFilter === filter
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-semibold'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-500 hover:text-emerald-600'
                )}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="text-center mt-10 sm:mt-14">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-600/25 text-sm sm:text-base w-full sm:w-auto max-w-xs mx-auto"
            >
              View All Projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 border-t border-emerald-200/60">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block w-16 sm:w-20 h-1 bg-emerald-600 rounded-full mb-6 sm:mb-8" />
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-6xl text-slate-900 font-bold mb-4 sm:mb-6 leading-tight">
              Have a Project in Mind?
            </h2>
            <p className="text-slate-700 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed font-medium">
              Let&apos;s build something extraordinary together. Our team is ready to bring your vision to life with expertise and dedication.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 sm:px-10 sm:py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all duration-300 shadow-xl shadow-emerald-600/20 text-sm sm:text-lg w-full sm:w-auto max-w-xs mx-auto"
            >
              Get a Free Consultation
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
