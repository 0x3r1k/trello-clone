"use client";

import { useEffect, useState } from "react";
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
import { IconBrandGmail, IconCheck, IconPencil } from "@tabler/icons-react";

export function ProfileForm({ session }: { session: Session }) {
  const router = useRouter();
  const { toast } = useToast();

  const [pending, setPending] = useState(false);
  const [passwordPending, setPasswordPending] = useState(false);
  const [emailPending, setEmailPending] = useState(false);
  const [editMode, setEditMode] = useState(false);

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

  const toggleEditMode = async () => {
    if (editMode) {
      setEmailPending(true);

      const emailInput = document.getElementById("email") as HTMLInputElement;
      if (!emailInput || !emailInput.value) return;

      if (emailInput.value === session.user.email) {
        setEmailPending(false);
        return;
      }

      if (emailInput.value.length < 6) {
        setEmailPending(false);

        toast({
          title: "Invalid email",
          description: "Email must be at least 6 characters.",
          variant: "destructive",
        });

        return;
      }

      form.setValue("email", emailInput.value);

      await authClient.changeEmail({
        newEmail: emailInput.value.trim(),
        callbackURL: "/profile?emailChange=true",
      });

      if (session.user.emailVerified === true) {
        toast({
          title: "Email change requested",
          description: "Check your email to verify your new email address.",
        });
      } else {
        toast({
          title: "Email change successful",
          description:
            "Your email has been changed. Check your email to verify your new email address.",
        });

        router.refresh();
      }

      setEmailPending(false);
    }

    setEditMode(!editMode);
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
                        id={field}
                        type={
                          field === "email"
                            ? "email"
                            : field === "image"
                              ? "url"
                              : "text"
                        }
                        disabled={field === "email" && !editMode}
                        placeholder={`Enter your ${field}`}
                        autoComplete="off"
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {field === "email" && (
                <LoadingButton
                  type="button"
                  onClick={toggleEditMode}
                  pending={emailPending}
                  className="w-10"
                >
                  {editMode ? (
                    <IconCheck className="w-10 h-10" />
                  ) : (
                    <IconPencil className="w-10 h-10" />
                  )}
                </LoadingButton>
              )}

              {field === "email" && session.user.emailVerified === false && (
                <LoadingButton
                  type="button"
                  onClick={onResendVerificationEmail}
                  pending={emailPending}
                  className="w-10"
                >
                  <IconBrandGmail className="w-6 h-6" />
                </LoadingButton>
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
