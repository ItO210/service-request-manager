import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";

export default function RequestAdminStatusBadge({ status }) {
    const statusMap = {
        pendingDept: {
            label: "Pendiente",
            hover: "Pendiente de aprobación (Jefe de Departamento)",
            class: "bg-in-progress-status text-in-progress-status-text",
            multiLine: true,
        },
        pendingTech: {
            label: "Pendiente",
            hover: "Pendiente de aprobación (Técnico)",
            class: "bg-pending-approval-technician text-pending-approval-technician-text",
            multiLine: true,
        },
        approvedByTech: {
            label: "Aprobada",
            hover: "Aprobada por el Técnico",
            class: "bg-approved-by-technician text-approved-by-technician-text",
        },
        approvedAndNotified: {
            label: "Aprobada",
            hover: "Aprobada y notificada",
            class: "bg-approved-status border-approved-status-yext text-approved-status-text",
        },
        rejectedByTech: {
            label: "Rechazada",
            hover: "Rechazada por el Técnico",
            class: "bg-rejected-by-tech text-rejected-by-tech-text",
        },
        rejectedAndNotified: {
            label: "Rechazada",
            hover: "Rechazada y notificada",
            class: "bg-rejected-status text-rejected-status-text",
        },
        cancelled: {
            label: "Cancelada",
            hover: "Cancelada por el Usuario",
            class: "bg-cancelled-user text-cancelled-user-text",
        },
    };

    const {
        label,
        class: styleClass,
        multiLine,
        hover,
    } = statusMap[status] || {
        label: "Desconocido",
        class: "bg-gray-300 border-[1.5px] text-black font-montserrat font-bold",
        multiLine: false,
    };

    return (
        <div className="relative group">
            <Tooltip>
                <TooltipTrigger asChild>
                    <span
                        className={`inline-block px-3 py-1 rounded-full text-sm text-center font-montserrat font-semibold w-[130px] border-[1.5px] ${
                            multiLine ? "truncate " : ""
                        } ${styleClass}`}
                    >
                        {label}
                    </span>
                </TooltipTrigger>
                <TooltipContent
                    side="top"
                    align="center"
                    className="bg-white text-black p-1.5 rounded-md shadow-lg text-xs font-poppins font-medium"
                >
                    <span className="text-xs">{hover}</span>
                </TooltipContent>
            </Tooltip>
        </div>
    );
}
