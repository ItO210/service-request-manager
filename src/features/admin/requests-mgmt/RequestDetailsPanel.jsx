import { apiFetch } from "@/utils/apiFetch";
import { useState, useEffect, useRef } from "react";
import ModalDeclineReqConfirmation from "@/components/ModalDeclineReqConfirmation";
import { Button } from "@/components/ui/button";
import { showToast } from "@/utils/toastUtils";
import { Icon } from "@iconify/react";
import { jwtDecode } from "jwt-decode";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ROLES } from "@/constants/roles";
import { AREAS } from "@/constants/areas";
import SelectInput from "@/components/ui/SelectInput";

export default function RequestDetailsPanel({
    request,
    onClose,
    onCancel,
    setReload,
}) {
    const observationsRef = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [observationText, setObservationText] = useState("");
    const [availableTechnicians, setAvailableTechnicians] = useState([]);
    useEffect(() => {
        const fetchTechnicians = async () => {
            try {
                const data = await apiFetch(`/user`);

                const filtered = data.users.filter(
                    (user) => user.role === ROLES.TECH
                );
                setAvailableTechnicians(filtered);
            } catch (err) {
                console.error("Error al cargar técnicos:", err);
            }
        };

        fetchTechnicians();
    }, []);

    const [modalAction, setModalAction] = useState("approve");
    const {
        requestedBy,
        assignedTechnicianName,
        workArea,
        typeOfRequest,
        requestSubtype,
        requestDate,
        observations,
        requestStatus,
        occupiedMaterial,
    } = request;

    const requestedDate =
        requestDate?.startingDate && requestDate?.finishingDate
            ? `${new Date(requestDate.startingDate).toLocaleDateString(
                  "es-MX"
              )} - ${new Date(requestDate.finishingDate).toLocaleDateString(
                  "es-MX"
              )}`
            : `${new Date(requestDate.startingDate).toLocaleDateString()}`;
    const requestedTime =
        requestDate?.startingTime && requestDate?.finishingTime
            ? `${requestDate.startingTime} - ${requestDate.finishingTime}`
            : `${requestDate.startingTime}`;

    const getObservationText = () => {
        const obsText = document.getElementById("observation")?.value || "";
        return obsText.trim();
    };

    const [selectedTechnicianId, setSelectedTechnicianId] = useState("");
    useEffect(() => {
        if (assignedTechnicianName && availableTechnicians.length > 0) {
            const tech = availableTechnicians.find(
                (t) => t.name === assignedTechnicianName
            );
            if (tech) setSelectedTechnicianId(tech._id);
        }
    }, [assignedTechnicianName, availableTechnicians]);

    const noReassignment = [
        "Cancelada",
        "Rechazada y notificada",
        "Aprobada y notificada",
    ];

    const [observerChecks, setObserverChecks] = useState([]);
    useEffect(() => {
        if (request?.observatorTechnician?.length) {
            setObserverChecks(request.observatorTechnician);
        }
    }, [request]);

    const handleCheckChange = (id, checked) => {
        const updated = observerChecks.map((tech) =>
            tech._id === id ? { ...tech, check: checked } : tech
        );
        setObserverChecks(updated);
    };

    const { role } = jwtDecode(localStorage.getItem("token"));

    const visibleStatesByRole = {
        [ROLES.ADMIN]: [
            "Pendiente de aprobación (Jefe de departamento)",
            "Aprobada por técnico",
            "Rechazada por Técnico",
            "Aprobada y notificada",
        ],
        [ROLES.TECH]: ["Pendiente de aprobación (Técnico)"],
    };

    const showActionButtons =
        visibleStatesByRole[role]?.includes(requestStatus) ?? false;

    const handleAction = async (actionType) => {
        const { registrationNumber, role } = jwtDecode(
            localStorage.getItem("token")
        );
        const isTech = role === ROLES.TECH;
        let nextStatus = null;
        let endpointType = null;

        if (actionType === "approve") {
            if (
                role === ROLES.ADMIN &&
                requestStatus ===
                    "Pendiente de aprobación (Jefe de departamento)"
            ) {
                nextStatus = "Pendiente de aprobación (Técnico)";
                endpointType = "admin";
            } else if (
                isTech &&
                requestStatus === "Pendiente de aprobación (Técnico)"
            ) {
                nextStatus = "Aprobada por técnico";
                endpointType = "technician";
            } else if (
                role === ROLES.ADMIN &&
                ["Aprobada por técnico", "Rechazada por Técnico"].includes(
                    requestStatus
                )
            ) {
                nextStatus = "Aprobada y notificada";
                endpointType = "final";
            }
        } else if (actionType === "reject") {
            if (
                isTech &&
                requestStatus === "Pendiente de aprobación (Técnico)"
            ) {
                nextStatus = "Rechazada por Técnico";
                endpointType = "technician";
            } else if (
                role === ROLES.ADMIN &&
                [
                    "Pendiente de aprobación (Jefe de departamento)",
                    "Aprobada por técnico",
                ].includes(requestStatus)
            ) {
                nextStatus = "Rechazada y notificada";
                endpointType = "admin";
            } else if (
                role === ROLES.ADMIN &&
                requestStatus === "Rechazada por Técnico"
            ) {
                nextStatus = "Rechazada y notificada";
                endpointType = "final";
            }
        }

        if (!nextStatus || !endpointType) return;

        const endpointMap = {
            admin: `/request/admin-action/${request.id}`,
            technician: `/request/technician-action/${request.id}`,
            final: `/request/final-action/${request.id}`,
        };

        try {
            await apiFetch(endpointMap[endpointType], {
                method: "PUT",
                body: JSON.stringify({
                    registrationNumber,
                    requestStatus: nextStatus,
                    observations: getObservationText(),
                }),
            });
            setReload((prev) => !prev);
        } catch (error) {
            console.error(
                `Error al ${
                    actionType === "approve" ? "aprobar" : "rechazar"
                } la solicitud:`,
                error
            );
        }
    };

    const handleComment = async () => {
        const { registrationNumber } = jwtDecode(localStorage.getItem("token"));

        try {
            const data = await apiFetch(`/request/observation/${request.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    registrationNumber,
                    observation: observationText.trim(),
                }),
            });

            showToast("Comentario agregado correctamente", "success");
            setObservationText("");
            setReload((prev) => !prev);
        } catch (err) {
            console.error("Error al agregar comentario:", err);
        }
    };

    useEffect(() => {
        if (observationsRef.current) {
            observationsRef.current.scrollTop =
                observationsRef.current.scrollHeight;
        }
    }, [request?.observations?.length]);

    const assignedTechnician = availableTechnicians.find(
        (tech) => tech.name === assignedTechnicianName
    );

    const allChecked =
        observerChecks.length > 0 && observerChecks.every((t) => t.check);
    const isDisabled =
        request.requestStatus === "Aprobada y notificada" &&
        observationText.trim() === "";

    return (
        <>
            {showModal && (
                <ModalDeclineReqConfirmation
                    isVisible={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={async () => {
                        setShowModal(false);
                        await handleAction(modalAction);
                        showToast(
                            `La solicitud se ${
                                modalAction === "approve" ? "aprobó" : "rechazó"
                            } correctamente`,
                            "success"
                        );
                        onClose();
                    }}
                    action={modalAction}
                />
            )}
            <div className="w-full max-w-4xl flex justify-center py-2 place-self-center">
                <section>
                    <article className="flex flex-col items-center justify-center p-4 w-full max-w-4xl rounded-xl bg-white font-montserrat text-sm shadow-sm">
                        <div className="grid grid-cols-2 w-full gap-4 divide-primary-blue divide-x">
                            <div className="space-y-1.5 p-2">
                                <p className="mb-3">
                                    <strong>Email</strong>
                                    <br />
                                    {requestedBy?.email}
                                </p>
                                <p className="mb-3">
                                    <strong>Nombre</strong>
                                    <br />
                                    {requestedBy?.name}
                                </p>
                                <p className="mb-3">
                                    <strong>Clave de usuario</strong>
                                    <br />
                                    {requestedBy?.registrationNumber}
                                </p>
                                <p className="mb-3">
                                    <strong>Fecha en que se requiere</strong>
                                    <br />
                                    {requestedDate}
                                </p>
                                <p className="mb-3">
                                    <strong>Horario en que se requiere</strong>
                                    <br />
                                    {requestedTime}
                                </p>
                                <p className="mb-3">
                                    <strong>Área(s) de trabajo</strong>
                                    <br />
                                    {Array.isArray(workArea)
                                        ? workArea
                                              .map(
                                                  (area) => AREAS[area] || area
                                              )
                                              .join(", ")
                                        : AREAS[workArea] || workArea}
                                </p>
                                <p className="mb-3">
                                    <strong>Estado de la solicitud</strong>
                                    <br />
                                    {requestStatus}
                                </p>
                            </div>
                            <div className="space-y-1.5 p-2">
                                <p className="mb-3">
                                    <strong>Tipo</strong>
                                    <br />
                                    {typeOfRequest === "EQ"
                                        ? "Equipo"
                                        : typeOfRequest === "R&M"
                                        ? "Reactivo o Material"
                                        : "Asistencia técnica"}
                                </p>
                                <div className="mb-3">
                                    <strong>Técnico asignado</strong>
                                    <br />
                                    {role === ROLES.TECH ||
                                    noReassignment.includes(requestStatus) ? (
                                        <>{assignedTechnicianName}</>
                                    ) : (
                                        <>
                                            <SelectInput
                                                className="w-auto text-xs font-montserrat"
                                                value={selectedTechnicianId}
                                                onChange={async (e) => {
                                                    const selectedTechnicianId =
                                                        e.target.value;
                                                    setSelectedTechnicianId(
                                                        selectedTechnicianId
                                                    );

                                                    const selectedTechnician =
                                                        availableTechnicians.find(
                                                            (tech) =>
                                                                tech._id ===
                                                                selectedTechnicianId
                                                        );

                                                    if (!selectedTechnician)
                                                        return;

                                                    try {
                                                        const data =
                                                            await apiFetch(
                                                                `/request/${request.id}`,
                                                                {
                                                                    method: "PUT",
                                                                    body: JSON.stringify(
                                                                        {
                                                                            registrationNumber:
                                                                                selectedTechnician.registrationNumber,
                                                                        }
                                                                    ),
                                                                }
                                                            );

                                                        showToast(
                                                            "Técnico reasignado exitosamente",
                                                            "success"
                                                        );
                                                        setReload(
                                                            (prev) => !prev
                                                        );
                                                    } catch (err) {
                                                        showToast(
                                                            "No se pudo asignar el técnico",
                                                            "error"
                                                        );
                                                    }
                                                }}
                                                options={availableTechnicians.map(
                                                    (tech) => ({
                                                        label: tech.name,
                                                        value: tech._id,
                                                    })
                                                )}
                                            />
                                        </>
                                    )}
                                </div>
                                <p className="mb-3 mt-3">
                                    <strong>
                                        {typeOfRequest === "EQ" ? (
                                            <div className="flex items-center gap-1">
                                                <span>
                                                    Equipo(s) que utilizará
                                                </span>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            type="button"
                                                            className="text-gray-500 hover:text-primary-blue transition"
                                                            aria-label="Recordatorio de movimientos"
                                                        >
                                                            <Icon
                                                                icon="mdi:information-outline"
                                                                className="text-base"
                                                            />
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent
                                                        side="right"
                                                        sideOffset={8}
                                                        className="bg-white border border-primary-blue text-black rounded-md shadow-lg text-xs font-poppins font-medium w-auto"
                                                    >
                                                        Verifica disponibilidad
                                                        en "Movimientos".
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        ) : typeOfRequest === "R&M" ? (
                                            "Reactivo(s) o Material(es) que utilizará"
                                        ) : (
                                            "Tipo de apoyo"
                                        )}
                                    </strong>
                                    {typeOfRequest === "EQ" ? "" : <br />}
                                    {typeOfRequest === "TA"
                                        ? requestSubtype || "-"
                                        : occupiedMaterial?.length > 0
                                        ? occupiedMaterial
                                              .map((mat) => mat.name)
                                              .join(", ")
                                        : "-"}
                                </p>
                                <p>
                                    <strong>Observaciones</strong>
                                </p>
                                <div
                                    ref={observationsRef}
                                    className="max-h-32 overflow-y-auto border border-gray-400 rounded-md p-2"
                                >
                                    <ul className="flex flex-col gap-2 text-xs font-montserrat">
                                        {observations?.map((obs, index) => {
                                            const isSystemLog =
                                                obs?.message?.includes(
                                                    "ha iniciado"
                                                ) ||
                                                obs?.message?.includes(
                                                    "ha cancelado"
                                                ) ||
                                                obs?.message?.includes(
                                                    "ha aprobado"
                                                ) ||
                                                obs?.message?.includes(
                                                    "ha rechazado"
                                                );

                                            return (
                                                <li
                                                    key={index}
                                                    className={`rounded-md p-2 break-words ${
                                                        isSystemLog
                                                            ? "bg-gray-100 text-gray-700 italic"
                                                            : "bg-blue-50 text-black"
                                                    }`}
                                                >
                                                    <span className="font-semibold">
                                                        {obs.userName}
                                                    </span>
                                                    : {obs.message}
                                                    <br />
                                                    <span className="text-xs text-gray-500">
                                                        (
                                                        {new Date(
                                                            obs.timestamp
                                                        ).toLocaleString(
                                                            "es-MX"
                                                        )}
                                                        )
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </article>

                    {showActionButtons && (
                        <section className="mt-3 w-full max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl shadow-md p-6 space-y-4">
                            <h2 className="text-base font-semibold font-poppins text-gray-800 border-b border-b-primary-blue pb-2">
                                Revisión de la solicitud
                            </h2>
                            <div
                                className={`grid gap-4 ${
                                    role === ROLES.TECH
                                        ? "grid-cols-1 md:grid-cols-2"
                                        : "grid-cols-1"
                                }`}
                            >
                                <div className="flex flex-col w-full">
                                    <div className="flex items-center gap-1 mb-1">
                                        <label
                                            htmlFor="observation"
                                            className="font-medium text-sm"
                                        >
                                            Observaciones
                                        </label>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    type="button"
                                                    className="text-gray-500 hover:text-primary-blue transition"
                                                    aria-label="Información sobre observaciones"
                                                >
                                                    <Icon
                                                        icon="mdi:information-outline"
                                                        className="text-base"
                                                    />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="right"
                                                sideOffset={8}
                                                className="bg-white border border-primary-blue text-black rounded-md shadow-lg text-xs font-poppins font-medium w-auto"
                                            >
                                                Este campo es opcional.
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>

                                    <textarea
                                        id="observation"
                                        className="border border-gray-400 rounded-md p-3 text-sm h-25 focus:outline-none focus:ring-1 focus:ring-primary-blue font-montserrat focus:border-white"
                                        placeholder="Ej. El equipo no requiere calibración extra. Se entrega a las 10:00 AM."
                                        value={observationText}
                                        onChange={(e) =>
                                            setObservationText(e.target.value)
                                        }
                                        maxLength={150}
                                    />
                                </div>
                                {role === ROLES.TECH && (
                                    <div className="flex flex-col w-full">
                                        <div className="flex items-center gap-1 mb-1">
                                            <label className="font-medium text-sm">
                                                Técnicos subasignados
                                            </label>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        type="button"
                                                        className="text-gray-500 hover:text-primary-blue transition"
                                                        aria-label="Información sobre técnicos subasignados"
                                                    >
                                                        <Icon
                                                            icon="mdi:information-outline"
                                                            className="text-base"
                                                        />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent
                                                    side="right"
                                                    sideOffset={8}
                                                    className="bg-white border border-primary-blue text-black rounded-md shadow-lg text-xs font-poppins font-medium w-auto"
                                                >
                                                    Validar con técnicos
                                                    subasignados.
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>

                                        <div className="flex flex-col gap-x-3 gap-y-1">
                                            {observerChecks?.map((tech) => (
                                                <label
                                                    key={tech._id}
                                                    className="flex items-center gap-2 text-sm"
                                                >
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={tech.check}
                                                            onChange={(e) =>
                                                                handleCheckChange(
                                                                    tech._id,
                                                                    e.target
                                                                        .checked
                                                                )
                                                            }
                                                        />
                                                        <div className="w-4 h-4 border-2 border-primary-blue rounded-xs peer-checked:bg-primary-blue" />
                                                        <svg
                                                            className="absolute top-1/2 left-1/2 w-3.5 h-3.5 text-white transform -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden peer-checked:block"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="3"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <span className="font-poppins text-sm">
                                                        {tech.name}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {request.requestStatus ===
                            "Aprobada y notificada" ? (
                                <div className="flex justify-between pt-1">
                                    <Button
                                        onClick={onCancel}
                                        className="bg-delete-btn hover:bg-delete-btn-hover text-white text-base font-poppins font-semibold py-2 px-4 rounded-md transition inline-flex items-center cursor-pointer"
                                        aria-label="Cancelar solicitud"
                                    >
                                        Cancelar solicitud
                                    </Button>
                                    <Button
                                        disabled={
                                            request.requestStatus ===
                                                "Aprobada y notificada" &&
                                            observationText.trim() === ""
                                        }
                                        className={`text-base font-poppins font-semibold inline-flex items-center px-6 py-2 ${
                                            isDisabled
                                                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                                                : "bg-delete-btn hover:bg-delete-btn-hover text-white transition cursor-pointer"
                                        }`}
                                        onClick={handleComment}
                                        aria-label="Guardar comentario"
                                    >
                                        Agregar comentario
                                    </Button>
                                </div>
                            ) : (
                                <div
                                    className={`flex items-center pt-1 ${
                                        role === ROLES.TECH
                                            ? "justify-end"
                                            : "justify-between"
                                    }`}
                                >
                                    {role === ROLES.ADMIN &&
                                        requestStatus !== "Cancelada" && (
                                            <Button
                                                onClick={onCancel}
                                                className="bg-delete-btn hover:bg-delete-btn-hover text-white text-base font-poppins font-semibold py-2 px-4 rounded-md transition inline-flex items-center cursor-pointer"
                                                aria-label="Cancelar solicitud"
                                            >
                                                Cancelar solicitud
                                            </Button>
                                        )}
                                    <div className="flex gap-4">
                                        <Button
                                            disabled={
                                                role === ROLES.TECH &&
                                                !allChecked
                                            }
                                            className={`text-base font-poppins font-semibold inline-flex items-center px-6 py-2 w-32 ${
                                                role === ROLES.TECH &&
                                                !allChecked
                                                    ? "cursor-not-allowed bg-gray-200 text-gray-400"
                                                    : "bg-reject-btn hover:bg-reject-btn-hover text-white transition cursor-pointer"
                                            }`}
                                            onClick={() => {
                                                setModalAction("reject");
                                                setShowModal(true);
                                            }}
                                            aria-label="Rechazar solicitud"
                                        >
                                            Rechazar
                                        </Button>

                                        <Button
                                            disabled={
                                                role === ROLES.TECH &&
                                                !allChecked
                                            }
                                            className={`text-base font-poppins font-semibold inline-flex items-center px-6 py-2 w-32 ${
                                                role === ROLES.TECH &&
                                                !allChecked
                                                    ? "cursor-not-allowed bg-gray-200 text-gray-400"
                                                    : "bg-approve-btn hover:bg-approve-btn-hover text-white transition cursor-pointer"
                                            }`}
                                            onClick={() => {
                                                setModalAction("approve");
                                                setShowModal(true);
                                            }}
                                            aria-label="Aprobar solicitud"
                                        >
                                            Aprobar
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </section>
                    )}
                </section>
            </div>
        </>
    );
}
