import { apiFetch } from "@/utils/apiFetch";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import DatePicker from "./DatePicker";
import { showToast } from "@/utils/toastUtils";
import SearchSelect from "./SearchSelect";
import TimePicker from "./TimePicker";
import { Button } from "@/components/ui/button";
import ModalRequestConfirmation from "@/components/ModalRequestConfirmation";
import { TiWarningOutline } from "react-icons/ti";
import { Icon } from "@iconify/react";

const areas = [
  "Laboratorio de Biología Molecular",
  "Laboratorio de Cultivo Celular y Microscopía",
  "Anexo de Cultivo Celular",
  "Laboratorio de Microbiología",
  "Laboratorio de Cromatografía y Espectrofotometría",
  "Laboratorio de Bioprocesos",
  "Laboratorio de Acondicionamiento",
  "Cámara Fría",
  "Bioterio",
];

const RequestEquipment = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [occupiedDates, setOccupiedDates] = useState([]);
  const [occupiedTime, setOccupiedTime] = useState({
    startTime: "",
    startDirection: "before",
    endDirection: "after",
    endTime: "",
  });
  const [datePickerMode, setDatePickerMode] = useState("single");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
    reservedDays: 0,
  });
  const [timeRange, setTimeRange] = useState({
    startTime: "",
    endTime: "",
    reservedHours: 0,
    reservedMinutes: 0,
  });
  const [message, setMessage] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [otherArea, setOtherArea] = useState("");
  const [isOtherChecked, setIsOtherChecked] = useState(false);
  const [observations, setObservations] = useState("");
  const [equipments, setEquipments] = useState([]);
  const [errors, setErrors] = useState({});
  const [workDay, setWorkDay] = useState(true);
  const [workTime, setWorkTime] = useState(true);
  const [isWithin24Hours, setIsWithin24Hours] = useState(false);

  const isToday = (dateStr) => {
    if (!dateStr) return false;
    const today = new Date();
    const compareDate = new Date(dateStr);
    return (
      today.getFullYear() === compareDate.getFullYear() &&
      today.getMonth() === compareDate.getMonth() &&
      today.getDate() === compareDate.getDate()
    );
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  const checkIfWithin24Hours = (startDate, startTime) => {
    if (!startDate || !startTime) return false;

    const now = new Date();
    const requestDateTime = new Date(startDate);
    const [hours, minutes] = startTime.split(":").map(Number);
    requestDateTime.setHours(hours, minutes, 0, 0);

    const timeDifferenceMs = requestDateTime.getTime() - now.getTime();
    const twentyFourHoursMs = 24 * 60 * 60 * 1000;

    return timeDifferenceMs <= twentyFourHoursMs;
  };

  useEffect(() => {
    const isValidWorkDay = (dateStr) => {
      const date = new Date(dateStr);
      const day = date.getDay();
      return day >= 1 && day <= 5;
    };

    const getDatesInRange = (startStr, endStr) => {
      const dates = [];
      const current = new Date(startStr);
      const end = new Date(endStr);

      while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }

      return dates;
    };

    if (!dateRange.startDate || !dateRange.endDate) {
      setWorkDay(true);
      return;
    }

    const allDates = getDatesInRange(dateRange.startDate, dateRange.endDate);
    const allWorkDays = allDates.every((date) => isValidWorkDay(date));

    setWorkDay(allWorkDays);
  }, [dateRange]);

  useEffect(() => {
    const isValidWorkTime = (timeStr) => {
      if (!timeStr) return true;
      const [hour, minute] = timeStr.split(":").map(Number);
      const totalMinutes = hour * 60 + minute;
      return totalMinutes >= 480 && totalMinutes <= 960;
    };
    setWorkTime(
      isValidWorkTime(timeRange.startTime) &&
        isValidWorkTime(timeRange.endTime),
    );
  }, [timeRange]);

  useEffect(() => {
    const within24Hours = checkIfWithin24Hours(
      dateRange.startDate,
      timeRange.startTime,
    );
    setIsWithin24Hours(within24Hours);
  }, [dateRange.startDate, timeRange.startTime]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiFetch("/equipment/basic");
        setEquipments(data);
      } catch (err) {
        console.error("Error al obtener los equipos", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchSelectedEquipmentData = async () => {
      try {
        const occupied = [];
        let hasDailyReservation = false;

        const fetches = selectedItems.map(async (equipment) => {
          const data = await apiFetch(
            `/equipment/barcode/${equipment.barcode}`,
          );

          if (data.reservationType === "D") {
            hasDailyReservation = true;
          }

          if (Array.isArray(data.occupiedTime)) {
            occupied.push(...data.occupiedTime);
          }
        });

        await Promise.all(fetches);

        setDatePickerMode(hasDailyReservation ? "range" : "single");

        setOccupiedDates(occupied);
      } catch (err) {
        setError(err);
      }
    };

    if (selectedItems.length > 0) {
      fetchSelectedEquipmentData();
    } else {
      setOccupiedDates([]);
      setDatePickerMode("single");
    }
  }, [selectedItems]);

  const handleSelectedItemsChange = (newSelectedItems) => {
    setSelectedItems(newSelectedItems);
    setDateRange({
      startDate: "",
      endDate: "",
      reservedDays: 0,
    });
  };

  const parseLocalDate = (isoString) => {
    const [year, month, day] = isoString.split("T")[0].split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
  };

  useEffect(() => {
    const checkOccupiedTimes = () => {
      if (!dateRange.startDate || !dateRange.endDate) return;

      const start = parseLocalDate(dateRange.startDate);
      const end = parseLocalDate(dateRange.endDate);

      let newOccupiedTime = {
        startTime: "",
        endTime: "",
        startDirection: "before",
        endDirection: "after",
      };

      if (isToday(dateRange.startDate)) {
        const currentTime = getCurrentTime();
        newOccupiedTime.startTime = currentTime;
        newOccupiedTime.startDirection = "after";
      }
      if (isToday(dateRange.endDate)) {
        const currentTime = getCurrentTime();
        newOccupiedTime.endTime = currentTime;
        newOccupiedTime.endDirection = "after";
      }

      occupiedDates.forEach((occ) => {
        const occStart = parseLocalDate(occ.startingDate);
        const occEnd = parseLocalDate(occ.finishingDate);

        const startDateOnly = start.toISOString().split("T")[0];
        const endDateOnly = end.toISOString().split("T")[0];
        const occStartDateOnly = occStart.toISOString().split("T")[0];
        const occEndDateOnly = occEnd.toISOString().split("T")[0];

        if (startDateOnly === occStartDateOnly) {
          if (isToday(dateRange.startDate) && newOccupiedTime.startTime) {
            if (occ.startingTime > newOccupiedTime.startTime) {
              newOccupiedTime.startTime = occ.startingTime;
              newOccupiedTime.startDirection = "before";
            }
          } else {
            newOccupiedTime.startTime = occ.startingTime;
            newOccupiedTime.startDirection = "before";
          }
        }
        if (endDateOnly === occEndDateOnly) {
          newOccupiedTime.endTime = occ.finishingTime;
          newOccupiedTime.endDirection = "after";
        }
        if (startDateOnly === occEndDateOnly) {
          if (isToday(dateRange.startDate) && newOccupiedTime.startTime) {
            if (occ.finishingTime > newOccupiedTime.startTime) {
              newOccupiedTime.startTime = occ.finishingTime;
              newOccupiedTime.startDirection = "after";
            }
          } else {
            newOccupiedTime.startTime = occ.finishingTime;
            newOccupiedTime.startDirection = "after";
          }
        }
        if (occStartDateOnly === endDateOnly) {
          newOccupiedTime.endTime = occ.startingTime;
          newOccupiedTime.endDirection = "before";
        }
      });

      setOccupiedTime(newOccupiedTime);
    };

    checkOccupiedTimes();
  }, [dateRange, occupiedDates]);

  const handleAreaChange = (area) => {
    setSelectedAreas((prevSelectedAreas) => {
      if (prevSelectedAreas.includes(area)) {
        return prevSelectedAreas.filter((item) => item !== area);
      } else {
        return [...prevSelectedAreas, area];
      }
    });
  };

  useEffect(() => {
    const { startTime, endTime } = timeRange;

    if (!startTime || !endTime) return;

    const calculateTimeDifference = (startTime, endTime) => {
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      const start = new Date(0, 0, 0, startHour, startMinute);
      const end = new Date(0, 0, 0, endHour, endMinute);

      let diff = (end - start) / (1000 * 60);

      if (diff < 0) {
        diff += 24 * 60;
      }

      const reservedHours = Math.floor(diff / 60);
      const reservedMinutes = diff % 60;

      return { reservedHours, reservedMinutes };
    };

    const { reservedHours, reservedMinutes } = calculateTimeDifference(
      startTime,
      endTime,
    );

    setTimeRange((prev) => ({
      ...prev,
      reservedHours,
      reservedMinutes,
    }));
  }, [timeRange.startTime, timeRange.endTime]);

  const handleObservationsChange = (event) => {
    setObservations(event.target.value);
  };

  const handleSubmit = async () => {
    const newErrors = {
      dateRange: !dateRange.startDate || !dateRange.endDate,
      timeRange: !timeRange.startTime || !timeRange.endTime,
      timeRangeStartEnd:
        timeRange.startTime &&
        timeRange.endTime &&
        dateRange.startDate === dateRange.endDate &&
        timeRange.startTime >= timeRange.endTime,
      selectedItems: selectedItems.length === 0,
      selectedAreas:
        selectedAreas.length === 0 && (!isOtherChecked || !otherArea.trim()),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error);
    if (hasErrors) return;

    const within24 = checkIfWithin24Hours(
      dateRange.startDate,
      timeRange.startTime,
    );
    if (within24) {
      showToast("Recuerda hacer tu solicitud con anticipación", "warning");
    }

    const formattedRequest = {
      typeOfRequest: "EQ",
      occupiedMaterial: selectedItems.map((item) => ({
        barcode: item.barcode,
      })),
      workArea: [
        ...selectedAreas,
        ...(isOtherChecked && otherArea.trim() ? [otherArea.trim()] : []),
      ],
      requestDate: {
        startingDate: new Date(dateRange.startDate).toISOString(),
        finishingDate: new Date(dateRange.endDate).toISOString(),
        startingTime: timeRange.startTime,
        finishingTime: timeRange.endTime,
        reservedDays: dateRange.reservedDays,
        reservedHours: timeRange.reservedHours,
        reservedMinutes: timeRange.reservedMinutes,
      },
      registrationNumber: jwtDecode(localStorage.getItem("token"))
        .registrationNumber, // placeholder
      observations: observations,
    };

    try {
      const data = await apiFetch("/request", {
        method: "POST",
        body: JSON.stringify(formattedRequest),
      });

      setMessage(true);
      setSelectedItems([]);
      setDateRange({ startDate: "", endDate: "", reservedDays: 0 });
      setTimeRange({
        startTime: "",
        endTime: "",
        reservedHours: 0,
        reservedMinutes: 0,
      });
      setSelectedAreas([]);
      setObservations("");
      setErrors({});
    } catch (error) {
      if (
        error.message ===
        "Error creating request: Error: Error fetching user: Technician not found or not assigned to this work area"
      ) {
        showToast("No hay técnico asignado para alguna de las áreas", "error");
      } else {
        showToast(error, "error");
      }
    }
  };

  const handleCloseMessage = () => {
    setMessage(false);
  };

  return (
    <div className="relative w-full flex-1 flex items-center justify-center md:pt-4 md:pb-8">
      <div className="md:w-2/3 h-fit bg-white md:px-14 px-0 py-8 flex flex-col rounded-md shadow-md m-2">
        <div className="text-lg mb-2 text-center font-poppins font-semibold">
          Ingrese los datos correspondientes
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2  gap-4 mt-5">
          <div className="flex flex-col">
            <div className="p-2 flex flex-col">
              <span className="inline-block mb-2 font-montserrat font-semibold">
                Equipo(s) que utilizará <span className="text-red-500">*</span>
              </span>
              <SearchSelect
                options={equipments.map((eq) => ({
                  barcode: eq.barcode,
                  photoId: eq.photoID,
                  name: eq.name,
                  brand: eq.brand,
                  location: eq.location,
                  status: eq.status,
                }))}
                selectedItems={selectedItems}
                onSelectedItemsChange={handleSelectedItemsChange}
                className="font-montserrat text-sm"
                placeholder="Buscar con el nombre"
              />
              {errors.selectedItems && (
                <p className="text-red-500 text-xs font-montserrat font-semibold mt-1">
                  Este campo es obligatorio
                </p>
              )}
            </div>
            <div className="p-2">
              <span className="inline-block mb-2 font-montserrat font-semibold">
                Fecha en la que se requiere{" "}
                <span className="text-red-500">*</span>
              </span>
              <DatePicker
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                onChange={setDateRange}
                mode={datePickerMode}
                occupiedDates={occupiedDates}
                onlyWorkDays={false}
              />
              {errors.dateRange && (
                <p className="mt-1 text-red-500 text-xs font-montserrat font-semibold">
                  Este campo es obligatorio
                </p>
              )}
              {!workDay && (
                <p className="flex justify-center items-center text-request-alert bg-warning-toast-icon-background text-xs font-montserrat font-semibold mt-1 p-2 w-fit rounded-full">
                  <TiWarningOutline size={20} className="mr-1" />
                  <p className="pr-2">
                    Está solicitando el uso del equipo fuera del horario
                    laboral.
                  </p>
                </p>
              )}
            </div>

            <div className="p-2 flex flex-col font-montserrat">
              <span className="inline-block mb-2 font-semibold">
                Horario en el que se requiere{" "}
                <span className="text-red-500">*</span>
              </span>
              <div className="flex flex-wrap gap-2">
                <div className="font-monot">
                  <div className="flex select-none font-medium">Desde</div>
                  <TimePicker
                    timeRange={timeRange}
                    setTimeRange={setTimeRange}
                    type="start"
                    className="select-none"
                    limitTime={occupiedTime.startTime}
                    limitDirection={occupiedTime.startDirection}
                  />
                </div>
                <div className="font-montserrat">
                  <div className="flex select-none font-medium">Hasta</div>
                  <TimePicker
                    timeRange={timeRange}
                    setTimeRange={setTimeRange}
                    type="end"
                    className="select-none"
                    limitTime={occupiedTime.endTime}
                    limitDirection={occupiedTime.endDirection}
                  />
                </div>
              </div>
              {errors.timeRange && (
                <p className="text-red-500 text-xs font-montserrat font-semibold mt-1">
                  Este campo es obligatorio
                </p>
              )}
              {errors.timeRangeStartEnd && (
                <p className="text-red-500 text-xs font-montserrat font-semibold mt-1">
                  El tiempo final debe de ser mayor al de inicio
                </p>
              )}
              {!workTime && (
                <p className="flex justify-center items-center text-warning-toast-icon bg-warning-toast-icon-background text-xs font-montserrat font-semibold mt-2 p-2 w-fit rounded-full">
                  <TiWarningOutline size={20} className="mr-1" />
                  <p className="pr-2">
                    Está solicitando el equipo en un horario extra temporal
                  </p>
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="p-2">
              <span className="inline-block mb-1 font-montserrat font-semibold">
                Áreas de Trabajo <span className="text-red-500">*</span>
              </span>
              <ul className="font-montserrat">
                {areas.map((option) => {
                  return (
                    <li key={option}>
                      <label className="flex items-center cursor-pointer mb-1">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={selectedAreas.includes(option)}
                            onChange={() => handleAreaChange(option)}
                            className="sr-only peer"
                          />
                          <div className="w-4 h-4 border-2 border-primary-blue rounded-xs peer-checked:bg-primary-blue"></div>
                          <svg
                            className="absolute top-1/2 left-1/2 w-3.5 h-3.5 text-white transform -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden peer-checked:block"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="ml-2">{option}</span>
                      </label>
                    </li>
                  );
                })}
                <li>
                  <label className="flex items-center cursor-pointer mb-1">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={isOtherChecked}
                        onChange={(e) => setIsOtherChecked(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-4 h-4 border-2 border-primary-blue rounded-xs peer-checked:bg-primary-blue"></div>
                      <svg
                        className="absolute top-1/2 left-1/2 w-3.5 h-3.5 text-white transform -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden peer-checked:block"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="ml-2">Otra área de trabajo</span>
                  </label>
                  {isOtherChecked && (
                    <input
                      type="text"
                      className="ml-6 mt-1 border-b border-gray-400 text-sm w-full font-montserrat outline-none"
                      placeholder="Escriba un área de trabajo"
                      value={otherArea}
                      onChange={(e) => setOtherArea(e.target.value)}
                    />
                  )}
                </li>
              </ul>
              {errors.selectedAreas && (
                <p className="text-red-500 text-xs font-montserrat font-semibold">
                  Este campo es obligatorio
                </p>
              )}
            </div>
            <div className="flex flex-col w-full h-full p-2">
              <label
                htmlFor="observaciones"
                className="mb-2 select-none font-montserrat font-semibold"
              >
                Observaciones
              </label>
              <textarea
                id="observaciones"
                className="w-full h-24 rounded-md border-2 border-primary-blue p-3 placeholder:text-sm placeholder:font-montserrat font-montserrat font-normal focus:outline-none focus:ring-primary-blue focus:border-transparent focus:bg-input-background focus:ring-2"
                placeholder="Escriba aquí sus observaciones."
                value={observations}
                onChange={handleObservationsChange}
                maxLength={150}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center mt-4">
          <Button
            className="bg-deep-blue hover:bg-dark-blue text-white text-xl font-poppins font-semibold tracking-wide py-5 px-15"
            onClick={handleSubmit}
            aria-label="Enviar solicitud"
          >
            Enviar
          </Button>
        </div>
      </div>
      {message && (
        <ModalRequestConfirmation
          onClose={handleCloseMessage}
          isConfirming={false}
        />
      )}
      <a
        href=""
        title="Tutorial de solicitud de equipo"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-blue-bg-gradient hover:bg-dim-blue-background text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition duration-300"
        aria-label="Ir al tutorial de solicitud de equipo"
      >
        <Icon
          icon="bi:question-lg"
          className="text-3xl"
          aria-label="Icono de pregunta"
        />
      </a>
    </div>
  );
};

export default RequestEquipment;
