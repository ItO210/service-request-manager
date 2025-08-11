export default function DateInput({
    name,
    value,
    onChange,
    placeholder = "Seleccione una fecha",
    className = "",
    showError = false,
    errorMessage = "",
}) {
    // Make sure that the value is in the format YYYY-MM-DD
    const formattedValue = value
        ? new Date(value).toISOString().split("T")[0]
        : "";
    // Handle the change event
    const handleChange = (e) => {
        const isoDate = new Date(e.target.value).toISOString(); // Convert to ISO format

        onChange({
            // Pass the event object
            ...e,
            target: {
                ...e.target,
                name,
                value: isoDate,
            },
        });
    };

    return (
        <div className="flex flex-col">
            <input
                type="date"
                name={name}
                value={formattedValue}
                onChange={handleChange}
                placeholder={placeholder}
                className={`w-full h-8 px-3 py-1 mt-1 truncate rounded-md border ${
                    showError ? "border-red-500" : "border-gray-500"
                } placeholder:text-xs placeholder:font-montserrat placeholder:text-placeholder-text text-sm font-montserrat shadow-xs focus-visible:border-input-focus focus:bg-input-background focus-visible:ring-0 outline-none ${className}`}
            />
            {showError && (
                <p className="text-red-500 text-xs mt-1 font-montserrat font-semibold">
                    {errorMessage}
                </p>
            )}
        </div>
    );
}
