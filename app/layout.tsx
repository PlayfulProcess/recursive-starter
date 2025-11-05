import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider, Header, Footer } from "@playful_process/components";

export const metadata: Metadata = {
  title: "Recursive Creator",
  description: "Story publisher, playlist wrapper, and creator hub for Recursive.eco",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
