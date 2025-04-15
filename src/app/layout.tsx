import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar, NavLink } from "@/components/navbar";
import Footer from "@/components/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Home } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IIITD Resource Hub",
  description: "Find PYQs, Quizes, Tutorials and Notes across IIITD.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Navbar>
            <NavLink href="/">
              <Home />
            </NavLink>
            <NavLink href="/resources">Resources</NavLink>
            <NavLink href="/blogs">Blogs</NavLink>
            <NavLink href="/questions">Q&amp;A</NavLink>
          </Navbar>
          {children}
          <Toaster />
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
