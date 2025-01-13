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
import { signUpSchema } from "@/lib/zod";
import { z } from "zod";

export function SignUpForm({
  onSubmit,
  pending,
}: {
  onSubmit: (values: z.infer<typeof signUpSchema>) => void;
  pending: boolean;
}) {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {["name", "email", "password", "confirmPassword"].map((field) => (
          <FormField
            control={form.control}
            key={field}
            name={field as keyof z.infer<typeof signUpSchema>}
            render={({ field: fieldProps }) => (
              <FormItem>
                <FormLabel>
                  {field === "confirmPassword"
                    ? "Confirm Password"
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                </FormLabel>

                <FormControl>
                  <Input
                    type={
                      field === "password" || field === "confirmPassword"
                        ? "password"
                        : field === "email"
                        ? "email"
                        : "text"
                    }
                    placeholder={`Enter your ${
                      field === "confirmPassword" ? "password again" : field
                    }`}
                    {...fieldProps}
                    autoComplete="off"
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
