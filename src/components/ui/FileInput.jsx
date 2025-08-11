import { useState } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

export default function FileInput({
    name: inputName,
    onChange,
    showError = false,
    errorMessage = "",
    className = "",
}) {
    const [fileName, setFileName] = useState("");
    const getShortFileName = (fullName) => {
        const maxStart = 15;
        const maxEnd = 8;

        if (fullName.length <= maxStart + maxEnd + 3) return fullName;

        const start = fullName.slice(0, maxStart);
        const end = fullName.slice(-maxEnd);
        return `${start}...${end}`;
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(getShortFileName(file.name));
            onChange?.(e); // if an onChange function is passed from outside
        }
    };

    return (
        <div>
            <label className="relative flex items-center w-full cursor-pointer mt-1">
            <input
                type="file"
                id="input-file"
                name={inputName}
                accept=".png, .jpg, .jpeg"
                onChange={handleFileChange}
                className="hidden"
            />

            <div className={cn(
                        "font-montserrat truncate selection:bg-primary selection:text-primary-foreground flex h-8 w-full min-w-0 rounded-md border px-3 py-2 text-xs font-normal shadow-xs outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
                        "focus-visible:border-input-focus focus-visible:ring-0 focus:bg-input-background truncate",
                        showError ? "border-red-500" : "border-gray-500",
                        className
                    )}>
                <span className="text-placeholder-text truncate">
                    {fileName || "Seleccione una imagen"}
                </span>

                <div className="ml-auto flex-shrink-0">
                    <Icon
                        icon="heroicons-outline:paper-clip"
                        className="text-xl text-dark-blue -mt-0.5"
                    />
                </div>
            </div>
        </label>
        {showError && (
            <p className="text-red-500 text-xs mt-1 font-montserrat">
                {errorMessage}
            </p>
        )}
        </div>
    );
}
