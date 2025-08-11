import Select from "react-select";
import CreatableSelect from "react-select/creatable";

export default function SelectInput({
    name,
    value,
    onChange,
    options = [],
    placeholder = "Seleccione una opción",
    showError = false,
    errorMessage = "Este campo es obligatorio",
    className = "",
    isMulti = false,
    isCreatable = false,
    onCreateOption,
}) {
    const handleChange = (selected) => {
        const newValue = isMulti
            ? selected?.map((opt) => opt.value) || []
            : selected?.value || "";
        onChange({ target: { name, value: newValue } });
    };

	const selectedValue = isMulti
		? value?.map((val) =>
			typeof val === "object"
				? val
				: options.find((opt) => opt.value === val) || { label: val, value: val }
			)
		: typeof value === "object"
		? value
		: options.find((opt) => opt.value === value) || (value && { label: value, value });

    const SelectComponent = isCreatable ? CreatableSelect : Select;

    return (
        <div className="w-full mt-1">
            <SelectComponent
                isMulti={isMulti}
				name={name}
				options={options}
				value={selectedValue}
				onChange={handleChange}
				placeholder={placeholder}
				menuPortalTarget={document.body}
				menuPosition="fixed"
				className={className}
				onCreateOption={isCreatable ? onCreateOption : undefined}
				styles={{
					control: (base, state) => ({
						...base,
						fontSize: "0.85rem",
						fontFamily: "Montserrat, sans-serif",
						borderColor: showError 
							? "#ef4444"
							: state.isFocused
							? "#5cb7e6"
							: "#6a7282",
						borderRadius: "0.4rem",
						height: isMulti && value.length > 1 ? "auto" : "2rem",
						minHeight: "2rem",
						boxShadow: "none",
						padding: "0 0.5rem",
						alignItems: "center",
						"&:hover": {
							borderColor: showError
								? "#ef4444"
								: state.isFocused
								? "#5cb7e6"
								: "#6a7282",
						},
					}),
					option: (base, state) => ({
						...base,
						backgroundColor: state.isSelected
							? "#1591d1"
							: state.isFocused
							? "#D0ECFF"
							: "#ffffff",
						color: state.isSelected
							? "#ffffff"
							: "#000000",
						fontSize: "0.75rem",
						fontFamily: "Montserrat, sans-serif",
						cursor: "pointer",
						paddingTop: "0.4rem",
						paddingBottom: "0.4rem",
						":active": {
							backgroundColor: state.isSelected
								? "transparent"
								: "#transparent",
						},
					}),
					valueContainer: (base) => ({
						...base,
						padding: "0",
						margin: "0",
						height: "100%",
						display: "flex",
						alignItems: "center",
						paddingLeft: "0.25rem",
					}),
					input: (base) => ({
						...base,
						margin: "0",
						padding: "0",
					}),
					placeholder: (base) => ({
						...base,
						margin: "0",
						padding: "0",
						lineHeight: "1.25rem",
						fontFamily: "Montserrat, sans-serif",
    					fontSize: "0.75rem",
						color: "#676767",
					}),
					menuPortal: (base) => ({ 
						...base, 
						zIndex: 9999 
					}),
					indicatorsContainer: (base) => ({
						...base,
						height: "100%",
					}),
				}}
            />
            {showError && (
                <span className="text-red-500 text-xs mt-1 font-montserrat font-semibold">
                    {errorMessage}
                </span>
            )}
        </div>
    );
}