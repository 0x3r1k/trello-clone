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
import { LogOut, Trello, User, Menu } from "lucide-react";
import ProfileButton from "./profile-button";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar({ session }: { session: Session | null }) {
  const [isOpen, setIsOpen] = useState(false);

  const NavItems = () => (
    <Link
      href="/boards"
      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-100 hover:text-blue-800 transition-colors"
    >
      Boards
    </Link>
  );

  return (
    <nav className="flex justify-between items-center py-3 px-4 bg-slate-100 w-full">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-blue-700 hover:text-blue-800 transition-colors"
        >
          <Trello className="h-6 w-6" />
          <span>Trello App</span>
        </Link>

        {session && (
          <div className="hidden md:flex items-center gap-2">
            <NavItems />
          </div>
        )}
      </div>

      {session ? (
        <>
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTitle>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
              </SheetTitle>

              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-4 mt-6">
                  <NavItems />
                </div>
              </SheetContent>
            </Sheet>
          </div>

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
        </>
      ) : (
        <div className="hidden md:flex items-center gap-2">
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
