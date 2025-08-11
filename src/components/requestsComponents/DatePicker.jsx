import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { showToast } from "@/utils/toastUtils";

const DateRangePicker = ({
  startDate,
  endDate,
  onChange,
  mode,
  onlyWorkDays = true,
  occupiedDates = [],
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selecting, setSelecting] = useState("start");
  const [hoverDate, setHoverDate] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: startDate ? new Date(startDate) : null,
    end: endDate ? new Date(endDate) : null,
  });

  useEffect(() => {
    if (startDate && endDate) {
      setDateRange({
        start: new Date(startDate),
        end: new Date(endDate),
      });
    } else {
      setDateRange({ start: null, end: null });
    }
  }, [startDate, endDate]);

  const parseLocalDate = (isoString) => {
    const [year, month, day] = isoString.split("T")[0].split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
  };

  const blockedRanges = occupiedDates.map(
    ({ startingDate, finishingDate }) => ({
      start: parseLocalDate(startingDate),
      end: parseLocalDate(finishingDate),
    })
  );

  const isWeekend = (date) => {
    if (onlyWorkDays === true) {
      const dayOfWeek = date.getDay();
      return dayOfWeek === 0 || dayOfWeek === 6;
    }
    return false;
  };

  const isTodayBlockedByTime = (date) => {
    if (!onlyWorkDays) return false;

    const today = new Date();
    const testDate = new Date(date);

    const isToday = today.toDateString() === testDate.toDateString();

    if (isToday) {
      const currentHour = today.getHours();
      return currentHour >= 16;
    }

    return false;
  };

  const isBlocked = (date) => {
    const isOccupied = blockedRanges.some(({ start, end }) => {
      const day = new Date(date);
      day.setHours(0, 0, 0, 0);
      start = new Date(start);
      end = new Date(end);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return day >= start && day <= end;
    });

    const isWeekendDay = isWeekend(date);
    const isTodayAfter4PM = isTodayBlockedByTime(date);

    return isOccupied || isWeekendDay || isTodayAfter4PM;
  };

  const isPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const day = new Date(date);
    day.setHours(0, 0, 0, 0);

    return day < today;
  };

  const isBlockedStart = (date) => {
    return blockedRanges.some(({ start }) => {
      const day = new Date(date);
      day.setHours(0, 0, 0, 0);
      start = new Date(start);
      start.setHours(0, 0, 0, 0);
      return day.getTime() === start.getTime();
    });
  };

  const isBlockedEnd = (date) => {
    return blockedRanges.some(({ end }) => {
      const day = new Date(date);
      day.setHours(0, 0, 0, 0);
      end = new Date(end);
      end.setHours(0, 0, 0, 0);
      return day.getTime() === end.getTime();
    });
  };

  const isBlockedInRange = (start, end) => {
    let currentDate = new Date(start);
    currentDate.setDate(currentDate.getDate() + 1);
    while (currentDate < end) {
      if (isBlocked(currentDate)) {
        return true;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return false;
  };

  const getMondayOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const isSameWorkWeek = (date1, date2) => {
    const monday1 = getMondayOfWeek(date1);
    const monday2 = getMondayOfWeek(date2);
    return monday1.getTime() === monday2.getTime();
  };

  const isOutsideWorkWeekRange = (date) => {
    if (!onlyWorkDays || !dateRange.start || selecting === "start") {
      return false;
    }

    return !isSameWorkWeek(dateRange.start, date);
  };

  const generateCalendarDays = (month, year) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const days = [];

    if (onlyWorkDays === true) {
      const firstDay = firstDayOfMonth.getDay();
      const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

      const prevMonthDaysCount = new Date(year, month, 0).getDate();
      const prevMonthStartDay = prevMonthDaysCount - adjustedFirstDay + 1;

      for (let i = prevMonthStartDay; i <= prevMonthDaysCount; i++) {
        const date = new Date(year, month - 1, i);
        const dayOfWeek = date.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          days.push(date);
        }
      }

      for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          days.push(date);
        }
      }

      const totalCells = 35;
      let nextMonthDay = 1;
      while (days.length < totalCells) {
        const date = new Date(year, month + 1, nextMonthDay);
        const dayOfWeek = date.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          days.push(date);
        }
        nextMonthDay++;
      }
    } else {
      const firstDay = firstDayOfMonth.getDay();
      const prevMonthDaysCount = new Date(year, month, 0).getDate();
      const prevMonthStartDay = prevMonthDaysCount - firstDay + 1;

      for (let i = prevMonthStartDay; i <= prevMonthDaysCount; i++) {
        days.push(new Date(year, month - 1, i));
      }

      for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        days.push(new Date(year, month, day));
      }

      const totalCells = 42;
      const remainingCells = totalCells - days.length;
      for (let i = 1; i <= remainingCells; i++) {
        days.push(new Date(year, month + 1, i));
      }
    }

    return days;
  };

  const isInRange = (date) => {
    if (!dateRange.start || !dateRange.end) return false;
    return date > dateRange.start && date < dateRange.end;
  };

  const isInHoverRange = (date) => {
    if (!dateRange.start || !hoverDate || dateRange.end) return false;

    if (
      onlyWorkDays &&
      selecting === "end" &&
      !isSameWorkWeek(dateRange.start, date)
    ) {
      return false;
    }

    return (
      (date > dateRange.start && date < hoverDate) ||
      (date < dateRange.start && date > hoverDate)
    );
  };

  const handleDateSelect = (selectedDate) => {
    if (
      isPast(selectedDate) ||
      (isBlocked(selectedDate) &&
        !isBlockedStart(selectedDate) &&
        !isBlockedEnd(selectedDate)) ||
      isOutsideWorkWeekRange(selectedDate)
    )
      return;

    const newDateRange = { ...dateRange };

    if (mode === "single") {
      newDateRange.start = selectedDate;
      newDateRange.end = selectedDate;
      onChange({
        startDate: selectedDate.toISOString(),
        endDate: selectedDate.toISOString(),
        reservedDays: 1,
      });
    } else {
      if (selecting === "start" || !dateRange.start) {
        newDateRange.start = selectedDate;
        newDateRange.end = null;
        setSelecting("end");
      } else {
        if (selectedDate < dateRange.start) {
          newDateRange.end = newDateRange.start;
          newDateRange.start = selectedDate;
        } else {
          newDateRange.end = selectedDate;
        }

        if (isBlockedInRange(newDateRange.start, newDateRange.end)) {
          showToast("Rango de fecha invalido", "error");
          return;
        }
        setSelecting("start");

        const reservedDays =
          Math.ceil(
            (newDateRange.end.setHours(0, 0, 0, 0) -
              newDateRange.start.setHours(0, 0, 0, 0)) /
              (1000 * 60 * 60 * 24)
          ) + 1;

        onChange({
          startDate: newDateRange.start.toISOString(),
          endDate: newDateRange.end.toISOString(),
          reservedDays,
        });
      }
    }
    setDateRange(newDateRange);
  };

  const handleDateHover = (date) => {
    if (dateRange.start && !dateRange.end) {
      setHoverDate(date);
    }
  };

  const handlePreviousMonth = (e) => {
    e.stopPropagation();
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const { month, year } = {
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
  };

  const days = generateCalendarDays(month, year);
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="relative select-none">
      {" "}
      <div className="w-full p-5 bg-white border-2 border-primary-blue rounded-lg z-10 font-montserrat">
        {" "}
        <div className="flex justify-between items-center pb-4 px-2">
          {" "}
          <span className="p-2 text-center font-semibold">
            {capitalize(
              new Date(year, month).toLocaleString("es-MX", {
                month: "long",
              })
            )}{" "}
            {year}
          </span>
          <div className="p-2 flex items-center justify-center">
            {" "}
            <button
              type="button"
              onClick={handlePreviousMonth}
              className="text-gray-600 hover:text-primary-blue transition cursor-pointer"
              aria-label="Mes anterior"
            >
              <Icon icon="iconamoon:arrow-left-2-light" className="text-2xl" />
            </button>
            <button
              onClick={handleNextMonth}
              className="text-gray-600 hover:text-primary-blue transition cursor-pointer"
              aria-label="Mes siguiente"
            >
              <Icon icon="iconamoon:arrow-right-2-light" className="text-2xl" />
            </button>
          </div>
        </div>
        <div
          className={`grid gap-0.5 text-sm text-gray-700 ${
            onlyWorkDays === true ? "grid-cols-5" : "grid-cols-7"
          }`}
        >
          {" "}
          {/* Day of week headers */}
          {(onlyWorkDays === true
            ? ["L", "M", "M", "J", "V"]
            : ["D", "L", "M", "M", "J", "V", "S"]
          ).map((day, index) => (
            <div className="w-full flex items-center justify-center">
              <div
                key={index}
                className="w-10 h-10 flex justify-center items-start"
              >
                {day}
              </div>
            </div>
          ))}
          {days
            .filter((day) => {
              if (onlyWorkDays === true) {
                const dayOfWeek = day.getDay();
                return dayOfWeek !== 0 && dayOfWeek !== 6;
              }
              return true;
            })
            .map((day, filteredIndex) => {
              const isStart =
                dateRange.start &&
                day.toDateString() === dateRange.start.toDateString();
              const isEnd =
                dateRange.end &&
                day.toDateString() === dateRange.end.toDateString();
              const isRangeDay = isInRange(day);
              const isHoverDay = isInHoverRange(day);
              const isDisabled = isBlocked(day);
              const isBlockedStartDay = isBlockedStart(day);
              const isBlockedEndDay = isBlockedEnd(day);
              const isPastDay = isPast(day);
              const isOutsideWorkWeek = isOutsideWorkWeekRange(day);

              return (
                <div className="w-full flex items-center justify-center">
                  <div
                    key={`${day.getTime()}-${filteredIndex}`}
                    onClick={() => handleDateSelect(day)}
                    onMouseEnter={() => handleDateHover(day)}
                    className={`w-10 h-10 flex items-center justify-center 
                  ${isDisabled || isOutsideWorkWeek ? "cursor-not-allowed" : ""}
                  ${isHoverDay ? "bg-indigo-50 text-black rounded-full" : ""}
                  ${
                    isBlockedStartDay
                      ? `bg-deep-blue/75 text-white rounded-full ${
                          isPastDay ? "cursor-not-allowed" : "cursor-pointer"
                        }`
                      : ""
                  } 
                  ${
                    isBlockedEndDay
                      ? `bg-deep-blue/75 text-white rounded-full ${
                          isPastDay ? "cursor-not-allowed" : "cursor-pointer"
                        }`
                      : ""
                  } 
                  ${
                    isDisabled && !isBlockedStartDay && !isBlockedEndDay
                      ? " text-gray-400 rounded-full line-through"
                      : ""
                  } 
                  ${
                    isStart || isEnd
                      ? "bg-primary-blue text-white rounded-full"
                      : ""
                  } 
                  ${isRangeDay ? "bg-indigo-100 rounded-full" : ""} 
                  ${day.getMonth() !== month ? "text-gray-400" : ""} 
                  ${
                    !isDisabled && !isPastDay && !isOutsideWorkWeek
                      ? "hover:bg-indigo-100 hover:rounded-full"
                      : ""
                  }
                  
                  ${
                    isPastDay
                      ? "text-gray-400 cursor-not-allowed line-through"
                      : ""
                  }

                  ${
                    isOutsideWorkWeek
                      ? "text-gray-300 cursor-not-allowed opacity-50"
                      : ""
                  }


                `}
                  >
                    {day.getDate()}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      {dateRange.start !== null && dateRange.end !== null && (
        <div className="font-montserrat pt-2">
          {formatDate(dateRange.start) === formatDate(dateRange.end)
            ? `Fecha seleccionada: ${formatDate(dateRange.start)}`
            : `Fecha de inicio: ${formatDate(
                dateRange.start
              )} Fecha de fin: ${formatDate(dateRange.end)} `}
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
