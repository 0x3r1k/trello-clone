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

export function ProfileForm({ session }: { session: Session }) {
  const [pending, setPending] = useState(false);

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

    console.log(data);
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {["name", "email", "password", "confirmPassword"].map((field) => (
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

        <LoadingButton pending={pending}>Sign Up</LoadingButton>
      </form>
    </Form>
  );
}
