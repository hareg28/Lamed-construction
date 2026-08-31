"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  User,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import {
  cn,
  formatDate,
  statusLabel,
  typeLabel,
  statusColor,
} from "@/lib/utils";
import { projects } from "@/lib/seedData";
import Breadcrumb from "@/components/public/Breadcrumb";
import Timeline from "@/components/public/Timeline";
import type { Project } from "@/lib/seedData";
import { Navbar, Footer } from "@/components/layout";

interface ProjectDetailPageProps {
  params: { id: string };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = projects.find((p) => p.id === params.id) as Project | undefined;

  if (!project) {
    notFound();
  }

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const allImages = project.gallery.length > 0 ? project.gallery : [project.coverImage];
  const currentImage = allImages[activeImageIndex];

  const goToPrev = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setActiveImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-6">
        <Breadcrumb
          items={[
            { label: "Projects", href: "/projects" },
            { label: project.title },
          ]}
        />
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-card border border-navy-100 mb-4 bg-white">
              <div className="relative aspect-[16/10]">
                <img
                  src={currentImage}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={goToPrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-navy-700 hover:bg-emerald-500 hover:text-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-navy-700 hover:bg-emerald-500 hover:text-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {allImages.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-3">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={cn(
                      "relative rounded-lg overflow-hidden aspect-square sm:aspect-[4/3] border-2 transition-all",
                      idx === activeImageIndex
                        ? "border-emerald-500 shadow-lg shadow-emerald-500/20"
                        : "border-transparent opacity-70 hover:opacity-100"
                    )}
                  >
                    <img
                      src={img}
                      alt={`${project.title} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-card border border-navy-100 dark:border-navy-800 p-6 sm:p-8 sticky top-28">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border",
                    statusColor(project.status)
                  )}
                >
                  {statusLabel(project.status)}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-navy-700">
                  {typeLabel(project.type)}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white font-serif mb-5 leading-tight">
                {project.title}
              </h1>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-400 font-bold mb-0.5">
                      Client
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {project.clientName}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-slate-600 dark:text-slate-400 font-bold mb-0.5">
                      Location
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {project.location}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25"
                >
                  <MessageSquare className="w-4 h-4" />
                  Discuss This Project
                </Link>
                <Link
                  href="/projects"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 text-slate-900 font-bold hover:border-emerald-400 hover:bg-slate-50 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to All Projects
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-navy-900 rounded-2xl shadow-card border border-slate-200 dark:border-navy-800 p-6 sm:p-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-1 rounded-full bg-emerald-500" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white font-serif">
              Project Description
            </h2>
          </div>
          <div className="prose prose-slate max-w-none">
            {project.description.split("\n\n").map((paragraph, idx) => (
              <p
                key={idx}
                className="text-slate-800 leading-relaxed text-base sm:text-lg mb-4 last:mb-0 font-medium"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>
      </section>

      {project.updates && project.updates.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-1 rounded-full bg-emerald-500" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 dark:text-white font-serif">
                Project Progress & Updates
              </h2>
              <div className="w-12 h-1 rounded-full bg-emerald-500" />
            </div>
            <p className="text-slate-700 dark:text-slate-300 font-medium max-w-2xl mx-auto">
              Follow the journey of this project from inception to completion.
            </p>
          </motion.div>

          <Timeline items={project.updates} />
        </section>
      )}

      <section className="relative bg-gradient-to-br from-navy-800 via-navy-900 to-navy-900 py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url(/assets/images/back_lamed.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-navy-900" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
              <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white font-serif mb-4 sm:mb-5 leading-tight">
              Interested in a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">
                similar project?
              </span>
            </h2>
            <p className="text-base sm:text-lg text-navy-200 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Our team of construction experts is ready to bring your vision to
              life. Get in touch today for a consultation.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full max-w-lg sm:max-w-none mx-auto">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 w-full sm:w-auto"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                Contact Us Now
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <a
                href="tel:+251911123456"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl border-2 border-white/20 text-white font-bold hover:bg-white/10 transition-all w-full sm:w-auto"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                Call +251 911 123 456
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
