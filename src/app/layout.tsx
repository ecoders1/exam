import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Exit Exam App - Prepare • Practice • Pass",
    template: "%s | Exit Exam App",
  },
  description:
    "Ethiopian Exit Exam Preparation Application. Practice, take mock tests, and track your progress for university exit exams.",
  keywords: [
    "Ethiopian exit exam",
    "university exit exam",
    "exam preparation",
    "practice questions",
    "mock test",
    "Ethiopia education",
  ],
  authors: [{ name: "Exit Exam App Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Exit Exam App",
  },
  openGraph: {
    type: "website",
    locale: "en_ET",
    url: "https://exitexamapp.et",
    siteName: "Exit Exam App",
    title: "Exit Exam App - Prepare • Practice • Pass",
    description: "Ethiopian Exit Exam Preparation Application",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1d4ed8" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
