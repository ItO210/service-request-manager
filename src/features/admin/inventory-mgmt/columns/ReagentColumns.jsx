import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Icon } from "@iconify/react";

export const ReagentColumns = (handleEdit, selectedProduct) => [
    { header: "Código", accessorKey: "reagentCode" },
    { header: "Nombre", accessorKey: "reagentName" },
    { header: "Presentación", accessorKey: "reagentPresentation" },
    { header: "Peso/Volumen", accessorKey: "reagentWeightVolume" },
    { header: "Marca", accessorKey: "reagentBrand" },
    {
        header: "Sticker",
        accessorKey: "reagentSticker",
        cell: ({ row }) => {
            const color = row.getValue("reagentSticker");
            const colorMap = {
                3: {
                    colorClass: "bg-in-use-sticker",
                    description: "En uso",
                },
                4: {
                    colorClass: "bg-low-stock-sticker",
                    description: "Baja disponibilidad",
                },
                1: {
                    colorClass: "bg-reserved-sticker",
                    description: "En reserva",
                },
                2: {
                    colorClass: "bg-expiring-soon",
                    description: "Pronto a caducar",
                },
            };

            const colorInfo =  colorMap[color];

            if (!colorInfo) return null;

            return (
                <div className="flex justify-center">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                className={cn(
                                    "w-4 h-4 rounded-full cursor-pointer",
                                    colorInfo.colorClass
                                )}
                            />
                        </TooltipTrigger>
                    <TooltipContent side="top" align="center" className="bg-white text-black px-1 py-1 rounded-md shadow-lg text-xs font-poppins font-medium">
                      <span className="text-xs">{colorInfo.description}</span>
                        </TooltipContent>
                    </Tooltip>
                </div>
            );
        },
    },
    { header: "Ubicación", accessorKey: "location" },
    {
        header: "",
        id: "actions",
        cell: ({ row }) => {
            const isSelected =
                selectedProduct?.reagentCode ===
                row.original.reagentCode;
            return (
                <button
                    onClick={() => handleEdit(row.original)}
                    className={`text-black p-1 cursor-pointer transition-transform duration-200 ease-in-out ${
                        isSelected
                            ? "text-popup-background scale-115"
                            : "hover:text-popup-background hover:scale-115"
                    }`}
                    title="Editar producto"
                    aria-label="Editar producto"
                >
                    <Icon icon="mdi:edit-circle-outline" className="text-2xl" />
                </button>
            );
        },
    },
];

