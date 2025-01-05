"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { IconLayoutBoard } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Boards",
    icon: IconLayoutBoard,
    href: "/boards",
  },
];

export function NavMain() {
  const pathname = usePathname();

  return (
    <SidebarMenu className="mb-2">
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <Link href={item.href}>
            <SidebarMenuButton
              tooltip={item.title}
              isActive={pathname === item.href}
            >
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
