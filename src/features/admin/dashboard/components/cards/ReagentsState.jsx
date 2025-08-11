import { apiFetch } from "@/utils/apiFetch";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "../cards/Card";

export default function ReagentsState() {
    const [lowAvailability, setLowAvailability] = useState([]);
    const [expiringSoon, setExpiringSoon] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await apiFetch("/analytics/reagent-status-summary");
                setLowAvailability(data.lowStock.map((r) => r.reagentName));
                setExpiringSoon(data.expiringSoon.map((r) => r.reagentName));
            } catch (err) {
                console.error("Error al obtener datos de reactivos:", err);
            }
        };

        fetchData();
    }, []);

    return (
        <Card className="p-6 shadow flex flex-col justify-between">
            <CardHeader className="items-start pb-0">
                <CardTitle className="text-base font-semibold font-poppins leading-tight">
                    Estado de los reactivos
                </CardTitle>
            </CardHeader>

            <CardContent className="flex gap-4 h-[175px] overflow-hidden">
                <div className="flex-1 overflow-y-auto pr-1 font-montserrat h-full">
                    <div className="text-xs font-semibold text-red-600 mb-2 flex items-center gap-0.5 leading-none">
                        Baja disponibilidad
                    </div>
                    {lowAvailability.length > 0 ? (
                        <ul className="space-y-1 text-xs font-medium mb-0">
                            {lowAvailability.map((item, idx) => (
                                <li
                                    key={idx}
                                    className="bg-red-50 px-2 py-0.5 rounded-md truncate"
                                    title={item}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex items-center justify-center text-gray-500 font-montserrat text-xs font-semibold text-center">
                            No hay reactivos con baja disponibilidad
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto pr-1 font-montserrat h-full">
                    <div className="text-xs font-semibold text-expiring-soon mb-2 flex items-center gap-0.5 leading-none">
                        Pronto a caducar
                    </div>
                    {expiringSoon.length > 0 ? (
                        <ul className="space-y-1 text-xs font-medium mb-0">
                        {expiringSoon.map((item, idx) => (
                            <li
                                key={idx}
                                className="bg-blue-50 px-2 py-0.5 rounded-md truncate"
                                title={item}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                    ) : (
                        <div className="flex items-center justify-center text-gray-500 font-montserrat text-xs font-semibold text-center">
                            No hay reactivos a punto de caducar
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
