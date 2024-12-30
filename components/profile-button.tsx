"use client";

import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function ProfileButton({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={() => router.push("/profile")}
    >
      {children}
    </DropdownMenuItem>
  );
}
