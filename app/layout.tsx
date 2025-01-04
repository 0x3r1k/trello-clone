import type { Metadata } from "next";
import "./globals.css";

// import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";

/* import { auth } from "@/lib/auth";
import { headers } from "next/headers"; */

export const metadata: Metadata = {
  title: "Trello Clone",
  description: "A simple Trello App clone, built with Next.js and shadcn UI.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /* const session = await auth.api.getSession({
    headers: await headers(),
  }); */

  return (
    <html lang="en">
      <body>
        <Toaster />

        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
