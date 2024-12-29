"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import LoadingButton from "@/components/loading-button";

export default function LogoutButton() {
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
    <LoadingButton onClick={handleLogout} pending={pending}>
      Logout
    </LoadingButton>
  );
}
