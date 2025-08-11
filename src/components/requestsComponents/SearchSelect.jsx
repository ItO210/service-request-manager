import { baseUrl } from "@/utils/apiFetch";
import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Button } from "../ui/button";
import TokenImage from "@/components/ui/Image";

const SearchSelect = ({
  options,
  placeholder,
  selectedItems,
  onSelectedItemsChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filterOptions = (term) => {
    setSearchTerm(term);
    const filtered = options.filter(
      (option) =>
        option.name.toLowerCase().includes(term.toLowerCase()) &&
        !selectedItems.some((item) => item.name === option.name)
    );
    setFilteredOptions(filtered);
  };

  const handleSelect = (option) => {
    if (option.status === "disabled") {
      return;
    }

    if (!selectedItems.some((item) => item.name === option.name)) {
      const newSelectedItems = [...selectedItems, option];
      onSelectedItemsChange(newSelectedItems);
    }
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleRemove = (itemToRemove) => {
    const newSelectedItems = selectedItems.filter(
      (item) => item.name !== itemToRemove.name
    );
    onSelectedItemsChange(newSelectedItems);
  };

  const handleIconDropdownClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    setFilteredOptions(
      options.filter(
        (option) => !selectedItems.some((item) => item.name === option.name)
      )
    );

    setSearchTerm("");
  }, [options]);

  useEffect(() => {
    document.addEventListener("mousedown", handleIconDropdownClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleIconDropdownClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <Icon
        icon="material-symbols:search-rounded"
        className="absolute left-3 top-2.5 text-black text-xl pointer-events-none"
      />

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => filterOptions(e.target.value)}
        onClick={() => setIsOpen(!isOpen)}
        placeholder={placeholder || "Seleccione una opción"}
        className="w-full border-2 border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent focus:bg-input-background p-2 pl-10 rounded-lg font-montserrat text-sm"
      />
      {isOpen && (
        <div className="overflow-scroll mt-2 w-full max-h-56 grid grid-cols-2 gap-2">
          {filteredOptions.length === 0 ? (
            <div className="p-2 text-gray-500 font-montserrat">
              No se encontró
            </div>
          ) : (
            filteredOptions.map((option, index) => {
              const isDisabled = option.status === "disabled";

              return (
                <div
                  key={index}
                  className={`border-2 flex flex-col items-center rounded-lg ${
                    isDisabled
                      ? "border-gray-300 bg-gray-100 opacity-60"
                      : "border-primary-blue bg-white"
                  }`}
                >
                  {option.photoId && (
                    <>
                      <TokenImage
                        src={`${baseUrl}/photo/${option.photoId}`}
                        alt={`Imagen de ${option.name}`}
                        className={`p-2 w-full max-h-35 object-contain ${
                          isDisabled ? "grayscale" : ""
                        }`}
                      />
                      <div
                        className={`w-full border-t ${
                          isDisabled ? "border-gray-300" : "border-primary-blue"
                        }`}
                      ></div>
                    </>
                  )}

                  <div className="p-2 w-full flex flex-col justify-between h-full">
                    <p
                      className={`text-base font-montserrat font-semibold ${
                        isDisabled ? "text-gray-500" : ""
                      }`}
                    >
                      {option.name}
                    </p>
                    <p
                      className={`text-sm font-montserrat mt-2 ${
                        isDisabled ? "text-gray-400" : ""
                      }`}
                    >
                      <span className="font-medium">Marca:</span>
                      <br />
                      <span className="font-normal">{option.brand}</span>
                    </p>
                    {(option.location ||
                      option.sdsLink ||
                      option.obsForUsers) && (
                      <div
                        className={`text-sm font-montserrat mt-2 ${
                          isDisabled ? "text-gray-400" : ""
                        }`}
                      >
                        <span className="font-medium">
                          {option.location
                            ? "Ubicación:"
                            : option.sdsLink
                            ? "Hoja de seguridad:"
                            : "Observaciones:"}
                        </span>
                        <br />
                        {option.location ? (
                          <span className="font-normal">{option.location}</span>
                        ) : option.sdsLink ? (
                          <a
                            href={option.sdsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`underline font-normal break-all ${
                              isDisabled
                                ? "text-gray-400 pointer-events-none"
                                : "text-blue-600"
                            }`}
                          >
                            {option.sdsLink}
                          </a>
                        ) : (
                          <span className="font-normal break-words whitespace-pre-line">
                            {option.obsForUsers}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="mt-auto pt-3 flex justify-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        className={`rounded-md font-poppins font-semibold text-sm transition inline-flex items-center ${
                          isDisabled
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                            : "bg-deep-blue hover:bg-dark-blue text-white cursor-pointer"
                        }`}
                        onClick={() => handleSelect(option)}
                        disabled={isDisabled}
                        aria-label={`${
                          isDisabled ? "No disponible" : "Agregar"
                        } ${option.name} ${
                          isDisabled ? "(deshabilitado)" : "a la selección"
                        }`}
                      >
                        {isDisabled ? "No disponible" : "Agregar"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
      {selectedItems.length > 0 && (
        <div className="flex overflow-scroll gap-2 py-2">
          {selectedItems.map((item, index) => (
            <div
              key={index}
              className="flex border-2 border-primary-blue p-2 mt-2 rounded-xl items-center gap-2"
            >
              <span className="font-montserrat font-semibold text-sm break-words whitespace-normal">
                {item.name}
              </span>
              <button
                onClick={() => handleRemove(item)}
                className="cursor-pointer"
                aria-label={`Eliminar ${item.name} de la selección`}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchSelect;
