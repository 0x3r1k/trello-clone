"use client";

import Link from "next/link";

import { Session } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import LogoutButton from "@/components/logout-button";
import { LogOut, Trello, User } from "lucide-react";
import ProfileButton from "./profile-button";

export default function Navbar({ session }: { session: Session | null }) {
  return (
    <nav className="flex justify-between items-center py-3 px-4 fixed top-0 left-0 right-0 z-50 bg-slate-100">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-blue-700 hover:text-blue-800 transition-colors"
        >
          <Trello className="h-6 w-6" />
          <span>Trello App</span>
        </Link>

        <Link
          href="/boards"
          className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-800 transition-colors"
        >
          Boards
        </Link>
      </div>

      {session ? (
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src={session.user.image || undefined}
                  alt={session.user.name || "User avatar"}
                />

                <AvatarFallback className="bg-primary text-white">
                  {session.user.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <ProfileButton>
                <User className="h-4 w-4" />
                <span>Profile</span>
              </ProfileButton>

              <LogoutButton>
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </LogoutButton>
            </DropdownMenuContent>
          </DropdownMenu>
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
