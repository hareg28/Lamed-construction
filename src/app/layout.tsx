import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const AIChatWidget = dynamic(() => import("@/components/ai/AIChatWidget"), {
  ssr: false,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lamed Construction | Building Excellence in Addis Ababa",
    template: "%s | Lamed Construction",
  },
  description:
    "Lamed Construction is a premier construction company in Addis Ababa, Ethiopia specializing in residential, commercial, and mixed-use development projects with unmatched craftsmanship.",
  keywords: [
    "construction",
    "Addis Ababa",
    "Ethiopia",
    "building",
    "residential",
    "commercial",
    "contractor",
    "Lamed",
    "Lamed Construction",
    "real estate",
    "development",
  ],
  authors: [{ name: "Lamed Construction" }],
  creator: "Lamed Construction",
  publisher: "Lamed Construction",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lamedconstruction.com",
    title: "Lamed Construction | Building Excellence in Addis Ababa",
    description:
      "Premier construction company in Addis Ababa, Ethiopia specializing in residential, commercial, and mixed-use development projects.",
    siteName: "Lamed Construction",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lamed Construction",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lamed Construction | Building Excellence in Addis Ababa",
    description:
      "Premier construction company in Addis Ababa, Ethiopia specializing in residential, commercial, and mixed-use development projects.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} scroll-smooth`}
    >
      <body className={`${inter.className} antialiased bg-white text-navy-800 dark:bg-navy-950 dark:text-navy-100`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('lamed-theme');
                  var langStored = localStorage.getItem('lamed-lang');
                  var theme = 'light';
                  if (stored) {
                    try {
                      var parsed = JSON.parse(stored);
                      theme = (parsed && parsed.state && parsed.state.theme) ? parsed.state.theme : stored;
                    } catch(e) {
                      theme = stored;
                    }
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                  document.documentElement.classList.toggle('dark', theme === 'dark');
                  if (langStored) {
                    try {
                      var parsedLang = JSON.parse(langStored);
                      var lang = (parsedLang && parsedLang.state && parsedLang.state.language) ? parsedLang.state.language : langStored;
                      document.documentElement.lang = lang;
                    } catch(e) {
                      document.documentElement.lang = langStored;
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {children}
        <AIChatWidget />
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              fontFamily: "Inter, sans-serif",
            },
          }}
        />
      </body>
    </html>
  );
}
