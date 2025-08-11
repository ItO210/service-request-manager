import RequestAdminStatusBadge from "@/components/ui/RequestAdminStatusBadge";
import { Icon } from "@iconify/react";
import { mapRequestStatusForAdminAndTechnician } from "@/utils/mapRequestAdminStatus";

export const RequestsColumns = (handleToggleDetails, selectedRequest) => [
    {
        header: "Identificador",
        accessorFn: (row) => row.logCode || "-",
    },
    {
        header: "Nombre Solicitante",
        accessorFn: (row) => row.requestedBy?.name || "-",
    },
    {
        header: "Tipo",
        accessorKey: "typeOfRequest",
        cell: ({ getValue }) => {
            const value = getValue();
            if (value === "EQ") return "Equipo";
            if (value === "R&M") return "Reactivo o Material";
            if (value === "TA") return "Asistencia técnica";
            return "Desconocido";
        },
    },
    {
        header: "Fecha",
        accessorFn: (row) => row.requestDate?.startingDate,
        cell: ({ getValue }) => {
            const value = getValue();
            return value
                ? new Date(value).toLocaleDateString("es-MX")
                : "-";
        }
    },
    {
        header: "Horario",
        accessorFn: (row) => {
            const start = row.requestDate?.startingTime;
            const end = row.requestDate?.finishingTime;
            if (start && end) return `${start} - ${end}`;
            if (start) return start;
            return "-";
        },
        cell: ({ getValue }) => getValue() || "-",
    },
    {
        header: "Estado",
        accessorKey: "requestStatus",
        cell: ({ getValue }) => {
            const rawStatus = getValue();
            const mappedStatus = mapRequestStatusForAdminAndTechnician(rawStatus);
            return <RequestAdminStatusBadge status={mappedStatus} />;
        },
    },
    {
        header: "",
        id: "actions",
        cell: ({ row }) => {
            const isSelected = selectedRequest?.id === row.original.id;
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
