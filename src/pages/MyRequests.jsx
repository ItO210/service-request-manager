import { apiFetch } from "@/utils/apiFetch";
import { useState, useMemo, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { showToast } from "@/utils/toastUtils";
import Header from "@/components/requestsComponents/Header";
import MyRequestsTable from "@/features/user/my-requests/MyRequestsTable";
import PaginationControls from "@/components/PaginationControls";
import { MyRequestsColumns } from "@/features/user/my-requests/MyRequestsColumns";
import ModalCancelReqConfirmation from "@/components/ModalCancelReqConfirmation";

const MyRequests = () => {
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [requestToCancel, setRequestToCancel] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalItems, setTotalItems] = useState(0);
    const [type, setType] = useState("");
    const [reload, setReload] = useState(false);
    const [requests, setRequests] = useState([]);
    const registrationNumber = jwtDecode(
        localStorage.getItem("token")
    ).registrationNumber;

    const mapApiResponseToRequiredFormat = (apiResponse) => {
        return apiResponse.map((item) => {
            return {
                id: item.requestId,
                requestStatus: item.requestStatus,
                typeOfRequest: item.typeOfRequest,
                requestSubtype: item.requestSubtype,
                workArea: item.workArea,
                requestDate: {
                    startingDate: item.startingDate,
                    finishingDate: item.finishingDate,
                    startingTime: item.startingTime,
                    finishingTime: item.finishingTime,
                },
                requestedBy: {
                    name: item.bookerName,
                    email: item.bookerEmail,
                    registrationNumber: item.bookerRegistrationNumber,
                },
                occupiedMaterial: item.occupiedMaterial,
                assignedTechnician: {
                    name: item.assignedTechnicianName,
                },
                observations: item.observations,
                logCode: item.logCode,
            };
        });
    };

    // Example usage with the fetch call:
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await apiFetch(`/request/user/${registrationNumber}?page=${page}&limit=${pageSize}`);

                const transformedData = mapApiResponseToRequiredFormat(
                    data.requests
                );

                setRequests(transformedData);
                setTotalItems(data.total);
            } catch (err) {
                setError(err);
            }
        };
        if (!selectedRequest) {
            fetchData();
        }
    }, [page, pageSize, reload, selectedRequest]);

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
        () => MyRequestsColumns(handleToggleDetails, selectedRequest),
        [selectedRequest]
    );

    return (
        <main className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-1 flex flex-col overflow-hidden">
                <section className="grow overflow-y-auto min-h-0 px-6 py-8 md:px-10">
                    <h2 className="font-poppins text-2xl font-semibold mb-2">
                        Solicitudes de servicio
                    </h2>
                    <h3 className="font-montserrat text-base font-normal mb-4">
                        Puede cancelar su solicitud de servicio si ya no la
                        requiere.
                    </h3>

                    {Array.isArray(requests) && requests.length === 0 ? (
                        <div className="flex items-center justify-center h-[60vh] text-gray-500 font-montserrat text-4xl font-semibold text-center">
                            No ha enviado ninguna solicitud
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            <MyRequestsTable
                                data={requests}
                                columns={columns}
                                selectedRequest={selectedRequest}
                                onCloseDetails={() => setSelectedRequest(null)}
                                onCancelRequest={handleCancelRequest}
                            />
                            <PaginationControls
                                page={page}
                                setPage={setPage}
                                pageSize={pageSize}
                                setPageSize={setPageSize}
                                totalItems={totalItems}
                                type="solicitud"
                                isAbsolute={false}
                            />
                        </div>
                    )}
                </section>
            </div>

            {showCancelModal && (
                <ModalCancelReqConfirmation
                    onClose={handleCloseCancelModal}
                    onConfirmCancel={handleConfirmCancel}
                />
            )}
        </main>
    );
};

export default MyRequests;
