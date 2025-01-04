"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { signUpSchema } from "@/lib/zod";
import { z } from "zod";

import { authClient } from "@/lib/auth-client";
import { useToast } from "@/hooks/use-toast";
import { SignUpForm } from "@/components/sign-up/form";
import Link from "next/link";

export default function SignUpPage() {
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);

  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    await authClient.signUp.email(
      {
        name: values.name,
        email: values.email,
        password: values.password,
      },
      {
        onRequest: () => setPending(true),
        onSuccess: () => {
          toast({
            title: "Account created",
            description:
              "Your account has been created. Please check your email to verify your account.",
          });

          setSuccess(true);
        },
        onError: (ctx) => {
          toast({
            title: "Something went wrong",
            description: ctx.error.message ?? "An error occurred",
            variant: "destructive",
          });

          console.log("Error using signUp function", ctx);
          setSuccess(false);
        },
      },
    );

    setPending(false);
  };

  return (
    <div className="grow flex items-center justify-center p-4 min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
        </CardHeader>

        <CardContent>
          {success ? (
            // TODO: Make a component for this
            <div className="text-center">
              <p className="text-lg text-gray-800">
                Your account has been created. Please check your email to verify
                your account.
              </p>
            </div>
          ) : (
            <SignUpForm onSubmit={onSubmit} pending={pending} />
          )}

          <div className="mt-4 text-center text-sm">
            <Link href="/auth/login" className="text-primary hover:underline">
              Do you have an account? Sign in.
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
