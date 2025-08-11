import { apiFetch, baseUrl } from "@/utils/apiFetch";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import TokenImage from "@/components/ui/Image"
import { showToast } from "@/utils/toastUtils";
import { AREAS } from "@/constants/areas";
import SelectInput from "@/components/ui/SelectInput";
import ModalMovementConfirmation from "@/components/ModalMovementConfirmation";

export default function MovementsDetailsPanel({ request, onClose, setReload, }) {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const statusOptions = [
        { label: "Disponible", value: "available" },
        { label: "En uso", value: "inUse" },
        { label: "Deshabilitado", value: "disabled" },
    ];
    const [newStatus, setNewStatus] = useState(
        statusOptions.find((opt) => opt.value === request?.equipment?.status) || statusOptions[0]
    );

    const {
        bookerName,
        bookerRegistrationNumber,
        startingDate,
        startingTime,
        workArea,
        equipment,
    } = request;

    const handleConfirm = async () => {
        try {
            if (!["available", "inUse", "disabled"].includes(newStatus?.value)) {
                return;
            }
            
            const formData = new FormData();
            formData.append("body", JSON.stringify({ status: newStatus.value }));

            const data = await apiFetch(`/equipment/barcode/${request.equipment.barcode}`,
                {
                    method: "PUT",
                    body: formData,
                }
            );

            showToast("Estado actualizado correctamente", "success");
            onClose();
            setTimeout(() => setReload((prev) => !prev), 0);
        } catch (error) {
            showToast("No se pudo actualizar el estado", "error");
        }
    };

    return (
        <>
            {showConfirmation && (
                <ModalMovementConfirmation
                    onClose={() => setShowConfirmation(false)}
                    onChange={handleConfirm}
                />
            )}
            <div className="w-full max-w-4xl flex justify-center py-2 place-self-center">
                <section className ="w-full">
                    <article className="flex flex-col items-center justify-center p-4 w-full max-w-4xl rounded-xl bg-white font-montserrat text-sm shadow-sm">
                        <div className="grid grid-cols-2 w-full gap-4 divide-primary-blue divide-x">
                            <div className="space-y-1.5 p-2">
                                <p className="mb-3">
                                    <strong>Nombre</strong>
                                    <br />
                                    {bookerName}
                                </p>
                                <p className="mb-3">
                                    <strong>Clave de usuario</strong>
                                    <br />
                                    {bookerRegistrationNumber}
                                </p>
                                <p className="mb-3">
                                    <strong>Fecha en que se requiere</strong>
                                    <br />
                                    {startingDate
                                        ? new Date(startingDate).toLocaleDateString(
                                            "es-MX"
                                        )
                                        : "-"}
                                </p>
                                <p className="mb-3">
                                    <strong>Horario en que se requiere</strong>
                                    <br />
                                    {startingTime || "-"}
                                </p>
                                <p className="mb-3">
                                    <strong>Área(s) de trabajo</strong>
                                    <br />
                                    {Array.isArray(workArea)
                                        ? workArea.map((area) => AREAS[area] || area).join(", ")
                                        : AREAS[workArea] || workArea}
                                </p>
                                <p className="mb-3">
                                    <strong>Estado del equipo</strong>
                                    <br />
                                    <SelectInput
                                        name="status"
                                        value={newStatus.value}
                                        onChange={(e) => {
                                            const selected = statusOptions.find(opt => opt.value === e.target.value);
                                            setNewStatus(selected);
                                        }}
                                        options={statusOptions}
                                        placeholder="Seleccione estado"
                                    />
                                </p>
                            </div>

                            <div className="space-y-1.5 p-2">
                                <p className="mb-3">
                                    <strong>Nombre del equipo</strong>
                                    <br />
                                    {equipment?.name || "-"}
                                </p>
                                <p className="mb-3">
                                    <strong>Marca</strong>
                                    <br />
                                    {equipment?.brand || "-"}
                                </p>
                                <p className="mb-3">
                                    <strong>Modelo</strong>
                                    <br />
                                    {equipment?.model || "-"}
                                </p>
                                <p className="mb-3">
                                    <strong>Ubicación</strong>
                                    <br />
                                    {equipment?.location || "-"}
                                </p>
                                <p className="mb-3">
                                    <strong>Código de barras</strong>
                                    <br />
                                    {equipment?.barcode || "-"}
                                </p>
                                {equipment?.photoID && (
                                    <TokenImage
                                        src={`${baseUrl}/photo/${equipment.photoID}`}
                                        alt="Foto del equipo"
                                        className="mt-2 mx-auto w-[50%] h-40 object-cover"
                                    />
                                )}
                            </div>
                        </div>
                    </article>
                    <div className="flex justify-end gap-4 pt-4 mb-4">
                        <Button
                            onClick={onClose}
                            className="w-40 bg-gray-300 text-gray-600 hover:opacity-85 font-poppins font-semibold text-base"
                            aria-label="Cancelar"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={() => setShowConfirmation(true)}
                            disabled={newStatus.value === equipment?.status}
                            className="w-40 text-white text-base font-poppins font-semibold py-2 text-center cursor-pointer transition bg-sidebar hover:bg-dim-blue-background disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Cambiar estado del equipo"
                        >
                            Cambiar estado
                        </Button>

                    </div>
                </section>
            </div>
        </>
    );
}
