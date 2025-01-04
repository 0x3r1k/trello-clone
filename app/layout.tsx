import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Trello Clone",
  description: "A simple Trello App clone, built with Next.js and shadcn UI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster />

        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
