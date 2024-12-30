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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import LoadingButton from "@/components/loading-button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema } from "@/lib/zod";
import { z } from "zod";

import { Session } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { IconBrandGmail } from "@tabler/icons-react";

export function ProfileForm({ session }: { session: Session }) {
  const router = useRouter();
  const { toast } = useToast();

  const [pending, setPending] = useState(false);
  const [passwordPending, setPasswordPending] = useState(false);
  const [emailPending, setEmailPending] = useState(false);

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

  const onResendVerificationEmail = async () => {
    setEmailPending(true);

    const { error } = await authClient.sendVerificationEmail({
      email: session.user.email,
    });

    if (error) {
      toast({
        title: "Something went wrong",
        description: error.message ?? "Something went wrong.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Verification email sent",
        description: "A verification email has been sent to your inbox.",
      });
    }

    setEmailPending(false);
  };

  return (
    <>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {["name", "email", "image"].map((field) => (
            <div
              className={
                field === "email"
                  ? "flex flex-row justify-center items-end space-x-2 w-full"
                  : ""
              }
              key={field}
            >
              <FormField
                control={form.control}
                name={field as keyof z.infer<typeof updateProfileSchema>}
                render={({ field: fieldProps }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </FormLabel>

                    <FormControl>
                      <Input
                        type={
                          field === "email"
                            ? "email"
                            : field === "image"
                            ? "url"
                            : "text"
                        }
                        readOnly={field === "email"}
                        disabled={session.user.emailVerified === false}
                        placeholder={`Enter your ${field}`}
                        autoComplete="off"
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {field === "email" && session.user.emailVerified === false && (
                <TooltipProvider>
                  <Tooltip open>
                    <TooltipTrigger asChild>
                      <LoadingButton
                        type="button"
                        onClick={onResendVerificationEmail}
                        pending={emailPending}
                        className={false}
                      >
                        <IconBrandGmail className="w-6 h-6" />
                      </LoadingButton>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Resend verification mail</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          ))}

          {session.user.emailVerified === true && (
            <LoadingButton pending={pending}>Save changes</LoadingButton>
          )}
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
