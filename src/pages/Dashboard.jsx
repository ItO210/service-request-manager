import { apiFetch } from "@/utils/apiFetch";
import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { showToast } from "@/utils/toastUtils";
import ModalSelectGraphDownload from "@/components/ui/ModalSelectGraphDownload";
import TotalRequests from "@/features/admin/dashboard/components/cards/TotalRequests";
import RequestsStatus from "@/features/admin/dashboard/components/charts/RequestsStatus";
import RequestsByTech from "@/features/admin/dashboard/components/charts/RequestsByTech";
import ReagentsState from "@/features/admin/dashboard/components/cards/ReagentsState";
import TopEquipments from "@/features/admin/dashboard/components/charts/TopEquipments";
import TopReagents from "@/features/admin/dashboard/components/charts/TopReagents";
import TopMaterials from "@/features/admin/dashboard/components/charts/TopMaterials";
import TopAreas from "@/features/admin/dashboard/components/charts/TopAreas";
import TopActiveUsers from "@/features/admin/dashboard/components/charts/TopActiveUsers";
import FrequentHours from "@/features/admin/dashboard/components/charts/FrequentHours";

function Dashboard() {
    const [showModal, setShowModal] = useState(false);
    const handleDownload = async (month, year) => {
        try {
            const data = await apiFetch("/export/graph", {
                method: "POST",
                responseType: "blob",
                body: JSON.stringify({ period: 1, month, year }),
            });

            const url = window.URL.createObjectURL(data);
            const link = document.createElement("a");
            link.href = url;
            link.download = "Graficas_Cicata.xlsx";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            showToast("Error al exportar gráficas", "error");
        }
    };

    return (
        <>
            {showModal && (
                <ModalSelectGraphDownload
                    onClose={() => setShowModal(false)}
                    onDownload={(month, year) => {
                        handleDownload(month, year);
                        setShowModal(false);
                    }}
                />
            )}
            <section className="p-2 -mt-1 w-full max-w-full overflow-x-hidden overflow-y-hidden pb-15">
                <div className="flex justify-between mb-2">
                    <h2 className="font-poppins text-2xl font-bold">
                        Estado general
                    </h2>
                    <Button
                        onClick={() => setShowModal(true)}
                        className="bg-deep-blue hover:bg-dark-blue text-white text-sm font-poppins font-semibold py-2 px-4 rounded-md transition inline-flex items-center"
                        aria-label="Descargar inventario"
                    >
                        <Icon
                            icon="material-symbols:download"
                            className="mr-2 text-xl"
                        />
                        Descargar gráficas
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                    <TotalRequests />
                    <RequestsStatus />
                    <RequestsByTech />
                    <ReagentsState />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Columna izquierda */}
                    <div className="space-y-2 h-auto">
                        <h2 className="text-2xl font-bold font-poppins">
                            Uso de recursos
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-4 h-full">
                            <TopEquipments />
                            <TopReagents />
                            <TopMaterials />
                            <TopAreas />
                        </div>
                    </div>

                    {/* Columna derecha */}
                    <div className="space-y-2 h-auto">
                        <h2 className="text-2xl font-bold font-poppins">
                            Patrones de uso
                        </h2>
                        <div className="grid grid-rows-2 gap-4 h-full">
                            <FrequentHours />
                            <TopActiveUsers />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Dashboard;
