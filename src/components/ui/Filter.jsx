import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@iconify/react';
import { ROLES } from "@/constants/roles";
import { useLocation } from "react-router-dom";

const filterOptions = {
    requests: [
        { label: 'Área(s) de trabajo', value: 'workArea' },
        { label: 'Estado de solicitud', value: 'requestStatus' },
        { label: 'Tipo de solicitud', value: 'typeOfRequest' },
    ],
    equipos: [
        { label: 'Duración de la reserva', value: 'reservationType' },
        { label: 'Estado del equipo', value: 'status' },
    ],
    reactivos: [
        { label: 'Sticker de disponibilidad', value: 'reagentSticker' },
        { label: 'Presentación de reactivo', value: 'reagentPresentation' },
    ],
    materiales: [
        { label: 'Categoría del material', value: 'materialCategory' },
    ],
    users: [
        { label: 'Rol de usuario', value: 'role' },
        {
            label: 'Área(s) de trabajo',
            value: 'workArea',
            dependsOn: { field: 'role', value: ROLES.TECH },
        },
    ],
    movements: [
        { label: 'Estado del equipo', value: 'status' },
        { label: 'Área(s) de trabajo', value: 'workArea' },
    ],
};

const filterValues = {
    // Request
    workArea: [
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
    ],
    requestStatus: [
        {
            label: 'Pendiente de aprobación (Jefe de departamento)',
            value: 'Pendiente de aprobación (Jefe de departamento)',
        },
        {
            label: 'Pendiente de aprobación (Técnico)',
            value: 'Pendiente de aprobación (Técnico)',
        },
        { label: 'Aprobada por técnico', value: 'Aprobada por técnico' },
        { label: 'Aprobada y notificada', value: 'Aprobada y notificada' },
        { label: 'Rechazada por Técnico', value: 'Rechazada por Técnico' },
        { label: 'Rechazada y notificada', value: 'Rechazada y notificada' },
        { label: 'Cancelada', value: 'Cancelada' },
    ],
    typeOfRequest: [
        { label: 'Equipos', value: 'EQ' },
        { label: 'Reactivos y Materiales', value: 'R&M' },
        { label: 'Apoyo técnico', value: 'TA' },
    ],

    // Equipment
    reservationType: [
        { label: 'Corta duración', value: 'N' },
        { label: 'Media duración', value: 'H' },
        { label: 'Larga duración', value: 'D' },
    ],
    status: [
        { label: 'Disponible', value: 'available' },
        { label: 'En uso', value: 'inUse' },
        { label: 'Deshabilitado', value: 'disabled' },
    ],

    // Reagent
    reagentSticker: [
        { label: 'Baja disponibilidad', value: 4 },
        { label: 'En reserva', value: 1 },
        { label: 'En uso', value: 3 },
        { label: 'Pronto a caducar', value: 2 },
    ],
    reagentPresentation: [
        { label: 'Polvo', value: 'Polvo' },
        { label: 'Líquido', value: 'Líquido' },
        { label: 'Kit', value: 'Kit' },
        { label: 'Tableta', value: 'Tableta' },
        { label: 'Unidades', value: 'Unidades' },
        { label: 'Lentejas', value: 'Lentejas' },
    ],

    // Material
    materialCategory: [
        { label: 'Material', value: 'Material' },
        { label: 'EPP', value: 'EPP' },
        { label: 'RPBIs', value: 'RPBIs' },
        { label: 'Cristaleria', value: 'Cristaleria' },
        { label: 'Herramienta', value: 'Herramienta' },
        { label: 'Limpieza', value: 'Limpieza' },
    ],

    // User
    role: [
        { label: "Usuario", value: ROLES.USER },
        { label: "Técnico", value: ROLES.TECH },
        { label: "Administrador", value: ROLES.ADMIN },
    ],
};

