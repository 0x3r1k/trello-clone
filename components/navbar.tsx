"use client";

import Link from "next/link";

import { Session } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/logout-button";

export default function Navbar({ session }: { session: Session | null }) {
  return (
    <nav className="flex justify-between items-center py-3 px-4 fixed top-0 left-0 right-0 z-50 bg-slate-100">
      <Link href="/" className="text-xl font-bold">
        Trello App
      </Link>

      {session ? (
        <div className="flex items-center gap-2">
          <LogoutButton />
        </div>
      ) : (
        <div className="flex gap-2 justify-center">
          <Link href="/auth/login">
            <Button variant="default">Sign In</Button>
          </Link>

          <Link href="/auth/register">
            <Button variant="default">Sign Up</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
