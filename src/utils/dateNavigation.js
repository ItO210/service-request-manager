import { useState } from "react";

const currentDate = new Date();
const currentDaySystem = currentDate.getDay();
const currentMonthSystem = currentDate.getMonth() + 1;
const currentYearSystem = currentDate.getFullYear();

export default function useDateNavigation(initialViewMode = 0) {
    const [viewMode, setViewMode] = useState(initialViewMode);
    const [currentDay, setCurrentDay] = useState(currentDaySystem);
    const [currentMonth, setCurrentMonth] = useState(currentMonthSystem);
    const [currentYear, setCurrentYear] = useState(currentYearSystem);
    const lowestYear = 2025;

    const handleDayLeft = () => {
        if (!isDayLeftDisabled) {
            setCurrentDay((prev) => (prev - 1 + 7) % 7);
        }
    };

    const handleDayRight = () => {
        if (!isDayRightDisabled) {
            setCurrentDay((prev) => (prev + 1) % 7);
        }
    };

    const isDayLeftDisabled = currentDay === 1;
    const isDayRightDisabled = currentDay === 0;

    const handleMonthLeft = () => {
        if (currentMonth > 1) {
            setCurrentMonth((prev) => prev - 1);
        }
    };

    const handleMonthRight = () => {
        if (
            currentYear < currentYearSystem ||
            (currentYear === currentYearSystem && currentMonth < currentMonthSystem)
        ) {
            setCurrentMonth((prev) => prev + 1);
        }
    };

    const isMonthLeftDisabled = currentMonth === 1;
    const isMonthRightDisabled =
        currentYear === currentYearSystem && currentMonth >= currentMonthSystem;

    const handleYearLeft = () => {
        if (currentYear > lowestYear) {
            setCurrentYear((prev) => prev - 1);
        }
    };

    const handleYearRight = () => {
        if (currentYear < currentYearSystem) {
            setCurrentYear((prev) => prev + 1);
        }
    };

    const isYearLeftDisabled = currentYear <= lowestYear;
    const isYearRightDisabled = currentYear >= currentYearSystem;

    const handleLeftClick = () => {
        if (viewMode === 0) handleMonthLeft();
        if (viewMode === 1) handleYearLeft();
    };

    const handleRightClick = () => {
        if (viewMode === 0) handleMonthRight();
        if (viewMode === 1) handleYearRight();
    };

    const isLeftDisabled =
        (viewMode === 0 && isMonthLeftDisabled) ||
        (viewMode === 1 && isYearLeftDisabled);

    const isRightDisabled =
        (viewMode === 0 && isMonthRightDisabled) ||
        (viewMode === 1 && isYearRightDisabled);

    return {
        viewMode,
        setViewMode,
        currentDay,
        currentMonth,
        currentYear,

        handleDayLeft,
        handleDayRight,
        isDayLeftDisabled,
        isDayRightDisabled,

        handleMonthLeft,
        handleMonthRight,
        isMonthLeftDisabled,
        isMonthRightDisabled,

        handleYearLeft,
        handleYearRight,
        isYearLeftDisabled,
        isYearRightDisabled,

        handleLeftClick,
        handleRightClick,
        isLeftDisabled,
        isRightDisabled,
    };
}

export const getPeriodLabel = (viewMode, month, year, day) => {
    const monthNames = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ];
    const dayNames = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
    ];

    return {
        label: viewMode === 0 ? monthNames[month - 1] : `${year}`,
        dayLabel: day !== undefined ? dayNames[day] : undefined,
    };
};

export const getEnglishDayName = (day) => {
    const dayNamesEnglish = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    return dayNamesEnglish[day];
};
