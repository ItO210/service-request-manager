import { apiFetch } from "@/utils/apiFetch";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import ViewModeSwitch from "@/components/ViewModeSwitch";
import useDateNavigation, { getPeriodLabel } from "@/utils/dateNavigation";

export default function TotalRequests() {
    const {
        viewMode,
        setViewMode,
        currentMonth,
        currentYear,
        handleLeftClick,
        handleRightClick,
        isLeftDisabled,
        isRightDisabled,
    } = useDateNavigation();

    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchTotal = async () => {
            const period = viewMode;
            const year = currentYear;
            const month = period === 0 ? currentMonth : undefined;

            let url = `/analytics/total?period=${period}&year=${year}`;
            if (month) {
                url += `&month=${month}`;
            }

            try {
                const data = await apiFetch(url);
                setTotal(data.total ?? 0);
            } catch (error) {
                console.error("Error al obtener total de solicitudes:", error);
            }
        };

        fetchTotal();
    }, [viewMode, currentMonth, currentYear]);

    const { label: currentLabel } = getPeriodLabel(viewMode, currentMonth, currentYear);

    return (
        <div className="rounded-xl bg-white p-6 shadow flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4 gap-4">
                <h2 className="text-base font-semibold font-poppins leading-none">
                    Total de solicitudes
                </h2>
                <ViewModeSwitch viewMode={viewMode} setViewMode={setViewMode} />
            </div>

            <div className="flex justify-center items-center mt-2 gap-4 mb-4">
                <Icon
                    icon="fluent:form-28-regular"
                    className="h-14 w-14 text-blue-500"
                />
                <span className="text-6xl font-semibold font-montserrat">
                    {total}
                </span>
            </div>

            <div className="flex justify-center items-center gap-2 mt-2 text-sm font-semibold">
                <Icon
                    icon="iconamoon:arrow-left-2-light"
                    className={`h-4 w-4 ${isLeftDisabled 
                        ? "text-gray-400 cursor-not-allowed" 
                        : "text-blue-600 cursor-pointer"}`}
                    onClick={!isLeftDisabled 
                        ? handleLeftClick 
                        : undefined}
                />
                <span className="font-montserrat font-medium">
                    {currentLabel}
                </span>
                <Icon
                    icon="iconamoon:arrow-right-2-light"
                    className={`h-4 w-4 ${isRightDisabled 
                        ? "text-gray-400 cursor-not-allowed" 
                        : "text-blue-600 cursor-pointer"}`}
                    onClick={!isRightDisabled 
                        ? handleRightClick 
                        : undefined}
                />
            </div>
        </div>
    );
}
