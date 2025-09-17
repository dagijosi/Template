import { cva } from "class-variance-authority";

export const inputVariants = cva(
    "flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
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
            inputSize: {
                default: "h-10",
                sm: "h-9 rounded-md",
                lg: "h-11 rounded-md",
            },
        },
        defaultVariants: {
            variant: "default",
            inputSize: "default",
        },
    }
);
