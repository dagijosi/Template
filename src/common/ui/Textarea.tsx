import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";
import { textareaVariants } from "./textarea-variants";
import { motion } from "framer-motion";

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
    /**
     * The label to display above the textarea.
     */
    label?: string;
    /**
     * Additional class names for the label.
     */
    labelClassName?: string;
    /**
     * The error message to display below the textarea.
     */
    error?: string;
    /**
     * Additional class names for the error message.
     */
    errorClassName?: string;
    /**
     * A description or hint to display below the textarea.
     */
    description?: string;
    /**
     * Additional class names for the description message.
     */
    descriptionClassName?: string;
}

/**
 * A flexible and customizable textarea component.
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        { className, variant, label, labelClassName, error, errorClassName, description, descriptionClassName, required, ...props },
        ref
    ) => {
        const textareaVariant = error ? "destructive" : variant;

        const messageVariants = {
            hidden: { opacity: 0, y: -5 },
            visible: { opacity: 1, y: 0 },
        };

        return (
            <div> {/* Outer wrapper for the entire component */}
                {label && (
                    <label className={cn("block text-sm font-medium text-gray-700 mb-2", labelClassName)}>
                        {label} {required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <div className="relative flex items-center mt-2"> {/* Inner wrapper */}
                    <textarea
                        className={cn(
                            textareaVariants({ variant: textareaVariant, className })
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error && (
                    <motion.p
                        className={cn("text-sm text-red-500 mt-1", errorClassName)}
                        variants={messageVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.2 }}
                    >
                        {error}
                    </motion.p>
                )}
                {!error && description && (
                    <motion.p
                        className={cn("text-sm text-muted-foreground mt-1", descriptionClassName)}
                        variants={messageVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.2 }}
                    >
                        {description}
                    </motion.p>
                )}
            </div>
        );
    }
);

Textarea.displayName = "Textarea";

export { Textarea };