export default function Filter({ type, onClose, onChange, data = [] }) {
    const location = useLocation();
    const [isHovered, setIsHovered] = useState(false);
    const [open, setOpen] = useState(false);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({});
    const [tempFilters, setTempFilters] = useState({});
    const panelRef = useRef(null);

    const handleClose = () => {
        setIsAnimatingOut(true);
        setTimeout(() => {
            setOpen(false);
            setIsAnimatingOut(false);
        }, 300);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                handleClose();
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        filterOptions[type]?.forEach((option) => {
            if (option.dependsOn) {
                const { field, value } = option.dependsOn;
                const allowedValues = Array.isArray(value) ? value : [value];
                const isVisible = tempFilters[field]?.some((v) => allowedValues.includes(v));

                if (!isVisible) {
                    return null;
                }
            }
        });
    }, [tempFilters, type]);

    useEffect(() => {
        setSelectedFilters({});
        setTempFilters({});
        onChange?.({});
    }, [location.pathname]);

    const getFilteredData = () => {
        return data.filter((item) => {
            return Object.entries(tempFilters).every(([key, values]) => {
                if (!values?.length) return true;
                const field = item[key];
                if (Array.isArray(field)) {
                    return values.some((v) => field.includes(v));
                }
                return values.includes(field);
            });
        });
    };

    const getFilteredDataExceptGroup = (groupKey) => {
        return data.filter((item) => {
            return Object.entries(tempFilters).every(([key, values]) => {
            if (!values?.length || key === groupKey) return true;
            const field = item[key];
            if (Array.isArray(field)) {
                return values.some((v) => field.includes(v));
            }
            return values.includes(field);
            });
        });
    };


    return (
        <div className = 'relative'>
            <button
                onClick={() => {
                    setTempFilters(selectedFilters);
                    setOpen(true);
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className = 'p-2 cursor-pointer'
                aria-label="Ver filtros"
            >
                <Icon
                    icon={
                        isHovered
                            ? 'flowbite:filter-solid'
                            : 'flowbite:filter-outline'
                    }
                    className = 'text-2xl transition-all duration-200'
                />
            </button>

            {open && (
                <div
                    ref={panelRef}
                    className={`fixed top-0 right-0 h-full w-100 bg-white border-l border-gray-300 shadow-lg z-50 flex flex-col 
                    ${
                        isAnimatingOut
                            ? 'animate-slide-out-right'
                            : 'animate-slide-in-right'
                    }`}
                >
                    <>
                        <button
                            onClick={() => handleClose()}
                            className = 'absolute top-4 right-4 text-gray-600 hover:text-black cursor-pointer'
                            aria-label="Cerrar filtros"
                        >
                            <Icon
                                icon = 'mingcute:close-fill'
                                className = 'text-xl'
                            />
                        </button>
                        <span className = 'flex gap-5 items-center p-7'>
                            <Icon
                                icon = 'flowbite:filter-solid'
                                className = 'text-3xl'
                            />
                            <h2 className = 'font-montserrat font-bold text-lg'>
                                Filtros
                            </h2>
                        </span>
                        <div className = 'flex-1 overflow-y-auto'>
                            {filterOptions[type]?.map((option) => {
                                if (option.dependsOn) {
                                    const { field, value } = option.dependsOn;
                                    const allowedValues = Array.isArray(value) ? value : [value];
                                    const isVisible = tempFilters[field]?.some((v) => allowedValues.includes(v));

                                    if (!isVisible) {
                                        if (tempFilters[option.value]?.length) {
                                            setTempFilters((prev) => {
                                                const updated = { ...prev };
                                                delete updated[option.value];
                                                return updated;
                                            });
                                        }
                                        return null;
                                    }
                                }

                                return (
                                    <>
                                        <hr className = 'relative left-0 w-full border-t border-input-focus' />
                                        <div key={option.value} className = 'p-7'>
                                            <label className = 'block font-poppins font-bold mb-2'>
                                                {option.label}
                                            </label>
                                            <div className = 'grid grid-cols-2 gap-x-3 gap-y-1'>
                                                {filterValues[
                                                    option.value
                                                ]?.map((val) => {
                                                    const count = getFilteredDataExceptGroup(option.value).filter((item) => {
                                                        const field = item[option.value];
                                                        if (Array.isArray(field)) {
                                                            return field.includes(val.value);
                                                        }
                                                        return field === val.value;
                                                    }).length;

                                                    return (
                                                        <label
                                                            key={val.value}
                                                            className = 'flex items-center gap-2 text-sm'
                                                        >
                                                            <div className = 'relative'>
                                                                <input
                                                                    type = 'checkbox'
                                                                    className = 'sr-only peer'
                                                                    checked={
                                                                        tempFilters[
                                                                            option
                                                                                .value
                                                                        ]?.includes(
                                                                            val.value
                                                                        ) ||
                                                                        false
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        setTempFilters((prev) => {
                                                                            const current = prev[option.value] || [];
                                                                            const updated = e.target.checked
                                                                                ? [...current, val.value]
                                                                                : current.filter((v) => v !== val.value);

                                                                            return {
                                                                                ...prev,
                                                                                [option.value]: updated,
                                                                            };
                                                                        });
                                                                    }}
                                                                />
                                                                <div className = 'w-4 h-4 border-2 border-primary-blue rounded-xs peer-checked:bg-primary-blue' />
                                                                <svg
                                                                    className = 'absolute top-1/2 left-1/2 w-3.5 h-3.5 text-white transform -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden peer-checked:block'
                                                                    fill = 'none'
                                                                    stroke = 'currentColor'
                                                                    strokeWidth = '3'
                                                                    viewBox = '0 0 24 24'
                                                                >
                                                                    <path
                                                                        strokeLinecap = 'round'
                                                                        strokeLinejoin = 'round'
                                                                        d = 'M5 13l4 4L19 7'
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <span className = 'font-montserrat text-sm leading-tight'>
                                                                {val.label}{' '}
                                                                <span className = 'text-gray-500'>
                                                                    ({count})
                                                                </span>
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </>
                                );
                            })}
                        </div>
                    </>
                    <div className = 'flex flex-col p-7 gap-y-2 w-full'>
                        <Button
                            className = 'w-full bg-sidebar hover:bg-dim-blue-background text-white font-poppins font-semibold text-sm'
                            onClick={() => {
                                setSelectedFilters(tempFilters);
                                onChange?.(tempFilters);
                                handleClose();
                            }}
                            aria-label="Aplicar filtros"
                        >
                            Aplicar cambios
                        </Button>
                        <Button
                            className = 'w-full bg-gray-300 text-gray-600 hover:opacity-85 font-poppins font-semibold text-sm'
                            onClick={() => {
                                setSelectedFilters({});
                                onChange?.({});
                                handleClose();
                            }}
                            aria-label="Borrar filtros"
                        >
                            Borrar filtros
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
