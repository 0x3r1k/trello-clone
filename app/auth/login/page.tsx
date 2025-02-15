"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import LoadingButton from "@/components/loading-button";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { ErrorContext } from "better-auth/client";

import { signInSchema } from "@/lib/zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [pending, setPending] = useState(false);
  const [pendingGoogle, setPendingGoogle] = useState(false);
  const [pendingGithub, setPendingGithub] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleCredentialsSignIn = async (
    values: z.infer<typeof signInSchema>
  ) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onRequest: () => setPending(true),
        onSuccess: async () => {
          router.push("/");
          router.refresh();
        },
        onError: (ctx: ErrorContext) => {
          console.log(ctx);

          toast({
            title: "Something went wrong",
            description: ctx.error.message ?? "Something went wrong.",
            variant: "destructive",
          });
        },
      }
    );

    setPending(false);
  };

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social(
      {
        provider: "google",
      },
      {
        onRequest: () => setPendingGoogle(true),
        onSuccess: async () => {
          router.push("/");
          router.refresh();
        },
        onError: (ctx: ErrorContext) => {
          console.log(ctx);

          toast({
            title: "Something went wrong",
            description: ctx.error.message ?? "Something went wrong.",
            variant: "destructive",
          });
        },
      }
    );

    setPendingGoogle(false);
  };

  const handleGithubSignIn = async () => {
    await authClient.signIn.social(
      {
        provider: "github",
      },
      {
        onRequest: () => setPendingGithub(true),
        onSuccess: async () => {
          router.push("/");
          router.refresh();
        },
        onError: (ctx: ErrorContext) => {
          console.log(ctx);

          toast({
            title: "Something went wrong",
            description: ctx.error.message ?? "Something went wrong.",
            variant: "destructive",
          });
        },
      }
    );

    setPendingGithub(false);
  };

  return (
    <div className="grow flex items-center justify-center p-4 min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Sign In</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col items-center justify-center gap-2 mb-2">
            <LoadingButton pending={pendingGoogle} onClick={handleGoogleSignIn}>
              <IconBrandGoogle className="w-4 h-4" />
              Continue with Google
            </LoadingButton>

            <LoadingButton pending={pendingGithub} onClick={handleGithubSignIn}>
              <IconBrandGithub className="w-4 h-4" />
              Continue with Github
            </LoadingButton>
          </div>

          <div className="flex flex-row justify-between items-center gap-2">
            <div className="w-full h-[0.5px] bg-primary" />
            <span className="text-primary text-center text-sm font-light">
              OR
            </span>
            <div className="w-full h-[0.5px] bg-primary" />
          </div>

          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleCredentialsSignIn)}
            >
              {["email", "password"].map((field) => (
                <FormField
                  control={form.control}
                  key={field}
                  name={field as keyof z.infer<typeof signInSchema>}
                  render={({ field: fieldProps }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </FormLabel>

                      <FormControl>
                        <Input
                          type={field === "password" ? "password" : "email"}
                          placeholder={`Enter your ${field}`}
                          {...fieldProps}
                          autoComplete={
                            field === "password" ? "current-password" : "email"
                          }
                        />
                      </FormControl>

                      {field === "password" && (
                        <FormDescription>
                          <Link
                            href="/auth/reset-password"
                            className="text-blue-500 hover:underline"
                          >
                            Forgot your password?
                          </Link>
                        </FormDescription>
                      )}

                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <LoadingButton pending={pending}>Sign In</LoadingButton>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            <Link
              href="/auth/register"
              className="text-primary hover:underline"
            >
              Don{"'"}t have an account? Sign up.
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
