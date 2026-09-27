import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { auth } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata = {
  title: "Furniture Shop | Mobilje Elegante",
  description: "Mobilje dhe pajisje shtëpie premium, të zgjedhura me kujdes.",
};

export default async function RootLayout({ children }) {
  const session = await auth();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <SessionProvider session={session}>
          <Navbar />

          <main className="min-h-screen">{children}</main>

          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
