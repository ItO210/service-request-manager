import { apiFetch } from "@/utils/apiFetch";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Icon } from "@iconify/react";
import { showToast } from "@/utils/toastUtils";
import { ROLES } from "@/constants/roles";
import ModalUserConfirmation from "@/components/ModalUserConfirmation";
import SelectInput from "@/components/ui/SelectInput";

export default function AddUserPanel({
    onClose,
    initialData = {},
    isEditing = false,
    setReload,
}) {
    const [modalConfirming, setModalConfirming] = useState(true);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [dynamicAreas, setDynamicAreas] = useState([]);
    const handleCreateArea = (inputValue) => {
        const newOption = {
            label: inputValue,
            value: inputValue.toUpperCase(),
        };
        setDynamicAreas((prev) => [...prev, newOption]);
    };
    const allWorkAreaOptions = [
        {
            label: 'Laboratorio de Biología Molecular',
            value: 'LABORATORIO DE BIOLOGIA MOLECULAR',
        },
        {
            label: 'Laboratorio de Cultivo Celular y Microscopía',
            value: 'LABORATORIO DE CULTIVO CELULAR Y MICROSCOPIA',
        },
        {
            label: 'Anexo de Cultivo Celular',
            value: 'ANEXO DE CULTIVO CELULAR',
        },
        {
            label: 'Laboratorio de Microbiología',
            value: 'LABORATORIO DE MICROBIOLOGIA',
        },
        {
            label: 'Laboratorio de Cromatografía y Espectrofotometría',
            value: 'LABORATORIO DE CROMATOGRAFIA Y ESPECTROFOTOMETRIA',
        },
        {
            label: 'Laboratorio de Bioprocesos',
            value: 'LABORATORIO DE BIOPROCESOS',
        },
        {
            label: 'Laboratorio de Acondicionamiento',
            value: 'LABORATORIO DE ACONDICIONAMIENTO',
        },
        {
            label: 'Cámara Fría',
            value: 'CAMARA FRIA',
        },
        {
            label: 'Bioterio',
            value: 'BIOTERIO',
        },
        ...dynamicAreas,
    ];

    const normalizedWorkAreaOptions = allWorkAreaOptions.map((opt) => ({
        label: opt.label || opt.value,
        value: opt.value,
    }));

    const requiredFields = [
        "name",
        "registrationNumber",
        "email",
        "password",
        "role",
    ];

    const blockEnie = (e) => {
        if (e.key.toLowerCase() === "ñ") {
            e.preventDefault();
        }
    };
    const blockNum = (e) => {
        if (/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    };

    const [formData, setFormData] = useState({
        name: "",
        registrationNumber: "",
        email: "",
        password: "",
        role: "",
        workArea: [],
        ...initialData,
    });

    const selectedWorkAreas = formData.workArea.map((val) => {
        const match = normalizedWorkAreaOptions.find((opt) => opt.value === val);
        if (match) return match;
        return {
            label: val
                .toLowerCase()
                .replace(/\b\w/g, (l) => l.toUpperCase())
                .replace(/ De /g, " de ")
                .replace(/ Y /g, " y "),
            value: val,
        };
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prevErrors) => ({
            // Delete the error for the field being changed
            ...prevErrors,
            [name]: false,
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        requiredFields.forEach((field) => {
            if (field === "password" && isEditing) return;

            if (!formData[field]) {
                newErrors[field] = "Este campo es obligatorio";
            }
        });

        if (
            formData.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            newErrors.email = "Correo electrónico no válido";
        }

        if (formData.password && formData.password.length < 6) {
            newErrors.password =
                "La contraseña debe tener al menos 6 caracteres";
        }

        if (
            formData.role === ROLES.TECH &&
            (!formData.workArea || formData.workArea.length === 0)
        ) {
            newErrors.workArea =
                "Este campo es obligatorio";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // True if no errors
    };

    const isFormUnchanged = () => {
        const fieldsToCompare = ["name", "email", "role", "workArea"];

        for (const field of fieldsToCompare) {
            const currentValue = formData[field] ?? "";
            const initialValue = initialData[field] ?? "";

            if (Array.isArray(currentValue) && Array.isArray(initialValue)) {
                if (
                    currentValue.sort().join(",") !==
                    initialValue.sort().join(",")
                ) {
                    return false;
                }
            } else if (currentValue !== initialValue) {
                return false;
            }
        }

        if (formData.password && formData.password.length > 0) {
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        const cleanedRegistrationNumber = formData.registrationNumber.replace(
            /\s+/g,
            ""
        );

        const payload = {
            name: String(formData.name),
            registrationNumber: String(cleanedRegistrationNumber),
            email: String(formData.email),
            password: String(formData.password),
            role: String(formData.role),
        };

        if (formData.role === ROLES.TECH) {
            payload.workArea = formData.workArea;
        }
        try {
            const data = await apiFetch("/auth/register",
                {
                    method: "POST",
                    body: JSON.stringify(payload),
                }
            );
            setReload((prev) => !prev);
            setModalConfirming(false);
            setShowConfirmation(true);
        } catch (error) {
            if (error.message === "Failed to create user: registrationNumber already exists") {
                showToast("La clave de usuario ya existe", "error");
            } else if (error.message ==="Failed to create user: Email already in use") {
                showToast("El correo electrónico ya existe", "error");
            } else {
                showToast("Error al agregar usuario", "error");
            }
        }
    };

    const handleEdit = async () => {
        if (!validateForm()) {
            return;
        }

        const cleanedRegistrationNumber = formData.registrationNumber.replace(
            /\s+/g,
            ""
        );

        const payload = {
            name: String(formData.name),
            registrationNumber: String(cleanedRegistrationNumber),
            email: String(formData.email),
            ...(formData.password
                ? { password: String(formData.password) }
                : {}),
            role: String(formData.role),
        };

        if (formData.role === ROLES.TECH) {
            payload.workArea = formData.workArea;
        }

        try {
            const data = await apiFetch(`/user/${cleanedRegistrationNumber}`,
                {
                    method: "PUT",
                    body: JSON.stringify(payload),
                }
            );

            showToast("Usuario editado correctamente", "success");
            onClose();
            setTimeout(() => {
                setReload((prev) => !prev);
            }, 0);
            setReload((prev) => !prev);
            onClose();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleDelete = async () => {
        try {
            const data = await apiFetch(`/user/${formData.registrationNumber}`,
                {
                    method: "DELETE",
                }
            );

            showToast("Usuario eliminado exitosamente", "success");
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
                <ModalUserConfirmation
                    onClose={() => setShowConfirmation(false)}
                    onDelete={handleDelete}
                    isConfirming={modalConfirming}
                />
            )}

            <div className="flex flex-col gap-4 text-sm text-black font-montserrat bg-white rounded-xl">
                {/* Columns Grid */}
                <div className=" divide-x divide-primary-blue">
                    {/* Column 1 - Información general */}
                    <fieldset className="space-y-2 p-4">
                        <h2 className="font-poppins font-bold text-base text-center mt-2 mb-2">
                            Datos del usuario
                        </h2>
                        <div className="grid grid-cols-3 gap-2">
                            <label
                                key={"name"}
                                className="flex flex-col font-montserrat font-semibold"
                            >
                                <span>
                                    Nombre completo{" "}
                                    <span className="text-red-500">*</span>
                                </span>
                                <Input
                                    name={"name"}
                                    value={formData["name"]}
                                    onChange={handleChange}
                                    placeholder={"Ingrese el nombre"}
                                    required
                                    showError={errors.name}
                                    errorMessage={"Este campo es obligatorio"}
                                    className="mt-1 placeholder:text-xs placeholder:font-montserrat placeholder:font-normal font-normal h-8"
                                    onKeyDown={blockNum}
                                />
                            </label>
                            <label className="font-montserrat font-semibold">
                                <span>
                                    Rol <span className="text-red-500">*</span>
                                </span>
                                <SelectInput
                                    name="role"
                                    onChange={handleChange}
                                    value={formData.role}
                                    placeholder="Seleccione el tipo de rol"
                                    required
                                    showError={errors.role}
                                    errorMessage={"Este campo es obligatorio"}
                                    className="mt-1 placeholder:text-xs placeholder:font-montserrat placeholder:font-normal font-normal font-montserrat min-h-8 focus:text-sm"
                                    options={[
                                        { value: ROLES.USER, label: "Usuario" },
                                        { value: ROLES.TECH, label: "Técnico" },
                                        {
                                            value: ROLES.ADMIN,
                                            label: "Administrador",
                                        },
                                    ]}
                                />
                            </label>
                            <label
                                key={"password"}
                                className="flex flex-col font-montserrat font-semibold"
                            >
                                <span>
                                    Contraseña{" "}
                                    <span className="text-red-500">*</span>
                                </span>
                                <div className="relative mt-1">
                                    <Input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name={"password"}
                                        onChange={handleChange}
                                        placeholder={"Ingrese la contraseña"}
                                        required
                                        className={`w-full placeholder:text-xs placeholder:font-montserrat placeholder:font-normal font-normal h-8 ${
                                            errors.password
                                                ? "border-red-500"
                                                : "border-gray-500"
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                                        aria-label="Mostrar u ocultar contraseña"
                                    >
                                        <Icon
                                            icon={
                                                showPassword
                                                    ? "mdi:eye-off-outline"
                                                    : "mdi:eye-outline"
                                            }
                                            className="text-lg"
                                        />
                                        <span className="sr-only">
                                            Mostrar u ocultar contraseña
                                        </span>
                                    </button>
                                </div>
                                {errors.password && (
                                    <span className="text-red-500 text-xs mt-0.5">
                                        {errors.password}
                                    </span>
                                )}
                            </label>

                            <label
                                key={"registrationNumber"}
                                className="flex flex-col font-montserrat font-semibold"
                            >
                                {isEditing ? (
                                    <>
                                        <span>Clave de usuario</span>
                                        <p className="font-montserrat font-normal">
                                            {formData.registrationNumber}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <span>
                                            Clave de usuario{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </span>
                                        <Input
                                            name={"registrationNumber"}
                                            value={
                                                formData["registrationNumber"]
                                            }
                                            onChange={handleChange}
                                            placeholder={
                                                "Ingrese la clave de usuario"
                                            }
                                            required
                                            showError={
                                                errors.registrationNumber
                                            }
                                            errorMessage={
                                                "Este campo es obligatorio"
                                            }
                                            className="mt-1 placeholder:text-xs placeholder:font-montserrat placeholder:font-normal font-normal h-8"
                                        />
                                    </>
                                )}
                            </label>
                            <label
                                key={"email"}
                                className="flex flex-col font-montserrat font-semibold"
                            >
                                <span>
                                    Correo electrónico{" "}
                                    <span className="text-red-500">*</span>
                                </span>
                                <Input
                                    type="email"
                                    name={"email"}
                                    value={formData["email"]}
                                    onChange={handleChange}
                                    placeholder={
                                        "Ingrese el correo electrónico"
                                    }
                                    required
                                    showError={errors.email}
                                    errorMessage={errors.email}
                                    className="mt-1 placeholder:text-xs placeholder:font-montserrat placeholder:font-normal font-normal h-8"
                                    onKeyDown={blockEnie}
                                />
                            </label>
                            {formData.role === ROLES.TECH && (
                                <label
                                    key="workArea"
                                    className="flex flex-col font-montserrat font-semibold"
                                >
                                    <span>
                                        Área(s) de trabajo{" "}
                                        <span className="text-red-500">*</span>
                                    </span>
                                    <SelectInput
                                        name="workArea"
                                        value={selectedWorkAreas}
                                        onChange={handleChange}
                                        isMulti={true}
                                        placeholder="Seleccione una o varias áreas de trabajo"
                                        isCreatable={true}
                                        onCreateOption={handleCreateArea}
                                        options={normalizedWorkAreaOptions}
                                        required
                                        showError={errors.workArea}
                                        errorMessage={errors.workArea}
                                        className="placeholder:text-xs placeholder:font-montserrat placeholder:font-normal font-normal min-h-8"
                                    />
                                </label>
                            )}
                        </div>
                    </fieldset>
                </div>
            </div>

            {/* Buttons */}
            {isEditing ? (
                <div className="flex justify-between pt-4 mb-4">
                    <div className="flex ml-4">
                        <Button
                            className="bg-delete-btn hover:bg-delete-btn-hover text-white text-base font-poppins font-semibold py-2 px-4 transition inline-flex items-center cursor-pointer"
                            onClick={() => {
                                setModalConfirming(true);
                                setShowConfirmation(true);
                            }}
                            aria-label="Eliminar usuario"
                        >
                            <Icon
                                icon="ix:trashcan-filled"
                                className="mr-2 text-xl"
                            />
                            Eliminar usuario
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
                        aria-label="Agregar usuario"
                    >
                        Agregar
                    </Button>
                </div>
            )}
        </>
    );
}
