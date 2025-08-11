import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@iconify/react";
import SelectInput from "./SelectInput";

export default function ModalSelectGraphDownload({
    onClose,
    onDownload,
}) {
    const panelRef = useRef(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                onClose();
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const months = [
        { label: "Enero", value: 1 },
        { label: "Febrero", value: 2 },
        { label: "Marzo", value: 3 },
        { label: "Abril", value: 4 },
        { label: "Mayo", value: 5 },
        { label: "Junio", value: 6 },
        { label: "Julio", value: 7 },
        { label: "Agosto", value: 8 },
        { label: "Septiembre", value: 9 },
        { label: "Octubre", value: 10 },
        { label: "Noviembre", value: 11 },
        { label: "Diciembre", value: 12 },
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from(
        { length: currentYear - 2025 + 1 },
        (_, i) => {
            const year = 2025 + i;
            return { label: String(year), value: year };
        }
    );


    return (
        <div className="fixed inset-0 bg-gray backdrop-blur-xs flex items-center justify-center z-50">
            <div
                ref={panelRef}
                className="bg-white rounded-2xl shadow-lg w-[90%] max-w-sm p-6 animate-fade-in flex flex-col items-center justify-center relative h-70"
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-black cursor-pointer"
                    aria-label="Cerrar"
                >
                    <Icon icon="mingcute:close-fill" className="text-xl" />
                </button>

                {/* Message */}
                <div className="flex-grow flex items-center justify-center">
                <h2 className="text-center text-2xl font-poppins font-semibold text-neutral-800 leading-snug">
                    Selecciona el mes y año para descargar
                </h2>
                </div>
                <div className="flex my-10 gap-3 w-full">
                    <SelectInput
                        placeholder="Mes"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        options={months}
                    />
                    <SelectInput
                        placeholder="Año"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        options={years}
                    />  
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
                    <Button
                        onClick={onClose}
                        className="w-full sm:w-40 bg-gray-300 text-gray-600 hover:opacity-85 font-poppins font-semibold text-lg"
                        aria-label="Cancelar"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => onDownload(selectedMonth, selectedYear)}
                        disabled={!selectedMonth || !selectedYear}
                        className={`w-full sm:w-40 ${
                            !selectedMonth || !selectedYear
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-sidebar hover:bg-dim-blue-background text-white"
                        } font-poppins font-semibold text-lg`}
                        aria-label="Confirmar descarga"
                    >
                        Descargar
                    </Button>
                </div>
            </div>
        </div>
    );
}
