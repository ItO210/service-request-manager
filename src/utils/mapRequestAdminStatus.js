/**
 * Function that transforms backend statuses into admin and technician-friendly statuses for the frontend.
 * This ensures that only relevant statuses are displayed to the user.
 */

export function mapRequestStatusForAdminAndTechnician(rawStatus) {
    const statusMap = {
        "Pendiente de aprobación (Jefe de departamento)": "pendingDept",
        "Pendiente de aprobación (Técnico)": "pendingTech",
        "Aprobada por técnico": "approvedByTech",
        "Aprobada y notificada": "approvedAndNotified",
        "Rechazada por Técnico": "rejectedByTech",
        "Rechazada y notificada": "rejectedAndNotified",
        "Cancelada": "cancelled"
    };

    return statusMap[rawStatus] || "unknown";
}