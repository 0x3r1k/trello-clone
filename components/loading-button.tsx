import { Button } from "@/components/ui/button";

export default function LoadingButton({
  pending,
  variant,
  type,
  className,
  disabled,
  children,
  onClick,
}: {
  pending: boolean;
  variant?: "outline" | "destructive";
  type?: "button" | "submit";
  className?: string | boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Button
      type={type ?? "submit"}
      variant={variant ?? "default"}
      onClick={onClick}
      disabled={disabled || pending}
      {...(typeof className === "string"
        ? { className }
        : typeof className === "boolean"
          ? {}
          : { className: "w-full" })}
    >
      {pending ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 text-primary-foreground"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>

            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 0120.709 5.709L22.123 7.12A10.001 10.001 0 002.88 16.88l1.414 1.414z"
            ></path>
          </svg>
        </div>
      ) : (
        children
      )}
    </Button>
  );
}
