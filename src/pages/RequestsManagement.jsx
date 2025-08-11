import { apiFetch } from "@/utils/apiFetch";
import { useState, useEffect, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { ROLES } from "@/constants/roles";
import TableToolbar from "../components/ui/TableToolbar";
import RequestsTable from "@/features/admin/requests-mgmt/RequestsTable";
import PaginationControls from "@/components/PaginationControls";
import { RequestsColumns } from "@/features/admin/requests-mgmt/RequestsColumns";
import ModalCancelReqConfirmation from "@/components/ModalCancelReqConfirmation";
import { showToast } from "@/utils/toastUtils";

const Requests = () => {
    const [reload, setReload] = useState(false);
    const [search, setSearch] = useState("");
    const [activeFilters, setActiveFilters] = useState({});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalItems, setTotalItems] = useState(0);
    const [type, setType] = useState("");
    const [requestsData, setRequestsData] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [requestToCancel, setRequestToCancel] = useState(null);

    const hasSearchOrFilters = !!search.trim() || Object.values(activeFilters).some(arr => Array.isArray(arr) && arr.length > 0);

    useEffect(() => {
        if (hasSearchOrFilters) {
            setPage(1);
        }
    }, [search, activeFilters]);

    useEffect(() => {
        const effectivePage = hasSearchOrFilters ? 1 : page;
        const effectiveLimit = hasSearchOrFilters ? 9999999999 : pageSize;

        const fetchRequests = async () => {
            try {
                const { role, registrationNumber } = jwtDecode(localStorage.getItem("token"));
                const endpoint = role === ROLES.TECH
                    ? `/request/technician/${registrationNumber}?page=${effectivePage}&limit=${effectiveLimit}`
                    : `/request/paginated?page=${effectivePage}&limit=${effectiveLimit}`;
                const data = await apiFetch(endpoint);

                const requestsArray = data.requests || data;
                const mapped = requestsArray.map((req) => {
                    const startDate = new Date(req.requestDate?.startingDate);
                    const endDate = req.requestDate?.finishingDate ? new Date(req.requestDate.finishingDate) : null;
                    const reservedDays = endDate
                        ? Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24))
                        : null;

                    let reservedHours = null;
                    let reservedMinutes = null;

                    if (req.requestDate?.startingTime && req.requestDate?.finishingTime) {
                        const [startHour, startMin] = req.requestDate.startingTime.split(":").map(Number);
                        const [endHour, endMin] = req.requestDate.finishingTime.split(":").map(Number);
                        const totalMinutes =
                            endHour * 60 + endMin - (startHour * 60 + startMin);
                        reservedHours = Math.floor(totalMinutes / 60);
                        reservedMinutes = totalMinutes % 60;
                    }

                    return {
                        id: req.requestId,
                        typeOfRequest: req.typeOfRequest,
                        requestSubtype: req.requestSubtype,
                        requestStatus: req.requestStatus,
                        workArea: req.workArea,
                        requestDate: {
                            startingDate: req.startingDate,
                            finishingDate: req.finishingDate,
                            startingTime: req.startingTime,
                            finishingTime: req.finishingTime,
                            reservedDays,
                            reservedHours,
                            reservedMinutes,
                        },
                        requestedBy: {
                            name: req.bookerName,
                            email: req.bookerEmail,
                            registrationNumber: req.bookerRegistrationNumber,
                        },
                        assignedTechnicianName: req.assignedTechnicianName,
                        occupiedMaterial: req.occupiedMaterial,
                        observations: req.observations,
                        observatorTechnician: req.observatorTechnician,
                        logCode: req.logCode,
                    };
                });

                setRequestsData(mapped);
                setTotalItems(data.total || mapped.length);

                if (selectedRequest) {
                    const updated = mapped.find((r) => r.id === selectedRequest.id);
                    if (updated) {
                        setSelectedRequest(updated);
                    } else {
                        setSelectedRequest(null);
                    }
                }
            } catch (err) {
                console.error("Error al obtener las solicitudes:", err);
            }
        };

        fetchRequests();
    }, [reload, page, pageSize, hasSearchOrFilters]);

    const normalizeText = (text) =>
        text
            ?.normalize("NFD")
            .replace(/[\u0301\u0300\u0302\u0308\u0304\u0307]/g, "")
            .toLowerCase();

    const searchedItem = normalizeText(search);

    const filteredData = requestsData.filter((request) => {
        const matchesSearch = (() => {
            if (!searchedItem) return true;
        
            const logCode = request.logCode ?? ""
            const name = request.requestedBy?.name ?? "";
            const regNumber = request.requestedBy?.registrationNumber ?? "";
        
            return (
                normalizeText(logCode).includes(searchedItem) ||
                normalizeText(name).includes(searchedItem) ||
                normalizeText(regNumber).includes(searchedItem)
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
    

    const handleToggleDetails = (request) => {
        if (selectedRequest?.id === request.id) {
            setSelectedRequest(null);
        } else {
            setSelectedRequest(request);
        }
    };

    const handleCancelRequest = (request) => {
        setRequestToCancel(request);
        setShowCancelModal(true);
    };

    const handleConfirmCancel = async (comment) => {
        const { registrationNumber } = jwtDecode(localStorage.getItem("token"));

        try {
            const data = await apiFetch(`/request/cancel/${requestToCancel.id}`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        registrationNumber,
                        requestData: {
                            observations: comment.trim(),
                        },
                    }),
                }
            );

            showToast("Solicitud cancelada con éxito", "success");
            setShowCancelModal(false);
            setRequestToCancel(null);
            setSelectedRequest(null);
            setReload((prev) => !prev);
        } catch (error) {
            console.error("Error al cancelar solicitud:", error);
        }
    };

    const handleCloseCancelModal = () => {
        setShowCancelModal(false);
        setRequestToCancel(null);
    };

    const columns = useMemo(
        () => RequestsColumns(handleToggleDetails, selectedRequest),
        [selectedRequest]
    );

    const paginatedFilteredData = hasSearchOrFilters
        ? filteredData.slice((page - 1) * pageSize, page * pageSize)
        : filteredData;

    return (
        <>
            <section className="p-4 -mt-1 w-full max-w-full overflow-x-hidden">
                <h2 className="font-poppins text-2xl font-semibold mb-2">
                    Solicitudes de servicio
                </h2>
                <h3 className="font-montserrat text-base font-normal mb-4">
                    Gestione las solicitudes: apruebe, rechace o agregue
                    observaciones según corresponda.
                </h3>
                <TableToolbar
                    type="requests"
                    searchTerm={search}
                    onSearchChange={setSearch}
                    onAddClick={() => {
                        setSelectedRequest(null);
                    }}
                    data={requestsData}
                    onFiltersChange={setActiveFilters}
                />
                {Array.isArray(requestsData) && requestsData.length === 0 ? (
                    <div className="flex items-center justify-center h-[60vh] text-gray-500 font-montserrat text-4xl font-semibold text-center">
                        No hay solicitudes registradas
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
                            <RequestsTable
                                data={paginatedFilteredData}
                                columns={columns}
                                selectedRequest={selectedRequest}
                                onCloseDetails={() => setSelectedRequest(null)}
                                onCancelRequest={handleCancelRequest}
                                setReload={setReload}
                            />
                        </div>
                        <div className="mt-15">
                            <PaginationControls
                                page={page}
                                setPage={setPage}
                                pageSize={pageSize}
                                setPageSize={setPageSize}
                                totalItems={hasSearchOrFilters ? filteredData.length : totalItems}
                                type="solicitud"
                            />
                        </div>
                    </>
                )}
            </section>
            {showCancelModal && (
                <ModalCancelReqConfirmation
                    onClose={handleCloseCancelModal}
                    onConfirmCancel={handleConfirmCancel}
                />
            )}
        </>
    );
};

export default Requests;
