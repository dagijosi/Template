import { FiChevronDown } from "react-icons/fi";
import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { motion, type MotionProps } from "framer-motion";

import { cn } from "@/utils/cn";
import { selectVariants } from "./select-variants";

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">,
    VariantProps<typeof selectVariants> {
  /**
   * If true, the select will show a loading spinner and be disabled.
   * @default false
   */
  isLoading?: boolean;
  /**
   * Custom icon to display when the select is in a loading state.
   * If not provided, a default spinner will be used.
   */
  loadingIcon?: React.ReactNode;
  /**
   * If true, a "Loading options..." option will be displayed and the select will be disabled.
   * @default false
   */
  optionsLoading?: boolean;
  /**
   * Custom text to display when options are loading.
   * @default "Loading options..."
   */
  loadingOptionText?: string;
  /**
   * Custom icon to display within the loading option.
   */
  loadingOptionIcon?: React.ReactNode;
  /**
   * The icon to display in the select.
   */
  icon?: React.ReactNode;
  /**
   * The position of the icon.
   * @default "left"
   */
  iconPosition?: "left" | "right";
  /**
   * Additional class names for the icon wrapper for the main icon.
   */
  iconWrapperClassName?: string;
  /**
   * The icon to display as the dropdown indicator on the right side.
   * @default <FiChevronDown />
   */
  dropdownIcon?: React.ReactNode;
  /**
   * Additional class names for the dropdown indicator icon wrapper.
   */
  dropdownIconWrapperClassName?: string;
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

const Select = React.forwardRef<HTMLSelectElement, SelectProps & MotionProps>(
  ({ className, variant, size, isLoading = false, loadingIcon, optionsLoading = false, loadingOptionText = "Loading options...", loadingOptionIcon, icon, iconPosition = "left", iconWrapperClassName, dropdownIcon = <FiChevronDown />, dropdownIconWrapperClassName, children, ...props }, ref) => {
    const MotionSelect = motion.select;

    const leftIconPadding = icon && iconPosition === "left" ? "pl-10" : "";
    const rightIconPadding = dropdownIcon ? "pr-10" : "";

    return (
      <div className="relative flex items-center">
        {isLoading && (
          <div className={cn("absolute inset-0 flex items-center justify-center bg-background/80 z-10 rounded-md", leftIconPadding, rightIconPadding)}>
            {loadingIcon ? (
              loadingIcon
            ) : (
              <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </div>
        )}
        {icon && iconPosition === "left" && <IconWrapper icon={icon} iconPosition="left" className={iconWrapperClassName} />}
        <MotionSelect
          className={cn(selectVariants({ variant, size, className }), leftIconPadding, rightIconPadding)}
          ref={ref}
          {...props}
        >
          {optionsLoading ? (
            <option disabled value="">
              {loadingOptionIcon ? (
                <span className="mr-2 inline-flex items-center justify-center">
                  {loadingOptionIcon}
                </span>
              ) : (
                <span className="mr-2 inline-flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              )}
              {loadingOptionText}
            </option>
          ) : (
            children
          )}
        </MotionSelect>
        {dropdownIcon && <IconWrapper icon={dropdownIcon} iconPosition="right" className={cn("pointer-events-none", dropdownIconWrapperClassName)} />}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
