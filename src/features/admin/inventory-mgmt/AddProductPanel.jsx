import AddEquipmentPanel from "./forms/AddEquipmentPanel";
import AddReagentPanel from "./forms/AddReagentPanel";
import AddMaterialPanel from "./forms/AddMaterialPanel";
import { useEffect, useRef } from "react";

export default function AddProductPanel({ type, onClose, selectedProduct, setReload }) {
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

    const formRender = () => {
        switch (type) {
            case "equipos":
                return (
                    <AddEquipmentPanel
                        onClose={onClose}
                        initialData={selectedProduct}
                        setReload={setReload}
                        isEditing={!!selectedProduct}
                    />
                );
            case "reactivos":
                return (
                    <AddReagentPanel
                        onClose={onClose}
                        initialData={selectedProduct}
                        setReload={setReload}
                        isEditing={!!selectedProduct}
                    />
                );
            case "materiales":
                return (
                    <AddMaterialPanel
                        onClose={onClose}
                        initialData={selectedProduct}
                        setReload={setReload}
                        isEditing={!!selectedProduct}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-gray backdrop-blur-xs flex items-center justify-center z-50">
            <div ref={panelRef} className="bg-white max-h-[90vh] overflow-y-auto overflow-x-auto rounded-xl shadow-lg sm:w-[100%] w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl animate-fade-in">
                {formRender()}
            </div>
        </div>
    );
}
