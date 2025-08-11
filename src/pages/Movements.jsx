import { apiFetch } from "@/utils/apiFetch";
import { useState, useEffect, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import TableToolbar from "../components/ui/TableToolbar";
import MovementsTable from "@/features/technician/MovementsTable";
import PaginationControls from "@/components/PaginationControls";
import { MovementsColumns } from "@/features/technician/MovementsColumns";

const Movements = () => {
    const [reload, setReload] = useState(false);
    const [search, setSearch] = useState("");
    const [activeFilters, setActiveFilters] = useState({});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalItems, setTotalItems] = useState(0);
    const [movementsData, setMovementsData] = useState([]);
    const [selectedMovement, setSelectedMovement] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { registrationNumber } = jwtDecode(localStorage.getItem("token"));
                const requestData = await apiFetch(`/request/technician/${registrationNumber}`);
                const equipmentData = await apiFetch("/equipment/basic");

                const data = (requestData.requests || requestData)
                .filter((req) => req.typeOfRequest === "EQ")
                .flatMap((req) => {
                    return req.occupiedMaterial.map((mat) => {
                        const equipment = equipmentData.find(eq => eq.barcode === mat.barcode);

                        return {
                            bookerName: req.bookerName || "-",
                            bookerRegistrationNumber: req.bookerRegistrationNumber || "-",
                            startingDate: req.startingDate || "-",
                            startingTime: req.startingTime || "-",
                            workArea: req.workArea || "-",
                            equipment: {
                                name: equipment?.name || "-",
                                brand: equipment?.brand || "-",
                                model: equipment?.model || "-",
                                location: equipment?.location || "-",
                                barcode: equipment?.barcode || "-",
                                status: equipment?.status || "-",
                                photoID: equipment?.photoID || null,
                            },
                        };
                    });
                });

                setMovementsData(
                    data.map(m => ({
                        ...m,
                        status: m.equipment?.status ?? "-",
                        workArea: m.workArea ?? "-",
                    }))
                );
            } catch (err) {
                console.error("Error al obtener los movimientos:", err);
            }
        };

        fetchData();
    }, [reload]);

    const normalizeText = (text) =>
        text
            ?.normalize("NFD")
            .replace(/[\u0301\u0300\u0302\u0308\u0304\u0307]/g, "")
            .toLowerCase();

    const searchedItem = normalizeText(search);

    const filteredData = movementsData.filter((request) => {
        const matchesSearch = (() => {
            if (!searchedItem) return true;
            const bookerName = request.bookerName ?? "";
            const bookerRegistrationNumber = request.bookerRegistrationNumber ?? "";
            const equipmentName = request.equipment.name ?? "";
            const equipmentModel = request.equipment.model ?? "";
            const equipmentLocation = request.equipment.location ?? "";
            const equipmentBarcode = request.equipment.barcode ?? "";

            return (
                normalizeText(bookerName).includes(searchedItem) ||
                normalizeText(bookerRegistrationNumber).includes(searchedItem) ||
                normalizeText(equipmentName).includes(searchedItem) ||
                normalizeText(equipmentModel).includes(searchedItem) ||
                normalizeText(equipmentLocation).includes(searchedItem) ||
                equipmentBarcode === search
            );
        })();

        const matchesFilters = Object.entries(activeFilters).every(([key, values]) => {
            if (!values || values.length === 0) return true;
            const field = request[key];
            if (Array.isArray(field)) {
                return values.some((val) => field.includes(val));
            }
            return values.includes(field);
        });

        return matchesSearch && matchesFilters;
    });
    
    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

    const handleToggleDetails = (request) => {
        setSelectedMovement((prev) =>
            prev === request ? null : request
        );
    };

    const columns = useMemo(
        () => MovementsColumns(handleToggleDetails, selectedMovement),
        [selectedMovement]
    );

    return (
        <>
            <section className="p-4 -mt-1 w-full max-w-full overflow-x-hidden">
                <h2 className="font-poppins text-2xl font-semibold mb-2">
                    Registro de movimientos
                </h2>
                <h3 className="font-montserrat text-base font-normal mb-4">
                    Gestione el ingreso y la salida de equipos de manera eficiente.
                </h3>
                <TableToolbar
                    type="movements"
                    searchTerm={search}
                    onSearchChange={setSearch}
                    onAddClick={() => {
                        setSelectedMovement(null);
                    }}
                    data={movementsData}
                    onFiltersChange={setActiveFilters}
                />
                {Array.isArray(movementsData) && movementsData.length === 0 ? (
                    <div className="flex items-center justify-center h-[60vh] text-gray-500 font-montserrat text-4xl font-semibold text-center">
                        No hay movimientos pendientes
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="flex items-center justify-center h-[60vh] text-gray-500 font-montserrat text-4xl font-semibold text-center">
                        {search
                            ? `No se encontraron solicitudes para "${search}"`
                            : Object.values(activeFilters).some((arr) => Array.isArray(arr) && arr.length > 0)
                                ? "No se encontraron solicitudes con los filtros aplicados"
                                : "No hay resultados disponibles"
                        }
                    </div>
                ) : (
                    <>
                        <div className="min-h-[400px] flex flex-col justify-between">
                            <MovementsTable
                                data={paginatedData}
                                columns={columns}
                                selectedMovement={selectedMovement}
                                onCloseDetails={() => setSelectedMovement(null)}
                                setReload={setReload}
                            />
                        </div>
                        <div className="mt-15">
                            <PaginationControls
                                page={page}
                                setPage={setPage}
                                pageSize={pageSize}
                                setPageSize={setPageSize}
                                totalItems={filteredData.length}
                                type="movimientos"
                            />
                        </div>
                    </>
                )}
            </section>
        </>
    );
}

export default Movements;