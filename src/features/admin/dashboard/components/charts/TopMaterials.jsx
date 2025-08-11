"use client";
import { apiFetch } from "@/utils/apiFetch";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, Cell } from "recharts";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../cards/Card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./Chart";
import ViewModeSwitch from "@/components/ViewModeSwitch";
import useDateNavigation, { getPeriodLabel } from "@/utils/dateNavigation";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

export const description = "A bar chart with a label";

const chartConfig = {
    solicitudes: {
        label: "Solicitudes",
        color: "var(--color-chart-light-blue)",
    },
};

export default function TopMaterials() {
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

    const [chartData, setChartData] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const period = viewMode;
            const year = currentYear;
            const month = period === 0 ? currentMonth : undefined;

            let url = `/analytics/most-used-all?period=${period}&year=${year}`;
            if (month) {
                url += `&month=${month}`;
            }
            
            try {
                const data = await apiFetch(url);

                const formattedData = data.material.map((item) => ({
                    material: item.name,
                    solicitudes: item.count,
                })).slice(0, 5);;
                setChartData(formattedData);
            } catch (error) {
                console.error("Error al obtener datos de materiales más solicitados:", error);
            }
        };

        fetchData();
    }, [viewMode, currentMonth, currentYear]);

    const { label: currentLabel } = getPeriodLabel(viewMode, currentMonth, currentYear);

    return (
        <Card>
            <CardHeader className="flex justify-between items-start pb-3">
                <CardTitle className="text-base font-semibold font-poppins leading-none">
                    Materiales más solicitados
                </CardTitle>
                <ViewModeSwitch viewMode={viewMode} setViewMode={setViewMode} />
            </CardHeader>
            {chartData.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                    <div className="text-gray-500 font-montserrat text-xl font-semibold text-center">
                        No hay solicitudes registradas
                    </div>
                </div>
            ) : (
                <>
                    <CardContent className="flex justify-center items-center h-[110px]">
                        <ChartContainer
                            config={chartConfig}
                            className="h-[110px] w-full"
                        >
                            <BarChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    top: 20,
                                }}
                            >
                                <CartesianGrid vertical={false} stroke="#d1d1d1" />
                                <XAxis
                                    dataKey="material"
                                    interval={0}
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                    tick={({ x, y, payload }) => {
                                        const maxChars = 5;
                                        const label =
                                            payload.value.length > maxChars
                                                ? payload.value.slice(0, maxChars - 1) +
                                                "…"
                                                : payload.value;

                                        return (
                                            <text
                                                x={x}
                                                y={y + 10}
                                                textAnchor="middle"
                                                fontSize={12}
                                                fontWeight={600}
                                                fontFamily="var(--font-montserrat)"
                                                fill="#374151"
                                            >
                                                <title>{payload.value}</title>
                                                {label}
                                            </text>
                                        );
                                    }}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Bar
                                    dataKey="solicitudes"
                                    fill="var(--color-chart-light-blue)"
                                    radius={8}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={
                                                hoveredIndex === index
                                                    ? "var(--color-primary-blue)"
                                                    : "var(--color-chart-light-blue)"
                                            }
                                            onMouseEnter={() => setHoveredIndex(index)}
                                            style={{ transition: "fill 0.2s ease" }}
                                        />
                                    ))}
                                    <LabelList
                                        position="top"
                                        offset={12}
                                        className="fill-gray-600 font-montserrat font-medium tabular-nums truncate"
                                        fontSize={12}
                                    />
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </>
            )}
            <CardFooter className="flex-col items-center text-sm">
                <div className="flex justify-center items-center gap-2 mt-2 text-sm font-semibold">
                    <Icon
                        icon="iconamoon:arrow-left-2-light"
                        className={`h-4 w-4 ${isLeftDisabled
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-blue-600 cursor-pointer"}`}
                        onClick={!isLeftDisabled ? handleLeftClick : undefined}
                    />
                    <span className="font-montserrat font-medium">
                        {currentLabel}
                    </span>
                    <Icon
                        icon="iconamoon:arrow-right-2-light"
                        className={`h-4 w-4 ${isRightDisabled
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-blue-600 cursor-pointer"}`}
                        onClick={!isRightDisabled ? handleRightClick : undefined}
                    />
                </div>
            </CardFooter>
        </Card>
    );
}
