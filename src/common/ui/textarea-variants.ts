import { cva } from "class-variance-authority";

export const textareaVariants = cva(
    "flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "border-input",
                destructive: "border-destructive focus-visible:ring-destructive",
                outline: "border-input",
                ghost: "border-transparent focus-visible:ring-transparent",
                success: "border-green-500 focus-visible:ring-green-500",
                warning: "border-yellow-500 focus-visible:ring-yellow-500",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);
