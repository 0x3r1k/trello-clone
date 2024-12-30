"use client";

import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/loading-button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema } from "@/lib/zod";
import { z } from "zod";

import { Session } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function ProfileForm({ session }: { session: Session }) {
  const router = useRouter();
  const { toast } = useToast();

  const [pending, setPending] = useState(false);
  const [passwordPending, setPasswordPending] = useState(false);

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session.user.name ?? "",
      email: session.user.email,
      image: session.user.image ?? "",
    },
  });

  const onSubmit = async (data: z.infer<typeof updateProfileSchema>) => {
    setPending(true);

    const { error } = await authClient.updateUser({
      name: data.name,
      image: data.image,
    });

    if (error) {
      toast({
        title: "Something went wrong",
        description: error.message ?? "Something went wrong.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated.",
      });

      router.refresh();
    }

    setPending(false);
  };

  const resetPassword = async () => {
    setPasswordPending(true);

    const { error } = await authClient.forgetPassword({
      email: session.user.email,
      redirectTo: "/auth/change-password",
    });

    if (error) {
      toast({
        title: "Something went wrong",
        description: error.message ?? "Something went wrong.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password reset",
        description: "Check your email to reset your password.",
      });
    }

    setPasswordPending(false);
  };

  return (
    <>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {["name", "email", "image"].map((field) => (
            <FormField
              control={form.control}
              key={field}
              name={field as keyof z.infer<typeof updateProfileSchema>}
              render={({ field: fieldProps }) => (
                <FormItem>
                  <FormLabel>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </FormLabel>

                  <FormControl>
                    <Input
                      type={field === "email" ? "email" : "text"}
                      readOnly={field === "email"}
                      placeholder={`Enter your ${field}`}
                      autoComplete="off"
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <LoadingButton pending={pending}>Update settings</LoadingButton>
        </form>
      </Form>

      <div className="mt-4">
        <LoadingButton
          pending={passwordPending}
          onClick={resetPassword}
          variant="destructive"
        >
          Reset password
        </LoadingButton>
      </div>
    </>
  );
}
