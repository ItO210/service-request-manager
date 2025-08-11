import React from "react";
import { Icon } from "@iconify/react";

const TimePicker = ({
  timeRange,
  setTimeRange,
  type = "start",
  className,
  limitTime = null,
  limitDirection = null,
  onlyWorkHours = false,
}) => {
  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );

  const handleChange = (unit, value) => {
    const key = type === "start" ? "startTime" : "endTime";
    const existingTime = timeRange[key] || ":";
    const [existingHour = "", existingMinute = ""] = existingTime.split(":");
    const newTime =
      unit === "hour"
        ? `${value}:${existingMinute || "00"}`
        : `${existingHour || "00"}:${value}`;
    setTimeRange((prev) => ({
      ...prev,
      [key]: newTime,
    }));
  };

  const currentTime =
    timeRange[type === "start" ? "startTime" : "endTime"] || "";
  const [selectedHour = "", selectedMinute = ""] = currentTime.split(":");

  const [limitHour, limitMinute] = limitTime
    ? limitTime.split(":").map(Number)
    : [null, null];
  const limitTotalMinutes =
    limitHour !== null && limitMinute !== null
      ? limitHour * 60 + limitMinute
      : null;

  const isAllowed = (h, m) => {
    const hour = parseInt(h);
    const minute = parseInt(m);

    if (onlyWorkHours) {
      if (hour < 8 || hour > 16) return false;
      if (hour === 16 && minute > 0) return false;
    }

    if (limitTotalMinutes === null) return true;
    const total = hour * 60 + minute;
    if (limitDirection === "before") return total < limitTotalMinutes;
    if (limitDirection === "after") return total > limitTotalMinutes;
    return true;
  };

  const getValidHours = () =>
    hours.filter((h) => {
      return minutes.some((m) => isAllowed(h, m));
    });

  const getValidMinutes = () =>
    minutes.map((m) => ({
      value: m,
      disabled: !selectedHour || !isAllowed(selectedHour, m),
    }));

  const validHours = getValidHours();
  const validMinutes = getValidMinutes();

  return (
    <div className={`flex gap-2 items-center ${className}`}>
      <Icon icon="tabler:clock" className="text-2xl" />
      <select
        value={selectedHour}
        onChange={(e) => handleChange("hour", e.target.value)}
        className="bg-white border border-primary-blue rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-blue focus:border-primary-blue p-2 cursor-pointer"
      >
        <option value="">HH</option>
        {validHours.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
      :
      <select
        value={selectedMinute}
        onChange={(e) => handleChange("minute", e.target.value)}
        className={`bg-white border border-primary-blue rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue p-2 ${
          !selectedHour ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={!selectedHour}
      >
        <option value="">MM</option>
        {validMinutes.map(({ value, disabled }) => (
          <option key={value} value={value} disabled={disabled}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimePicker;
