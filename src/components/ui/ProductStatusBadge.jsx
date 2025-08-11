export default function ProductStatusBadge({ status }) {
    const statusMap = {
        inUse: {
            label: "En uso",
            class: "bg-in-progress-status border-[1.5px] text-in-progress-status-text font-montserrat font-bold",
        },
        available: {
            label: "Disponible",
            class: "bg-approved-status border-[1.5px] text-approved-status-text font-montserrat font-bold",
        },
        disabled: {
            label: "Deshabilitado",
            class: "bg-cancelled-user border-[1.5px] text-disabled-status-text font-montserrat font-bold",
        },
    };

    const { label, class: styleClass } = statusMap[status] || {
        label: "Desconocido",
        class: "bg-gray-300 border-[1.5px] text-black font-montserrat font-bold",
    };

    return (
        <span
            className={`inline-block py-0.5 rounded-full text-sm text-center font-montserrat font-semibold w-30 ${styleClass}`}
        >
            {label}
        </span>
    );
}
