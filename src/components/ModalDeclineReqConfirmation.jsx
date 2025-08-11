import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@iconify/react";

export default function ModalDeclineReqConfirmation({
    onClose,
    onConfirm,
    isVisible = false,
    action = "approve",
}) {
    const panelRef = useRef(null);

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

    if (!isVisible) return null;

    const message =
        action === "approve"
            ? "¿Seguro que desea aprobar la solicitud?"
            : "¿Seguro que desea rechazar la solicitud?";

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
                        {message}
                    </h2>
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
                        onClick={onConfirm}
                        className="w-full sm:w-40 bg-sidebar hover:bg-dim-blue-background text-white font-poppins font-semibold text-lg"
                        aria-label="Confirmar acción"
                    >
                        Confirmar
                    </Button>
                </div>
            </div>
        </div>
    );
}
