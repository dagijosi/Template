import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps } from "class-variance-authority"
import { motion, type MotionProps } from "framer-motion"

import { cn } from "@/utils/cn"
import { buttonVariants } from "./button-variants"

// Omit conflicting props from React.ButtonHTMLAttributes
type HTMLButtonPropsWithoutMotionConflicts = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onDrag' | 'onDragEnd' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragOver' | 'onDragStart' | 'onDrop'
>;

export interface ButtonProps
  extends HTMLButtonPropsWithoutMotionConflicts, // Use the filtered HTML props
    VariantProps<typeof buttonVariants> {
  /**
   * If true, the button will render as a child of the component passed to it.
   * This is useful for integrating with other component libraries that expect a child element.
   * @default false
   */
  asChild?: boolean;
  /**
   * If true, the button will show a loading spinner and be disabled.
   * @default false
   */
  isLoading?: boolean;
  /**
   * Custom icon to display when the button is in a loading state.
   * If not provided, a default spinner will be used.
   */
  loadingIcon?: React.ReactNode;
  /**
   * If true, all framer-motion animations on the button will be disabled.
   * @default false
   */
  disableAnimation?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps & MotionProps>(
  ({ className, variant, size, asChild = false, isLoading = false, loadingIcon, children, disableAnimation = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const MotionComp = motion(Comp);
    return (
      <MotionComp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        whileHover={disableAnimation ? {} : { scale: 1.02 }}
        whileTap={disableAnimation ? {} : { scale: 0.98 }}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center">
            {loadingIcon ? (
              <span className="-ml-1 mr-3">{loadingIcon}</span>
            ) : (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </div>
        ) : (
          children
        )}
      </MotionComp>
    )
  }
)
Button.displayName = "Button"

export { Button }
