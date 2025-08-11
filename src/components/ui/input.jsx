import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
    className,
    type,
    required = false,
    errorMessage = "",
    showError = false,
    onChange,
    ...props
}) {
    const handleChange = (e) => {
        const value = e.target.value;
        if (value.startsWith(" ")) return;
        onChange?.(e);
    };

    return (
        <div>
            <input
                type={type}
                aria-invalid={showError}
                aria-required={required}
                data-slot="input"
                className={cn(
                    "font-montserrat truncate file:text-foreground placeholder:text-placeholder-text selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent border-gray-500 px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    "focus-visible:border-input-focus focus-visible:ring-0 focus:bg-input-background",
                    showError ? "border-red-500" : "",
                    className
                )}
                onChange={handleChange}
                {...props}
            />
            {showError && (
                <p className="text-red-500 text-xs mt-1 font-montserrat font-semibold">
                    {errorMessage}
                </p>
            )}
        </div>
    );
}

export { Input };