# 🎓 Exit Exam App

**Ethiopia's most comprehensive university exit exam preparation platform.**

> Prepare • Practice • Pass

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-green?logo=supabase)](https://supabase.com)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🏠 **Splash Screen** | Animated blue gradient with graduation illustration |
| 🔐 **Authentication** | Email/Phone login, Sign Up with OTP verification |
| 📊 **Dashboard** | Personalized progress, readiness score, announcements |
| 📚 **Practice** | 18+ subjects, topic/chapter/difficulty-based questions |
| ⏱️ **Mock Tests** | University, Departmental, National exit exam simulation |
| 📈 **Analytics** | Weekly/Monthly progress charts, subject performance |
| 🤖 **AI Assistant** | AI-powered study help and explanations |
| 👤 **Profile** | Edit profile, theme settings, notifications |
| 🔒 **Secure Exam Mode** | Copy/paste/right-click disabled during exams |
| 🌙 **Dark Mode** | Full dark/light/system theme support |
| 📱 **Mobile First** | Responsive for mobile, tablet, and desktop |
| 🏫 **Admin Panel** | Manage users, questions, exams, notifications |

---

## 🏛️ Supported Universities

Includes all 44+ accredited Ethiopian universities including:
- Addis Ababa University
- Jimma University
- Bahir Dar University
- Mekelle University
- Hawassa University
- And 40+ more...

## 📖 Supported Departments

49 departments including Computer Science, Medicine, Engineering, Law, Economics, Nursing, Accounting, and more.

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/ecoders1/exam.git
cd exam
npm install --legacy-peer-deps
```

### 2. Set up environment variables
```bash
cp .env.local .env.local
# Fill in your Supabase credentials
```

Required variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Set up Supabase database
```bash
# In Supabase Dashboard → SQL Editor
# Run: supabase/schema.sql
```

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── (main)/          # Protected routes (dashboard, practice, quiz...)
│   ├── admin/           # Admin dashboard
│   ├── auth/            # Login, signup, forgot-password
│   ├── api/             # API routes (auth, questions, results, AI, admin)
│   └── splash/          # Splash screen
├── components/
│   ├── ai/              # AI Study Assistant
│   ├── admin/           # Admin dashboard components
│   ├── auth/            # Login/Signup forms
│   ├── dashboard/       # Home dashboard
│   ├── layout/          # TopBar, BottomNav
│   ├── mock-test/       # Mock test selection
│   ├── practice/        # Practice subject browser
│   ├── profile/         # User profile
│   ├── providers/       # ThemeProvider
│   ├── quiz/            # Full quiz interface
│   ├── results/         # Analytics & results
│   └── splash/          # Splash screen
├── lib/
│   ├── constants.ts     # Universities, departments, subjects
│   ├── store.ts         # Zustand state management
│   ├── supabase.ts      # Supabase client
│   ├── supabase-server.ts # Server-side Supabase client
│   ├── types.ts         # TypeScript types
│   └── utils.ts         # Utility functions
└── supabase/
    └── schema.sql       # Full database schema
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript 5 |
| Styling | Tailwind CSS v4 |
| State | Zustand (with localStorage persistence) |
| Backend | Supabase (PostgreSQL + Auth + Edge Functions) |
| Icons | Lucide React |
| Deployment | Vercel |

---

## 📱 Mobile Support

- Progressive Web App (PWA) ready
- Safe area support for iOS notch
- Touch-optimized interactions
- Responsive for all screen sizes

---

## 🔒 Security

- JWT authentication via Supabase
- Row Level Security (RLS) on all tables
- Anti-cheating measures in exam mode
- Encrypted passwords
- OTP email/phone verification
- Security headers via Vercel config

---

## 🚀 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ecoders1/exam)

Add these environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## 📄 License

MIT © 2024 Exit Exam App Team
