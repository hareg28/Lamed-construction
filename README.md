# 🏗️ Lamed Construction Platform

A modern, high-performance monorepo web platform and content management suite for **Lamed Construction** (General Contractor & Construction Engineering). Built with **Next.js 14 (App Router)**, **Turborepo**, **Tailwind CSS**, and integrated with **Google Gemini AI**, **Resend Email**, and **Telegram Bot** notifications.

---

## 🚀 Features

### 🌐 Public Web Portal (`@lamed/web`)
- **Hero & Brand Experience**: Engaging UI with smooth micro-animations powered by Framer Motion.
- **Projects Portfolio**: Filterable project showcase (Residential, Commercial, Mixed-Use, Special, Renovation) with live progress tracking, timelines, and gallery views.
- **Interactive AI Assistant**: Real-time consultation chat widget powered by **Google Gemini 3.7 Flash** to answer client queries about construction services, estimations, and project workflows.
- **Contact & Inquiry System**: Dynamic contact form with automated multi-channel alerts:
  - 📩 Email notifications via **Resend**
  - 📲 Instant alerts via **Telegram Bot**
- **News & Insights**: Company updates, safety reports, and industry publications.
- **Certificates & Accreditations**: Verified credentials and compliance badges display.

### 🛡️ Admin Dashboard (`@lamed/admin`)
- **Project Management**: Create, edit, and track projects with milestone updates and gallery image uploads.
- **Inquiry Inbox**: Review, categorize, and manage inbound customer leads and messages.
- **News Management**: Author, format, and publish company news and announcements.
- **Certificates Management**: Manage company licenses, safety certifications, and accolades.
- **Settings & Analytics**: Centralized platform configuration.

---

## 🛠️ Architecture & Tech Stack

```
lamed-monorepo/
├── apps/
│   ├── web/          # Public-facing Next.js 14 web application (Port: 3000)
│   └── admin/        # Next.js 14 Admin dashboard (Port: 3001)
├── packages/
│   ├── shared/       # Shared TypeScript types, data interfaces, and utilities
│   └── config/       # Shared Tailwind CSS and ESLint configurations
├── turbo.json        # Turborepo build pipeline configuration
└── package.json      # Monorepo root package and workspace scripts
```

- **Core**: [Next.js 14](https://nextjs.org/) (App Router, Server Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Icons & UI**: [Lucide React](https://lucide.dev/), [Sonner](https://sonner.emilkowal.ski/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
- **Monorepo Engine**: [Turborepo](https://turbo.build/repo)
- **AI Integration**: [Google Gemini API](https://ai.google.dev/) (`gemini-3.7-flash`)
- **Notifications**: [Resend](https://resend.com/), [Telegram Bot API](https://core.telegram.org/bots/api)

---

## 📦 Getting Started

### Prerequisites
- **Node.js**: `>= 18.0.0`
- **npm**: `>= 10.0.0` (or `pnpm` / `yarn`)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/hareg28/Lamed-construction.git
cd Lamed-construction
npm install
```

### 2. Environment Variables Configuration
Copy the sample environment file to `.env.local` in the root directory (or respective app directories):

```bash
cp .env.example .env.local
```

Fill in your configuration keys:
```env
# Telegram Bot Integration (Optional for instant mobile notifications)
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# Resend Email Integration (For contact form email delivery)
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL_TO=info@lamedconstruction.com
CONTACT_EMAIL_FROM=onboarding@resend.dev

# Google Gemini AI Assistant Integration
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-3.7-flash
```

---

## 💻 Development & Scripts

Run workspaces concurrently using Turborepo or target individual apps:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Run all applications (`web` & `admin`) concurrently |
| `npm run dev:web` | Run public web portal only on `http://localhost:3000` |
| `npm run dev:admin` | Run admin dashboard only on `http://localhost:3001` |
| `npm run build` | Build all applications and packages |
| `npm run build:web` | Build only the web application |
| `npm run build:admin` | Build only the admin application |
| `npm run lint` | Run ESLint across all workspaces |
| `npm run typecheck` | Run TypeScript validation across all workspaces |

---

## 🔒 Security & Best Practices

- Never commit `.env.local` or sensitive API keys to source control.
- Ensure all admin endpoints and mutations validate input schemas using Zod.
- Configure proper CORS and rate limits on API routes when deploying to production.

---

## 🚀 Deployment

The monorepo is optimized for deployment on [Vercel](https://vercel.com/):

1. **Deploying Web**: Set Root Directory to `apps/web` (or root with Vercel monorepo detection enabled).
2. **Deploying Admin**: Set Root Directory to `apps/admin`.
3. Add environment variables configured in `.env.local` to each Vercel project's settings.

---

## 📄 License

This project is proprietary and maintained for **Lamed Construction**. All rights reserved.
