import ProductStatusBadge from "@/components/ui/ProductStatusBadge";
import { Icon } from "@iconify/react";

export const MaterialColumns = (handleEdit, selectedProduct) => [
    // { header: "Código", accessorKey: "materialCode" }, might leave it out due to security reasons
    { header: "Descripción", accessorKey: "materialDescription" },
    { header: "Catálogo", accessorKey: "materialCatalog" },
    { header: "Marca", accessorKey: "materialBrand" },
    {
        header: "Caducidad",
        accessorFn: (row) => row.expirationDate,
        cell: ({ getValue }) => {
            const value = getValue();
            return value
                ? new Date(value).toLocaleDateString("es-MX", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                  })
                : "-";
        },
    },
    { header: "Ubicación", accessorKey: "location" },
    { header: "Cantidad", accessorKey: "materialQuantity" },
    {
        header: "",
        id: "actions",
        cell: ({ row }) => {
            const isSelected =
                selectedProduct?.materialDescription ===
                row.original.materialDescription;
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
