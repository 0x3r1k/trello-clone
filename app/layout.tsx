import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/app/providers";
import "./globals.css";

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
        <Providers>
          <Toaster />

          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
