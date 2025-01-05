"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function ThemeButton() {
  const { theme, systemTheme, setTheme } = useTheme();

  if (theme === "dark") {
    return (
      <DropdownMenuItem onClick={() => setTheme("light")}>
        <Sun className="w-5 h-5" />
        Light Mode
      </DropdownMenuItem>
    );
  } else if (theme === "light") {
    return (
      <DropdownMenuItem onClick={() => setTheme("dark")}>
        <Moon className="w-5 h-5" />
        Dark Mode
      </DropdownMenuItem>
    );
  } else if (systemTheme === "dark") {
    return (
      <DropdownMenuItem onClick={() => setTheme("light")}>
        <Sun className="w-5 h-5" />
        Light Mode
      </DropdownMenuItem>
    );
  } else if (systemTheme === "light") {
    return (
      <DropdownMenuItem onClick={() => setTheme("dark")}>
        <Moon className="w-5 h-5" />
        Dark Mode
      </DropdownMenuItem>
    );
  }
}
