import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";
import { inputVariants } from "./input-variants";
import { motion } from "framer-motion";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
    /**
     * The icon to display in the input.
     */
    icon?: React.ReactNode;
    /**
     * The position of the icon.
     * @default "left"
     */
    iconPosition?: "left" | "right";
    /**
     * The label to display above the input.
     */
    label?: string;
    /**
     * Additional class names for the label.
     */
    labelClassName?: string;
    /**
     * Additional class names for the icon wrapper.
     */
    iconWrapperClassName?: string;
    /**
     * The error message to display below the input.
     */
    error?: string;
    /**
     * Additional class names for the error message.
     */
    errorClassName?: string;
    /**
     * A description or hint to display below the input.
     */
    description?: string;
    /**
     * Additional class names for the description message.
     */
    descriptionClassName?: string;
    /**
     * The style of the label.
     * @default "default"
     */
    labelStyle?: "default" | "floating";
    /**
     * The placeholder text for the input.
     * Note: This prop is ignored when `labelStyle` is set to "floating".
     */
    placeholder?: string;
}

const IconWrapper = ({ icon, iconPosition, className }: { icon?: React.ReactNode; iconPosition: "left" | "right"; className?: string }) => {
    if (!icon) return null;
    return (
        <div className={cn("absolute top-1/2 -translate-y-1/2 text-muted-foreground", {
            "left-3": iconPosition === "left",
            "right-3": iconPosition === "right",
        }, className)}>
            {icon}
        </div>
    );
};

/**
 * A flexible and customizable input component.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        { className, variant, inputSize, icon, iconPosition = "left", label, labelClassName, iconWrapperClassName, error, errorClassName, description, descriptionClassName, required, labelStyle = "default", placeholder, onFocus, onBlur, onChange, ...props },
        ref
    ) => {
        const iconPadding = icon ? (iconPosition === "left" ? "pl-10" : "pr-10") : "";
        const inputVariant = error ? "destructive" : variant;

        const [isFocused, setIsFocused] = React.useState(false);
        const [hasValue, setHasValue] = React.useState(false);

        React.useEffect(() => {
            if (ref && 'current' in ref && ref.current) {
                setHasValue(!!ref.current.value);
            }
        }, [ref]);

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            onFocus?.(e);
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            setHasValue(!!e.target.value);
            onBlur?.(e);
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setHasValue(!!e.target.value);
            onChange?.(e);
        };

        const labelVariants = {
            initial: {
                top: "50%",
                y: "-50%",
                fontSize: "1rem", // text-base
                color: "var(--muted-foreground)", // text-muted-foreground
            },
            float: {
                top: "0%",
                y: "-100%",
                fontSize: "0.75rem", // text-xs
                color: "var(--primary)", // text-primary
            },
        };

        const messageVariants = {
            hidden: { opacity: 0, y: -5 },
            visible: { opacity: 1, y: 0 },
        };

        return (
            <div> {/* Outer wrapper for the entire component */} 
                {labelStyle === "default" && label && (
                    <label className={cn("block text-sm font-medium text-gray-700 mb-2", labelClassName)}>
                        {label} {required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <div className={cn("relative flex items-center", labelStyle === "default" && "mt-2")}> {/* Inner wrapper for input, label, icons */} 
                    {iconPosition === "left" && <IconWrapper icon={icon} iconPosition="left" className={iconWrapperClassName} />}
                    <input
                        className={cn(
                            inputVariants({ variant: inputVariant, inputSize, className }),
                            iconPadding,
                            labelStyle === "floating" && "peer"
                        )}
                        ref={ref}
                        placeholder={labelStyle === "floating" ? " " : placeholder}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        {...props}
                    />
                    {labelStyle === "floating" && label && (
                        <motion.label
                            htmlFor={props.id}
                            className={cn(
                                "absolute left-3 text-muted-foreground", // Base styles
                                { "left-10": icon && iconPosition === "left" },
                                labelClassName
                            )}
                            variants={labelVariants}
                            initial="initial"
                            animate={isFocused || hasValue ? "float" : "initial"}
                            transition={{ duration: 0.2 }}
                        >
                            {label} {required && <span className="text-red-500">*</span>}
                        </motion.label>
                    )}
                    {iconPosition === "right" && <IconWrapper icon={icon} iconPosition="right" className={iconWrapperClassName} />}
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

Input.displayName = "Input";

export { Input };