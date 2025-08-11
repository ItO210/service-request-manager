import { apiFetch, baseUrl } from "@/utils/apiFetch";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TokenImage from "@/components/ui/Image"
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { showToast } from "@/utils/toastUtils";
import ModalProductConfirmation from "@/components/ModalProductConfirmation";
import FileInput from "@/components/ui/FileInput";
import DateInput from "@/components/ui/DateInput";
import SelectInput from "@/components/ui/SelectInput";

export default function AddReagentPanel({
    onClose,
    initialData = {},
    isEditing = false,
    setReload,
}) {
    const [modalConfirming, setModalConfirming] = useState(true);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [errors, setErrors] = useState({});
    const requiredFields = [
        "reagentCode",
        "reagentName",
        "reagentPresentation",
        "reagentWeightVolume",
        "reagentBrand",
        "reagentCatalog",
        "reagentSupplier",
        "reagentLot",
        "receivingTemperature",
        // "dateOpened", check data type
        // "expirationDate",
        "vinculatedStrategicProject",
        "barcode",
        "nfpaName",
        "storageClass",
        "casNumber",
        "explosive",
        "oxidizing",
        "flammable",
        "corrosive",
        "toxic",
        "mutagenicOrCarcinogenic",
        "irritation",
        "compressedGases",
        "healthHazard",
        "flammability",
        "reactivity",
        "contact",
        "location",
        "reagentSticker",
    ];

    const [formData, setFormData] = useState({
        reagentCode: "",
        reagentName: "",
        reagentPresentation: "",
        reagentWeightVolume: "",
        reagentBrand: "",
        reagentCatalog: "",
        reagentSupplier: "",
        reagentImage: null,
        reagentLot: "",
        dateOfReception: "",
        receivingTemperature: "",
        dateOpened: "",
        dateFinished: "",
        expirationDate: "",
        invoiceNumber: "",
        vinculatedStrategicProject: "",
        barcode: "",
        nfpaName: "",
        storageClass: "",
        casNumber: "",
        safetyDataSheet: "",
        sdsLink: "",
        pictogramImage: null,
        explosive: "",
        oxidizing: "",
        flammable: "",
        corrosive: "",
        toxic: "",
        mutagenicOrCarcinogenic: "",
        irritation: "",
        compressedGases: "",
        healthHazard: "",
        flammability: "",
        reactivity: "",
        contact: "",
        location: "",
        reagentSticker: "",
        observations: "",
        ...initialData,
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "checkbox") {
            const checked = e.target.checked;
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
                // If unchecked, set the field to an empty string
                ...(name === "safetyDataSheet" && !checked
                    ? { sdsLink: "" }
                    : {}),
            }));
        } else if (type === "file") {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            const newValue =
                name === "barcode" ? value.replace(/\s/g, "") : value;

            setFormData((prev) => ({ ...prev, [name]: newValue }));

            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: false,
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        requiredFields.forEach((field) => {
            const value = formData[field];

            const isEmpty = // To make sure that 0 is not considered as empty
                value === "" || value === null || value === undefined;

            if (isEmpty) {
                newErrors[field] = true;
            }
        });

        if (formData.safetyDataSheet) {
            const isValidUrl = (string) => {
                try {
                    new URL(string);
                    return true;
                } catch (_) {
                    return false;
                }
            };

            if (!formData.sdsLink || !isValidUrl(formData.sdsLink)) {
                newErrors.sdsLink = "Ingrese un enlace válido";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isFormUnchanged = () => {
        const fieldsToCompare = [
            "reagentCode",
            "reagentName",
            "reagentPresentation",
            "reagentWeightVolume",
            "reagentBrand",
            "reagentCatalog",
            "reagentSupplier",
            "reagentImage",
            "reagentLot",
            "dateOfReception",
            "receivingTemperature",
            "dateOpened",
            "dateFinished",
            "expirationDate",
            "invoiceNumber",
            "vinculatedStrategicProject",
            "nfpaName",
            "storageClass",
            "casNumber",
            "safetyDataSheet",
            "sdsLink",
            "pictogramImage",
            "explosive",
            "oxidizing",
            "flammable",
            "corrosive",
            "toxic",
            "mutagenicOrCarcinogenic",
            "irritation",
            "compressedGases",
            "healthHazard",
            "flammability",
            "reactivity",
            "contact",
            "location",
            "reagentSticker",
            "observations",
        ];

        for (const field of fieldsToCompare) {
            const formValue = formData[field] ?? "";
            const initialValue = initialData[field] ?? "";

            if (
                typeof formValue === "boolean" &&
                formValue !== Boolean(initialValue)
            ) {
                return false;
            }

            if (!isNaN(formValue) && !isNaN(initialValue)) {
                if (Number(formValue) !== Number(initialValue)) return false;
                continue;
            }

            if (
                [
                    "dateOfReception",
                    "dateOpened",
                    "dateFinished",
                    "expirationDate",
                ].includes(field) &&
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
        const reagentData = {
            reagentCode: String(formData.reagentCode),
            reagentName: String(formData.reagentName),
            reagentPresentation: String(formData.reagentPresentation),
            reagentWeightVolume: String(formData.reagentWeightVolume),
            reagentBrand: String(formData.reagentBrand),
            reagentCatalog: String(formData.reagentCatalog),
            reagentSupplier: String(formData.reagentSupplier),
            reagentLot: String(formData.reagentLot),
            dateOfReception: formData.dateOfReception
                ? new Date(formData.dateOfReception).toISOString()
                : null,
            receivingTemperature: String(formData.receivingTemperature),
            dateOpened: formData.dateOpened
                ? new Date(formData.dateOpened).toISOString()
                : null,
            dateFinished: formData.dateFinished
                ? new Date(formData.dateFinished).toISOString()
                : null,
            expirationDate: formData.expirationDate
                ? new Date(formData.expirationDate).toISOString()
                : null,
            invoiceNumber: String(formData.invoiceNumber),
            vinculatedStrategicProject: String(
                formData.vinculatedStrategicProject
            ),
            barcode: String(formData.barcode),
            nfpaName: String(formData.nfpaName),
            storageClass: String(formData.storageClass),
            casNumber: String(formData.casNumber),
            safetyDataSheet: Boolean(formData.safetyDataSheet),
            sdsLink: String(formData.sdsLink),
            explosive: parseInt(formData.explosive, 10),
            oxidizing: parseInt(formData.oxidizing, 10),
            flammable: parseInt(formData.flammable, 10),
            corrosive: parseInt(formData.corrosive, 10),
            toxic: parseInt(formData.toxic, 10),
            mutagenicOrCarcinogenic: parseInt(
                formData.mutagenicOrCarcinogenic,
                10
            ),
            irritation: parseInt(formData.irritation, 10),
            compressedGases: parseInt(formData.compressedGases, 10),
            healthHazard: parseInt(formData.healthHazard, 10),
            flammability: parseInt(formData.flammability, 10),
            reactivity: parseInt(formData.reactivity, 10),
            contact: parseInt(formData.contact, 10),
            location: String(formData.location),
            reagentSticker: parseInt(formData.reagentSticker, 10),
            observations: String(formData.observations),
        };

        const reagentFormData = new FormData();
        reagentFormData.append("body", JSON.stringify(reagentData));
        if (formData.reagentImage instanceof File) {
            reagentFormData.append("thumbnail", formData.reagentImage);
        }
        if (formData.pictogramImage instanceof File) {
            reagentFormData.append("pictogram", formData.pictogramImage);
        }

        try {
            const data = await apiFetch("/reagent",
                {
                    method: "POST",
                    body: reagentFormData,
                }
            );

            setModalConfirming(false);
            setShowConfirmation(true);
        } catch (error) {
            showToast("El código de barras ya está registrado, inténtelo de nuevo","error");
        }
    };

    const handleEdit = async () => {
        if (!validateForm()) {
            return;
        }

        const reagentData = {
            reagentCode: String(formData.reagentCode),
            reagentName: String(formData.reagentName),
            reagentPresentation: String(formData.reagentPresentation),
            reagentWeightVolume: String(formData.reagentWeightVolume),
            reagentBrand: String(formData.reagentBrand),
            reagentCatalog: String(formData.reagentCatalog),
            reagentSupplier: String(formData.reagentSupplier),
            reagentImage: String(formData.reagentImage),
            reagentLot: String(formData.reagentLot),
            dateOfReception: formData.dateOfReception
                ? new Date(formData.dateOfReception).toISOString()
                : null,
            receivingTemperature: String(formData.receivingTemperature),
            dateOpened: formData.dateOpened
                ? new Date(formData.dateOpened).toISOString()
                : null,
            dateFinished: formData.dateFinished
                ? new Date(formData.dateFinished).toISOString()
                : null,
            expirationDate: formData.expirationDate
                ? new Date(formData.expirationDate).toISOString()
                : null,
            invoiceNumber: String(formData.invoiceNumber),
            vinculatedStrategicProject: String(
                formData.vinculatedStrategicProject
            ),
            barcode: String(formData.barcode),
            nfpaName: String(formData.nfpaName),
            storageClass: String(formData.storageClass),
            casNumber: String(formData.casNumber),
            safetyDataSheet: Boolean(formData.safetyDataSheet),
            sdsLink: String(formData.sdsLink),
            pictogramImage: String(formData.pictogramImage),
            explosive: parseInt(formData.explosive, 10),
            oxidizing: parseInt(formData.oxidizing, 10),
            flammable: parseInt(formData.flammable, 10),
            corrosive: parseInt(formData.corrosive, 10),
            toxic: parseInt(formData.toxic, 10),
            mutagenicOrCarcinogenic: parseInt(
                formData.mutagenicOrCarcinogenic,
                10
            ),
            irritation: parseInt(formData.irritation, 10),
            compressedGases: parseInt(formData.compressedGases, 10),
            healthHazard: parseInt(formData.healthHazard, 10),
            flammability: parseInt(formData.flammability, 10),
            reactivity: parseInt(formData.reactivity, 10),
            contact: parseInt(formData.contact, 10),
            location: String(formData.location),
            reagentSticker: parseInt(formData.reagentSticker, 10),
            observations: String(formData.observations),
        };

        const reagentFormData = new FormData();
        reagentFormData.append("body", JSON.stringify(reagentData));
        if (formData.reagentImage instanceof File) {
            reagentFormData.append("thumbnail", formData.reagentImage);
        }
        if (formData.pictogramImage instanceof File) {
            reagentFormData.append("pictogram", formData.pictogramImage);
        }

        try {
            const data = await apiFetch(`/reagent/${formData.barcode}`,
                {
                    method: "PUT",
                    body: reagentFormData,
                }
            );

            showToast("Reactivo editado exitosamente", "success");
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
            const data = await apiFetch(`/reagent/barcode/${formData.barcode}`,
                {
                    method: "DELETE",
                }
            );

            showToast("Reactivo eliminado exitosamente", "success");
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 divide-x divide-primary-blue">
                    {/* Column 1 Información general */}
                    <fieldset className="space-y-2 p-4">
                        <h2 className="font-poppins font-bold text-base text-center mt-2 mb-2">
                            Información general
                        </h2>
                        {[
                            ["reagentCode", "Código", "Ingrese el código"],
                            ["reagentName", "Nombre", "Ingrese el nombre"],
                            [
                                "reagentPresentation",
                                "Presentación",
                                "Ingrese la presentación",
                            ],
                            [
                                "reagentWeightVolume",
                                "Peso/Volumen",
                                "Ingrese el peso o volumen",
                            ],
                            ["reagentBrand", "Marca", "Ingrese la marca"],
                            [
                                "reagentCatalog",
                                "Catálogo",
                                "Ingrese el catálogo",
                            ],
                            [
                                "reagentSupplier",
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
                                Imagen
                            </span>
                            <FileInput
                                name="reagentImage"
                                value={formData.reagentImage}
                                onChange={handleChange}
                                required={!isEditing}
                                showError={errors.reagentImage}
                                errorMessage={"Este campo es obligatorio"}
                                className="placeholder:text-xs placeholder:font-montserrat placeholder:font-normal h-8"
                            />
                            {formData.reagentImage ? (
                                <img
                                    src={URL.createObjectURL(formData.reagentImage)}
                                    alt="Imagen del reactivo"
                                    className="mt-2 mx-auto w-[50%] h-40 object-cover"
                                />
                            ) : isEditing && initialData.photoId ? (
                                <TokenImage
                                    src={`${baseUrl}/photo/${initialData.photoId}`}
                                    alt="Imagen del reactivo"
                                    className="mt-2 mx-auto w-[50%] h-40 object-cover"
                                />
                            ) : null}
                        </label>
                    </fieldset>

                    {/* Column 2 Trazabilidad */}
                    <fieldset className="space-y-2 p-4">
                        <h2 className="font-poppins font-bold text-base text-center mt-2 mb-2">
                            Trazabilidad
                        </h2>
                        <label className="flex flex-col font-montserrat font-semibold">
                            <span>
                                Lote <span className="text-red-500">*</span>
                            </span>
                            <Input
                                type="text"
                                name="reagentLot"
                                value={formData.reagentLot}
                                onChange={handleChange}
                                placeholder="Ingrese el lote"
                                required
                                showError={errors.reagentLot}
                                errorMessage={"Este campo es obligatorio"}
                                className="mt-1 placeholder:text-xs placeholder:font-montserrat placeholder:font-normal font-normal h-8"
                            />
                        </label>
                        <label className="flex flex-col font-montserrat font-semibold">
                            Fecha de llegada
                            <DateInput
                                name="dateOfReception"
                                value={formData.dateOfReception}
                                onChange={handleChange}
                                placeholder="Ingrese la fecha de llegada dd-mm-aaaa"
                                className="mt-1 placeholder:text-xs placeholder:font-montserrat placeholder:font-normal font-normal h-8"
                            />
                        </label>
                        <label className="flex flex-col font-montserrat font-semibold">
                            <span>
                                Temperatura de recepción
                                <span className="text-red-500">*</span>
                            </span>
                            <Input
                                type="text"
                                name="receivingTemperature"
                                value={formData.receivingTemperature}
                                onChange={handleChange}
                                placeholder="Ingrese la temperatura"
                                required
                                showError={errors.receivingTemperature}
                                errorMessage={"Este campo es obligatorio"}
                                className="mt-1 placeholder:text-xs placeholder:font-montserrat placeholder:font-normal font-normal h-8"
                            />
                        </label>
                        <label className="flex flex-col font-montserrat font-semibold">
                            Fecha de apertura
                            <DateInput
                                name="dateOpened"
                                value={formData.dateOpened}
                                onChange={handleChange}
                                placeholder="Ingrese la fecha de apertura"
                                className="mt-1 placeholder:text-xs placeholder:font-montserrat placeholder:font-normal font-normal h-8"
                            />
                        </label>
                        <label className="flex flex-col font-montserrat font-semibold">
                            Fecha de término
                            <DateInput
                                name="dateFinished"
                                value={formData.dateFinished}
                                onChange={handleChange}
                                placeholder="Ingrese la fecha de término"
                                className="mt-1 placeholder:text-xs placeholder:font-montserrat placeholder:font-normal font-normal h-8"
                            />
                        </label>
                        <label className="flex flex-col font-montserrat font-semibold">
                            <span>Fecha de caducidad</span>
                            <DateInput
                                name="expirationDate"
                                value={formData.expirationDate}
                                onChange={handleChange}
                                placeholder="Ingrese la fecha de caducidad"
                                className="mt-1 placeholder:text-xs placeholder:font-montserrat placeholder:font-normal font-normal h-8"
                            />
                        </label>
                        <label className="flex flex-col font-montserrat font-semibold">
                            Número de factura
                            <Input
                                type="text"
                                name="invoiceNumber"
                                value={formData.invoiceNumber}
                                onChange={handleChange}
                                placeholder="Ingrese el número de factura"
                                className="mt-1 placeholder:text-xs placeholder:font-montserrat placeholder:font-normal font-normal h-8"
                            />
                        </label>
                        <label className="flex flex-col font-montserrat font-semibold">
                            <span>
                                Proyecto estratégico vinculado{" "}
                                <span className="text-red-500">*</span>
                            </span>
                            <Input
                                type="text"
                                name="vinculatedStrategicProject"
                                value={formData.vinculatedStrategicProject}
                                onChange={handleChange}
                                placeholder="Ingrese el proyecto"
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

                    {/* Column 3 Clasificación NFPA */}
                    <fieldset className="space-y-2 p-4">
                        <h2 className="font-poppins font-bold text-base text-center mt-2 mb-2">
                            Clasificación NFPA
                        </h2>
                        {[
                            [
                                "nfpaName",
                                "Nombre NFPA",
                                "Ingrese el nombre NFPA",
                            ],
                            [
                                "storageClass",
                                "Clase de almacenamiento",
                                "Ingrese la clase (TRGS 510)",
                            ],
                            [
                                "casNumber",
                                "Número CAS",
                                "Ingrese el número CAS",
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
                        <label className="flex items-center font-montserrat font-semibold gap-2">
                            Hoja de seguridad
                            <input
                                type="checkbox"
                                name="safetyDataSheet"
                                checked={formData.safetyDataSheet}
                                onChange={handleChange}
                                className="h-4 w-4"
                            />
                        </label>
                        {formData.safetyDataSheet && (
                            <label className="flex flex-col font-montserrat font-semibold">
                                Enlace de hoja
                                <Input
                                    name="sdsLink"
                                    type="url"
                                    value={formData.sdsLink}
                                    placeholder="Ingrese el enlace"
                                    onChange={handleChange}
                                    className={`mt-1 placeholder:text-xs placeholder:font-montserrat placeholder:font-normal font-normal h-8 ${
                                        errors.sdsLink ? "border-red-500" : ""
                                    }`}
                                />
                                {errors.sdsLink && (
                                    <span className="text-red-500 text-xs mt-1">
                                        {errors.sdsLink}
                                    </span>
                                )}
                            </label>
                        )}
                        <label className="flex flex-col font-montserrat font-semibold">
                            Pictograma
                            <FileInput
                                name="pictogramImage"
                                value={formData.pictogramImage}
                                onChange={handleChange}
                                required={!isEditing}
                                showError={errors.pictogramImage}
                                errorMessage={"Este campo es obligatorio"}
                                className="placeholder:text-xs placeholder:font-montserrat placeholder:font-normal h-8"
                            />
                            {formData.pictogramImage ? (
                                <img
                                    src={URL.createObjectURL(formData.pictogramImage)}
                                    alt="Pictograma del reactivo"
                                    className="mt-2 mx-auto w-[50%] h-40 object-cover"
                                />
                            ) : isEditing && initialData.pictogramId ? (
                                <TokenImage
                                    src={`${baseUrl}/photo/${initialData.pictogramId}`}
                                    alt="Pictograma del reactivo"
                                    className="mt-2 mx-auto w-[50%] h-40 object-cover"
                                />
                            ) : null}
                        </label>
                    </fieldset>

                    {/* Column 4 Seguridad y riesgos */}
                    <fieldset className="space-y-2 p-4">
                        <h2 className="font-poppins font-bold text-base text-center mt-2 mb-2">
                            Seguridad y riesgos
                        </h2>
                        {[
                            ["explosive", "Explosivo", "Ingrese el riesgo"],
                            [
                                "oxidizing",
                                "Comburente/Oxidante",
                                "Ingrese el riesgo",
                            ],
                            ["flammable", "Inflamable", "Ingrese el riesgo"],
                            ["corrosive", "Corrosivo", "Ingrese el riesgo"],
                            ["toxic", "Tóxico", "Ingrese el riesgo"],
                            [
                                "mutagenicOrCarcinogenic",
                                "Mutagénico cancerígeno",
                                "Ingrese el riesgo",
                            ],
                            [
                                "irritation",
                                "Irritación cutánea",
                                "Ingrese el riesgo",
                            ],
                            [
                                "compressedGases",
                                "Gases comprimidos",
                                "Ingrese el riesgo",
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
                                    type="number"
                                    min="0"
                                    max="4"
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
                        <label className="flex flex-col font-montserrat font-semibold ">
                            <span className="text-health-field">
                                Salud <span className="text-red-500">*</span>
                            </span>
                            <Input
                                type="number"
                                name="healthHazard"
                                value={formData.healthHazard}
                                placeholder="Ingrese el riesgo"
                                required
                                showError={errors.healthHazard}
                                errorMessage={"Este campo es obligatorio"}
                                min="0"
                                max="4"
                                onChange={handleChange}
                                className="mt-1 placeholder:text-xs placeholder:font-montserrat placeholder:font-normal font-normal h-8"
                            />
                        </label>
                        <label className="flex flex-col font-montserrat font-semibold">
                            <span className="text-flammable-field">
                                Flamable <span className="text-red-500">*</span>
                            </span>
                            <Input
                                type="number"
                                name="flammability"
                                value={formData.flammability}
                                placeholder="Ingrese el riesgo"
                                required
                                showError={errors.flammability}
                                errorMessage={"Este campo es obligatorio"}
                                min="0"
                                max="4"
                                onChange={handleChange}
                                className="mt-1 placeholder:text-xs placeholder:font-montserrat placeholder:font-normal font-normal h-8"
                            />
                        </label>
                        <label className="flex flex-col font-montserrat font-semibold">
                            <span className="text-reactivity-field">
                                Reactividad{" "}
                                <span className="text-red-500">*</span>
                            </span>
                            <Input
                                type="number"
                                name="reactivity"
                                value={formData.reactivity}
                                placeholder="Ingrese el riesgo"
                                required
                                showError={errors.reactivity}
                                errorMessage={"Este campo es obligatorio"}
                                min="0"
                                max="4"
                                onChange={handleChange}
                                className="mt-1 placeholder:text-xs placeholder:font-montserrat placeholder:font-normal font-normal h-8"
                            />
                        </label>
                        <label className="font-montserrat font-semibold">
                            <span>
                                Contacto <span className="text-red-500">*</span>
                            </span>
                            <Input
                                type="number"
                                name="contact"
                                value={formData.contact}
                                placeholder="Ingrese el riesgo"
                                required
                                showError={errors.contact}
                                errorMessage={"Este campo es obligatorio"}
                                min="0"
                                max="4"
                                onChange={handleChange}
                                className="mt-1 placeholder:text-xs placeholder:font-montserrat placeholder:font-normal font-normal h-8"
                            />
                        </label>
                    </fieldset>

                    {/* Column 5 Estado y uso */}
                    <fieldset className="space-y-2 p-4">
                        <h2 className="font-poppins font-bold text-base text-center mt-2 mb-2">
                            Estado y uso
                        </h2>
                        <label className="flex flex-col font-montserrat font-semibold">
                            <span>
                                Ubicación{" "}
                                <span className="text-red-500">*</span>
                            </span>
                            <Input
                                type="text"
                                name="location"
                                value={formData.location}
                                placeholder="Ingrese la ubicación"
                                required
                                showError={errors.location}
                                errorMessage={"Este campo es obligatorio"}
                                onChange={handleChange}
                                className="mt-1 placeholder:text-xs placeholder:font-montserrat placeholder:font-normal font-normal h-8"
                            />
                        </label>
                        <label className="flex flex-col font-montserrat font-semibold">
                            <span>
                                Sticker <span className="text-red-500">*</span>
                            </span>
                            <SelectInput
                                name="reagentSticker"
                                value={formData.reagentSticker}
                                onChange={handleChange}
                                required
                                placeholder="Seleccione el color"
                                options={[
                                    { label: "Verde", value: 3 },
                                    { label: "Azul", value: 2 },
                                    { label: "Amarillo", value: 1 },
                                    { label: "Rojo", value: 4 },
                                ]}
                                showError={errors.reagentSticker}
                                errorMessage="Este campo es obligatorio"
                            />
                        </label>
                        <label className="font-montserrat font-semibold">
                            Observaciones
                            <textarea
                                name="observations"
                                value={formData.observations}
                                onChange={handleChange}
                                placeholder="Ingrese observaciones sobre el reactivo"
                                className="w-full h-24 rounded-md border border-gray-500 p-3 mt-1 placeholder:text-xs placeholder:font-montserrat font-normal focus:outline-none focus:ring-1 focus:ring-primary-blue focus:border-transparent focus:bg-input-background"
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
                            onClick={() => setShowConfirmation(true)}
                            aria-label="Eliminar producto"
                        >
                            <Icon
                                icon="ix:trashcan-filled"
                                className="mr-2 text-xl"
                            />
                            Eliminar reactivo
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
                        aria-label="Agregar reactivo"
                    >
                        Agregar
                    </Button>
                </div>
            )}
        </>
    );
}
