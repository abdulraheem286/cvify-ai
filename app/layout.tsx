import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
  Poppins,
  Roboto,
  Lora,
  Source_Serif_4,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Fonts the user can pick from in the CV customization panel.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const roboto = Roboto({ variable: "--font-roboto", subsets: ["latin"], weight: ["400", "500", "700"] });
const lora = Lora({ variable: "--font-lora", subsets: ["latin"] });
const sourceSerif = Source_Serif_4({ variable: "--font-source-serif", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://cvifyai.vercel.app"),
  title: {
    default: "CVify AI — Free AI Resume & CV Builder | Build a Pro CV in Minutes",
    template: "%s | CVify AI",
  },
  description:
    "CVify AI is a free AI resume builder. Paste rough notes and get a polished, professional CV in minutes — or fill in the details yourself. Beautiful templates and instant PDF download. No sign-up needed to start.",
  keywords: [
    "AI resume builder",
    "free CV maker",
    "AI CV generator",
    "resume builder online",
    "professional CV template",
    "create resume with AI",
    "free resume builder",
    "online CV maker",
    "CV generator",
  ],
  applicationName: "CVify AI",
  alternates: { canonical: "/" },
  openGraph: {
    title: "CVify AI — Free AI Resume & CV Builder",
    description:
      "Build a polished, professional CV in minutes. Free AI resume builder with beautiful templates and instant PDF download.",
    url: "https://cvifyai.vercel.app",
    siteName: "CVify AI",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CVify AI — Free AI Resume & CV Builder",
    description:
      "Build a polished, professional CV in minutes. Free AI resume builder with beautiful templates and instant PDF download.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${poppins.variable} ${roboto.variable} ${lora.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
