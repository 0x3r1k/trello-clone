import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default async function EmailVerifiedPage() {
  return (
    <div className="flex flex-col items-center justify-center grow p-4">
      <h1 className="mb-4 text-2xl font-bold text-green-500">Email verified</h1>

      <p className="mb-4 text-gray-600">
        Your email address has been verified.
      </p>

      <Link
        href="/"
        className={buttonVariants({
          variant: "default",
        })}
      >
        Go to home
      </Link>
    </div>
  );
}
