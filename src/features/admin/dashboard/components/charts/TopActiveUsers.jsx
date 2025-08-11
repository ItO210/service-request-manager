"use client";
import { apiFetch } from "@/utils/apiFetch";
import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    XAxis,
    YAxis,
    Cell,
} from "recharts";

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
import { useState, useEffect, useMemo } from "react";

export default function TopActiveUsers() {
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
    
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const period = viewMode;
            const year = currentYear;
            const month = period === 0 ? currentMonth : undefined;

            let url = `/analytics/most-active-users?period=${period}&year=${year}`;
            if (month) {
                url += `&month=${month}`;
            }

            try {
                const data = await apiFetch(url);

                const sorted = data
                    .sort((a, b) => b.count - a.count)
                    .map((item, index) => ({
                        name: item.user,
                        value: item.count,
                        fill: index === 0
                            ? "var(--color-primary-blue)"
                            : "var(--color-chart-light-blue)",
                        key: item.user.toLowerCase(),
                    }));
                setData(sorted);
            } catch (error) {
                console.error("Error al obtener solicitudes por usuario:", error);
            }
        };

        fetchData();
    }, [viewMode, currentMonth, currentYear]);

    const { label: currentLabel } = getPeriodLabel(viewMode, currentMonth, currentYear);

    const chartConfig = useMemo(() => {
        return data.reduce((config, item) => {
            config[item.key] = {
                label: "Solicitudes",
                color: item.fill,
            };
            return config;
        }, {});
    }, [data]);

    return (
        <Card>
            <CardHeader className="flex justify-between items-start">
                <CardTitle className="text-base font-semibold font-poppins leading-none">
                    Usuarios más activos
                </CardTitle>
                <ViewModeSwitch viewMode={viewMode} setViewMode={setViewMode} />
            </CardHeader>
            {data.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                    <div className="text-gray-500 font-montserrat text-xl font-semibold text-center">
                        No hay solicitudes registradas
                    </div>
                </div>
            ) : (
                <CardContent className="flex justify-center items-center h-[110px]">
                    <ChartContainer
                        config={chartConfig}
                        className="h-[130px] w-full"
                    >
                        <BarChart
                            data={data}
                            layout="vertical"
                            margin={{ right: 16 }}
                        >
                            <CartesianGrid horizontal={false} stroke="#d1d1d1" />
                            <YAxis
                                dataKey="name"
                                type="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                hide
                            />
                            <XAxis type="number" domain={[0, 'auto']} hide />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        indicator="line"
                                        nameKey="key"
                                        labelKey="name"
                                    />
                                }
                            />
                            <Bar dataKey="value" layout="vertical" radius={4}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                                <LabelList
                                    dataKey="name"
                                    position="insideLeft"
                                    offset={8}
                                    className="fill-white font-semibold font-montserrat"
                                    fontSize={13}
                                />
                                <LabelList
                                    dataKey="value"
                                    position="right"
                                    offset={8}
                                    className="fill-gray-600 font-medium font-montserrat tabular-nums"
                                    fontSize={13}
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            )}
            <CardFooter className="flex-col items-center text-sm">
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
            </CardFooter>
        </Card>
    );
}
