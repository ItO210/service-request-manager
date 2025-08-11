import { apiFetch, baseUrl } from "@/utils/apiFetch";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import TokenImage from "@/components/ui/Image"
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { showToast } from "@/utils/toastUtils";
import ModalProductConfirmation from "@/components/ModalProductConfirmation";
import FileInput from "@/components/ui/FileInput";
import DateInput from "@/components/ui/DateInput";
import SelectInput from "@/components/ui/SelectInput";

export default function AddEquipmentPanel({
    onClose,
    initialData = {},
    isEditing = false,
    setReload,
}) {
    const [modalConfirming, setModalConfirming] = useState(true);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [errors, setErrors] = useState({});
    const requiredFields = [
        "equipmentName",
        "equipmentBrand",
        "equipmentModel",
        "equipmentSerialNumber",
        "equipmentSupplier",
        "vinculatedStrategicProject",
        "barcode",
        "reservationType",
        "location",
        ...(!isEditing ? ["equipmentImage"] : []),
    ];

    const [formData, setFormData] = useState({
        inventoryNumber: "",
        equipmentName: "",
        equipmentBrand: "",
        equipmentModel: "",
        equipmentSerialNumber: "",
        equipmentSupplier: "",
        equipmentImage: null,
        invoiceNumber: "",
        dateOfReception: "",
        SICPatRegistered: "",
        vinculatedStrategicProject: "",
        barcode: "",
        reservationType: "",
        location: "",
        observations: "",
        ...initialData,
    });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            const newValue =
                name === "barcode" ? value.replace(/\s/g, "") : value;

            setFormData((prev) => ({ ...prev, [name]: newValue }));

            setErrors((prevErrors) => ({
                // Delete the error for the field being changed
                ...prevErrors,
                [name]: false,
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        requiredFields.forEach((field) => {
            if (!formData[field]) {
                newErrors[field] = true; // Field is empty
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // True if no errors
    };

    const isFormUnchanged = () => {
        const fieldsToCompare = [
            "inventoryNumber",
            "equipmentName",
            "equipmentBrand",
            "equipmentModel",
            "equipmentSerialNumber",
            "equipmentSupplier",
            "equipmentImage",
            "invoiceNumber",
            "dateOfReception",
            "SICPatRegistered",
            "vinculatedStrategicProject",
            "reservationType",
            "location",
            "observations"
        ];

        for (const field of fieldsToCompare) {
            const formValue = formData[field] ?? "";
            const initialValue = initialData[field] ?? "";

            if (
                field === "dateOfReception" &&
                formValue &&
                initialValue &&
                new Date(formValue).toISOString() !==
                    new Date(initialValue).toISOString()
            ) {
                return false;
            }

            if (formValue !== initialValue) {
                return false;
            }
        }

        return true;
    };


    const handleSubmit = async () => {
        if (!validateForm()) {
            return; // Stop submission if validation fails
        }
        const equipmentData = {
            inventoryNumber: String(formData.inventoryNumber),
            equipmentName: String(formData.equipmentName),
            equipmentBrand: String(formData.equipmentBrand),
            equipmentModel: String(formData.equipmentModel),
            equipmentSerialNumber: String(formData.equipmentSerialNumber),
            equipmentSupplier: String(formData.equipmentSupplier),
            invoiceNumber: String(formData.invoiceNumber),
            dateOfReception: formData.dateOfReception
                ? new Date(formData.dateOfReception).toISOString()
                : null,
            SICPatRegistered: String(formData.SICPatRegistered),
            vinculatedStrategicProject: String(
                formData.vinculatedStrategicProject
            ),
            barcode: String(formData.barcode),
            reservationType: String(formData.reservationType),
            location: String(formData.location),
            observations: String(formData.observations),
        };

        const equipmentFormData = new FormData();
        equipmentFormData.append("body", JSON.stringify(equipmentData));
        if (formData.equipmentImage) {
            equipmentFormData.append("thumbnail", formData.equipmentImage);
        }

        try {
            const data = await apiFetch("/equipment",
                {
                    method: "POST",
                    body: equipmentFormData,
                }
            );

            setModalConfirming(false);
            setShowConfirmation(true);
        } catch (error) {
            showToast("El código de barras ya está registrado, inténtelo de nuevo", "error");
        }
    };

    const handleEdit = async () => {
        if (!validateForm()) {
            return;
        }

        const equipmentData = {
            inventoryNumber: String(formData.inventoryNumber),
            equipmentName: String(formData.equipmentName),
            equipmentBrand: String(formData.equipmentBrand),
            equipmentModel: String(formData.equipmentModel),
            equipmentSerialNumber: String(formData.equipmentSerialNumber),
            equipmentSupplier: String(formData.equipmentSupplier),
            equipmentImage: String(formData.equipmentImage),
            invoiceNumber: String(formData.invoiceNumber),
            dateOfReception: formData.dateOfReception
                ? new Date(formData.dateOfReception).toISOString()
                : null,
            SICPatRegistered: String(formData.SICPatRegistered),
            vinculatedStrategicProject: String(
                formData.vinculatedStrategicProject
            ),
            barcode: String(formData.barcode),
            reservationType: String(formData.reservationType),
            location: String(formData.location),
            observations: String(formData.observations),
        };

        const equipmentFormData = new FormData();
        equipmentFormData.append("body", JSON.stringify(equipmentData));
        if (formData.equipmentImage) {
            equipmentFormData.append("thumbnail", formData.equipmentImage);
        }

        try {
            const data = await apiFetch(`/equipment/barcode/${initialData.barcode}`,
                {
                    method: "PUT",
                    body: equipmentFormData,
                }
            );

            showToast("Equipo editado exitosamente", "success");
            onClose();
            setTimeout(() => {
                setReload((prev) => !prev);
            }, 0);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleDelete = async () => {
        try {
            const data = await apiFetch(`/equipment/barcode/${formData.barcode}`,
                {
                    method: "DELETE",
                }
            );

            showToast("Equipo eliminado exitosamente", "success");
            onClose();
            setTimeout(() => {
                setReload((prev) => !prev);
            }, 0);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <>
            {showConfirmation && (
                <ModalProductConfirmation
                    onClose={() => setShowConfirmation(false)}
                    onDelete={handleDelete}
                    isConfirming={modalConfirming}
                />
            )}

            <div
                className={cn(
                    "flex flex-col gap-4 text-sm text-black font-montserrat bg-white rounded-xl",
                    isEditing && "shadow-sm"
                )}
            >
                {/* Columns Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-x divide-primary-blue">
                    {/* Column 1 - Información general */}
                    <fieldset className="space-y-2 p-4">
                        <h2 className="font-poppins font-bold text-base text-center mt-2 mb-2">
                            Información general
                        </h2>
                        <label className="flex flex-col font-montserrat font-semibold">
                            Número de inventario
                            <Input
                                name="inventoryNumber"
                                value={formData.inventoryNumber}
                                onChange={handleChange}
                                placeholder="Ingrese el número de inventario"
                                className="mt-1 placeholder:text-xs placeholder:font-montserrat placeholder:font-normal font-normal h-8"
                            />
                        </label>
                        {[
                            [
                                "equipmentName",
                                "Nombre del equipo",
                                "Ingrese el nombre del equipo",
                            ],
                            ["equipmentBrand", "Marca", "Ingrese la marca"],
                            ["equipmentModel", "Modelo", "Ingrese el modelo"],
                            [
                                "equipmentSerialNumber",
                                "Número de serie",
                                "Ingrese el número de serie",
                            ],
                            [
                                "equipmentSupplier",
                                "Proveedor",
                                "Ingrese el proveedor",
                            ],
                        ].map(([name, label, placeholder]) => (
                            <label
                                key={name}
                                className="flex flex-col font-montserrat font-semibold"
                            >
                                <span>
                                    {label}{" "}
                                    <span className="text-red-500">*</span>
                                </span>
                                <Input
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    placeholder={placeholder}
                                    required
                                    showError={errors[name]}
                                    errorMessage={"Este campo es obligatorio"}
                                    className="mt-1 placeholder:text-xs placeholder:font-montserrat placeholder:font-normal font-normal h-8"
                                />
                            </label>
                        ))}
                        <label className="flex flex-col font-montserrat font-semibold">
                            <span>
                                Imagen <span className="text-red-500">*</span>
                            </span>
                            <FileInput
                                name="equipmentImage"
                                value={formData.equipmentImage}
                                onChange={handleChange}
                                required={!isEditing}
                                showError={errors.equipmentImage}
                                errorMessage={"Este campo es obligatorio"}
                                className="placeholder:text-xs placeholder:font-montserrat placeholder:font-normal h-8"
                            />
                            {formData.equipmentImage ? (
                                <img
                                    src={URL.createObjectURL(formData.equipmentImage)}
                                    alt="Imagen del equipo"
                                    className="mt-2 mx-auto w-[50%] h-40 object-cover"
                                />
                            ) : isEditing && initialData.photoId ? (
                                <TokenImage
                                    src={`${baseUrl}/photo/${initialData.photoId}`}
                                    alt="Imagen del equipo"
                                    className="mt-2 mx-auto w-[50%] h-40 object-cover"
                                />
                            ) : null}
                        </label>
                    </fieldset>

                    {/* Column 2 - Trazabilidad */}
                    <fieldset className="space-y-2 p-4">
                        <h2 className="font-poppins font-bold text-base text-center mt-2 mb-2">
                            Trazabilidad
                        </h2>
                        <label className="flex flex-col font-montserrat font-semibold">
                            Número de factura
                            <Input
                                name="invoiceNumber"
                                value={formData.invoiceNumber}
                                onChange={handleChange}
                                placeholder="Ingrese el número de factura"
                                className="mt-1 placeholder:text-xs placeholder:font-montserrat placeholder:font-normal font-normal h-8"
                            />
                        </label>
                        <label className="flex flex-col font-montserrat font-semibold">
                            Fecha de llegada
                            <DateInput
                                name="dateOfReception"
                                value={formData.dateOfReception}
                                onChange={handleChange}
                                className="mt-1 placeholder:text-xs placeholder:font-montserrat placeholder:font-normal font-normal h-8"
                            />
                        </label>
                        <label className="flex flex-col font-montserrat font-semibold">
                            Registro en SICPat
                            <Input
                                name="SICPatRegistered"
                                value={formData.SICPatRegistered}
                                onChange={handleChange}
                                placeholder="Ingrese el registro"
                                className="mt-1 placeholder:text-xs placeholder:font-montserrat placeholder:font-normal font-normal h-8"
                            />
                        </label>
                        <label className="flex flex-col font-montserrat font-semibold">
                            <span>
                                Proyecto estratégico vinculado{" "}
                                <span className="text-red-500">*</span>
                            </span>
                            <Input
                                name="vinculatedStrategicProject"
                                value={formData.vinculatedStrategicProject}
                                onChange={handleChange}
                                placeholder="Ingrese el proyecto vinculado"
                                required
                                showError={errors.vinculatedStrategicProject}
                                errorMessage={"Este campo es obligatorio"}
                                className="mt-1 placeholder:text-xs placeholder:font-montserrat placeholder:font-normal font-normal h-8"
                            />
                        </label>
                        <label className="flex flex-col font-montserrat font-semibold">
                            {isEditing ? (
                                <>
                                    <span>Código de barras</span>
                                    <p className="font-montserrat font-normal">
                                        {formData.barcode}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <span>
                                        Escanear código de barras{" "}
                                        <span className="text-red-500">*</span>
                                    </span>
                                    <Input
                                        name="barcode"
                                        value={formData.barcode}
                                        onChange={handleChange}
                                        placeholder="Haga clic y escanee"
                                        required
                                        showError={errors.barcode}
                                        errorMessage={
                                            "Este campo es obligatorio"
                                        }
                                        className="mt-1 placeholder:text-xs placeholder:font-montserrat placeholder:font-normal font-normal h-8"
                                    />
                                </>
                            )}
                        </label>
                    </fieldset>

                    {/* Column 3 - Estado y uso */}
                    <fieldset className="space-y-2 p-4">
                        <h2 className="font-poppins font-bold text-base text-center mt-2 mb-2">
                            Estado y uso
                        </h2>
                        <label className="flex flex-col font-montserrat font-semibold">
                            <span>
                                Duración de la reserva{" "}
                                <span className="text-red-500">*</span>
                            </span>
                            <SelectInput
                                name="reservationType"
                                value={formData.reservationType}
                                onChange={handleChange}
                                required
                                placeholder="Seleccione la duración de uso"
                                options={[
                                    { value: "N", label: "Corta" },
                                    { value: "H", label: "Media" },
                                    { value: "D", label: "Larga" },
                                ]}
                                showError={errors.reservationType}
                                errorMessage={"Este campo es obligatorio"}
                            />
                        </label>
                        <label className="flex flex-col font-montserrat font-semibold">
                            <span>
                                Ubicación{" "}
                                <span className="text-red-500">*</span>
                            </span>
                            <Input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Ingrese la ubicación"
                                required
                                showError={errors.location}
                                errorMessage={"Este campo es obligatorio"}
                                className="mt-1 placeholder:text-xs placeholder:font-montserrat placeholder:font-normal font-normal h-8"
                            />
                        </label>
                        <label className="flex flex-col font-montserrat font-semibold">
                            Observaciones
                            <textarea
                                name="observations"
                                value={formData.observations}
                                onChange={handleChange}
                                placeholder="Ingrese observaciones sobre el equipo"
                                className="mt-1 w-full h-24 rounded-md border border-gray-500 p-2 placeholder:text-xs placeholder:font-montserrat font-normal focus:outline-none focus:ring-1 focus:ring-primary-blue focus:border-transparent focus:bg-input-background"
                                maxLength={150}
                            />
                        </label>
                    </fieldset>
                </div>
            </div>

            {/* Buttons */}
            {isEditing ? (
                <div className="flex justify-between pt-4 mb-4">
                    <div className="flex ml-4">
                        <Button
                            className="bg-delete-btn hover:bg-delete-btn-hover text-white text-base font-poppins font-semibold py-2 px-4 rounded-md transition inline-flex items-center cursor-pointer"
                            onClick={() => {
                                setModalConfirming(true);
                                setShowConfirmation(true);
                            }}
                            aria-label="Eliminar producto"
                        >
                            <Icon
                                icon="ix:trashcan-filled"
                                className="mr-2 text-xl"
                            />
                            Eliminar equipo
                        </Button>
                    </div>
                    <div className="flex gap-4 mr-4">
                        <Button
                            onClick={onClose}
                            className="w-40 bg-gray-300 text-gray-600 hover:opacity-85 font-poppins font-semibold text-base"
                            aria-label="Cancelar"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={() => handleEdit()}
                            disabled={isFormUnchanged()}
                            className={`w-40 text-white text-base font-poppins font-semibold py-2 text-center ${
                                isFormUnchanged()
                                    ? "cursor-not-allowed bg-gray-200 text-gray-400"
                                    : "cursor-pointer transition bg-sidebar hover:bg-dim-blue-background"
                            }`}
                            aria-label="Aplicar cambios"
                        >
                            Aplicar cambios
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center gap-4 pt-4 mb-4">
                    <Button
                        onClick={onClose}
                        className="w-40 bg-gray-300 text-gray-600 hover:opacity-85 font-poppins font-semibold text-lg"
                        aria-label="Cancelar"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="w-40 bg-sidebar hover:bg-dim-blue-background text-white font-poppins font-semibold text-lg"
                        aria-label="Agregar equipo"
                    >
                        Agregar
                    </Button>
                </div>
            )}
        </>
    );
}
