import ProductStatusBadge from "@/components/ui/ProductStatusBadge";
import { Icon } from "@iconify/react";

export const EquipmentColumns = (handleEdit, selectedProduct) => [
    { header: "No. Inventario", accessorKey: "inventoryNumber" },
    { header: "Nombre", accessorKey: "equipmentName" },
    { header: "Marca", accessorKey: "equipmentBrand" },
    { header: "Modelo", accessorKey: "equipmentModel" },
    { header: "Ubicación", accessorKey: "location" },
    {
        header: "Estado",
        accessorFn: (row) => row.status,
        id: "status",
        cell: ({ getValue }) => {
            const status = getValue();
            return <ProductStatusBadge status={status} />;
        },
    },
    {
        header: "",
        id: "actions",
        cell: ({ row }) => {
            const isSelected =
                selectedProduct?.inventoryNumber ===
                row.original.inventoryNumber;
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
