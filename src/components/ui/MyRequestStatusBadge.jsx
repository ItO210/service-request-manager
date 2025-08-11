export default function MyRequestStatusBadge({ status }) {
    const statusMap = {
        inProgress: {
            label: "En progreso",
            class: "bg-in-progress-status border-[1.5px] text-in-progress-status-text font-montserrat font-bold",
        },
        approved: {
            label: "Aprobada",
            class: "bg-approved-status border-[1.5px] text-approved-status-text font-montserrat font-bold",
        },
        rejected: {
            label: "Rechazada",
            class: "bg-rejected-status border-[1.5px] text-rejected-status-text font-montserrat font-bold",
        },
        cancelled: {
            label: "Cancelada",
            class: "bg-gray-300 border-[1.5px] text-gray-700 font-montserrat font-bold",
        }
    };

    const { label, class: styleClass } = statusMap[status] || {
        label: "Desconocido",
        class: "bg-gray-300 border-[1.5px] text-black font-montserrat font-bold",
    };

    return (
        <span
            className={`inline-block px-3 py-1 rounded-full text-sm text-center font-montserrat font-semibold w-35 ${styleClass}`}
        >
            {label}
        </span>
    );
}
