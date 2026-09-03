"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Linkedin,
  Instagram,
  Clock,
} from "lucide-react";
import logoImage from "../../../assets/LAMED-Photoroom.png";
import qrCodeImage from "../../../assets/images/lamed_qrcode.png";
import { useLanguageStore } from "@/store/languageStore";
import { useTranslation } from "@/lib/i18n";
const BG = "#3ecf8e";
const BG_DARK = "#2ab87a";
const BORDER = "#2ab87a";

const contactNumbers = [
  { number: "+251 913 59 70 51", name: "Eliyas Seyoum" },
  { number: "+251 992 861848", name: "Yeshak seyoum" },
  { number: "+251 923 36 64 84", name: "Yosef Fikru" },

];

const socialLinks = [
  { href: "https://facebook.com", label: "Facebook", icon: Facebook },
  { href: "https://linkedin.com", label: "LinkedIn", icon: Linkedin },
  { href: "https://instagram.com", label: "Instagram", icon: Instagram },
];

export default function Footer() {
  const { language } = useLanguageStore();
  const t = useTranslation(language);

  const quickLinks = [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/services", label: t.nav.services },
    { href: "/projects", label: t.nav.projects },
    { href: "/news", label: t.nav.news },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <footer style={{ backgroundColor: BG, color: "#d1fae5", borderTop: `1px solid ${BORDER}` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* LOGO + tagline */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="relative hover:scale-105 transition-transform duration-200"
                style={{ width: "280px", height: "100px" }}
              >
                <Image
                  src={logoImage}
                  alt="Lamed Construction PLC Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <p style={{ fontSize: "0.875rem", color: "#a7f3d0", lineHeight: "1.6" }}>
              Building excellence in Addis Ababa with premium residential,
              commercial, and mixed-use development projects.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: "#ffffff", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{ fontSize: "0.875rem", color: "#a7f3d0" }}
                    className="hover:!text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: "#ffffff", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>
              Contact
            </h4>
            <ul className="space-y-4">
              {contactNumbers.map((contact) => (
                <li key={contact.number} className="flex items-start gap-3">
                  <Phone className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#34d399" }} />
                  <div>
                    <a
                      href={`tel:${contact.number.replace(/\s/g, "")}`}
                      style={{ fontSize: "0.875rem", color: "#d1fae5", display: "block" }}
                      className="hover:!text-white transition-colors"
                    >
                      {contact.number}
                    </a>
                    <span style={{ fontSize: "0.75rem", color: "#6ee7b7" }}>{contact.name}</span>
                  </div>
                </li>
              ))}
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#34d399" }} />
                <a
                  href="mailto:lamedconstructionbc1@gmail.com"
                  style={{ fontSize: "0.875rem", color: "#d1fae5" }}
                  className="hover:!text-white transition-colors break-all"
                >
                  lamedconstructionbc1@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#34d399" }} />
                <a
                  href="https://maps.google.com/?q=Addis+Ababa"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "0.875rem", color: "#d1fae5" }}
                  className="hover:!text-white transition-colors"
                >
                  Addis Ababa, Ethiopia
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us + Working Hours */}
          <div>
            <h4 style={{ color: "#ffffff", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>
              Follow Us
            </h4>
            <div className="flex gap-3 mb-8">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200"
                    style={{ backgroundColor: "#065f46", color: "#a7f3d0", border: "1px solid #047857" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#059669"; (e.currentTarget as HTMLElement).style.color = "#ffffff"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "#065f46"; (e.currentTarget as HTMLElement).style.color = "#a7f3d0"; }}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>

            <h4 style={{ color: "#ffffff", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
              Working Hours
            </h4>
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#34d399" }} />
              <div>
                <p style={{ fontSize: "0.875rem", color: "#d1fae5" }}>Mon - Sat</p>
                <p style={{ fontSize: "0.875rem", color: "#a7f3d0" }}>8:00 AM - 11:00 PM</p>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div>
            <h4 style={{ color: "#ffffff", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>
              Scan to Connect
            </h4>
            <div className="bg-white p-3 rounded-xl inline-block mb-4" style={{ border: "1px solid #34d399" }}>
              <div className="relative w-32 h-32">
                <Image
                  src={qrCodeImage}
                  alt="Lamed Construction PLC QR Code"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#6ee7b7", maxWidth: "160px" }}>
              Scan the QR code to quickly save our contact information and access our services.
            </p>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: `1px solid ${BORDER}`, backgroundColor: BG_DARK }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p style={{ fontSize: "0.875rem", color: "#6ee7b7" }}>
            © {new Date().getFullYear()} Lamed Construction PLC. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" style={{ fontSize: "0.875rem", color: "#6ee7b7" }} className="hover:!text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" style={{ fontSize: "0.875rem", color: "#6ee7b7" }} className="hover:!text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
