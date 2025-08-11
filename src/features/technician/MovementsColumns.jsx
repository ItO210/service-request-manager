import ProductStatusBadge from "@/components/ui/ProductStatusBadge";
import { Icon } from "@iconify/react";

export const MovementsColumns = (handleToggleDetails, selectedMovement) => [
    {
        header: "Nombre Solicitante",
        accessorFn: (row) => row.bookerName || "-",
    },
    {
        header: "Nombre Equipo",
        accessorFn: (row) => row.equipment?.name || "-",
    },
    {
        header: "Fecha",
        accessorFn: (row) => row.startingDate,
        cell: ({ getValue }) => {
            const value = getValue();
            return value ? new Date(value).toLocaleDateString("es-MX") : "-";
        },
    },
    {
        header: "Horario",
        accessorFn: (row) => row.startingTime || "-",
    },
    {
        header: "Ubicación",
        accessorFn: (row) => row.equipment?.location || "-",
    },
    {
        header: "Estado",
        accessorFn: (row) => row.equipment?.status,
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
            const isSelected = selectedMovement === row.original;
            return (
                <button
                    onClick={() => handleToggleDetails(row.original)}
                    className={`text-black p-1 cursor-pointer transition-transform duration-200 ease-in-out ${
                        isSelected
                            ? "text-popup-background scale-115"
                            : "hover:text-popup-background hover:scale-115"
                    }`}
                    title="Ver detalles"
                    aria-label="Ver detalles"
                >
                    <Icon
                        icon="material-symbols:info-outline-rounded"
                        className="text-2xl"
                    />
                </button>
            );
        },
    },
];
