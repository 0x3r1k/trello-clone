"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function LogoutButton({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleLogout = async () => {
    try {
      setPending(true);

      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/auth/login");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setPending(false);
    }
  };

  return (
    <DropdownMenuItem onClick={handleLogout} disabled={pending}>
      {children}
    </DropdownMenuItem>
  );
}
