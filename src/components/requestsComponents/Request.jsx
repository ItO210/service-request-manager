import { IoIosInformationCircleOutline } from "react-icons/io";

const Request = ({ item, index, isActive, onClick, onCancel }) => {
  const handleLiClick = async (item, index) => {
    setActiveFileIndex(index);
  };

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${month}/${day}/${year}`;
  };

  const handleCancel = () => {
    onCancel(item._id);
  };

  return (
    <div
      className="relative grid grid-cols-4 w-full bg-table-row rounded-2xl my-2 p-6 items-center"
      key={item._id}
      onClick={() => handleLiClick(item, index)}
    >
      <p className="text-center">{item.type}</p>
      <p className="text-center">{item.date}</p>
      <div className="w-full flex items-center justify-center">
        {" "}
        <p
          className={`w-fit rounded-full px-4 ${
            item.status === "En progreso"
              ? "bg-in-progress-status"
              : item.status === "Aprobada"
              ? "bg-approved-status"
              : item.status === "Rechazada"
              ? "bg-rejected-status"
              : "bg-gray-200"
          }`}
        >
          {item.status}
        </p>
      </div>

      {item.status === "En progreso" ? (
        <div className="w-full flex items-center justify-center">
          {" "}
          <button
            className="w-fit px-4 rounded-lg bg-primary-blue text-white"
            onClick={handleCancel}
            aria-label="Cancelar solicitud"
          >
            Cancelar
          </button>
        </div>
      ) : (
        ""
      )}

      <button className="absolute -right-10" onClick={onClick} aria-label="Ver detalles de la solicitud">
        <div className={isActive ? "text-green-500" : "text-black"}>
          <IoIosInformationCircleOutline size={32} />
        </div>
      </button>

      {isActive && (
        <div className="w-full grid grid-cols-2 col-span-4 bg-white border border-primary-blue mt-4 rounded-2xl shadow-md">
          <div className="p-2 border-r border-primary-blue">
            <p>ID</p>
            <p className=" text-neutral-400">10</p>
            <p>Email</p>
            <p className=" text-neutral-400">luisa2@ipn.mx</p>
            <p>Nombre</p>
            <p className=" text-neutral-400">Luisa Gutierrez</p>
            <p>Clave de usuario</p>
            <p className=" text-neutral-400">PI-02</p>
            <p>Fecha en la que se requiere</p>
            <p className=" text-neutral-400">02/05/2025</p>
            <p>Horario en que se requiere</p>
            <p className=" text-neutral-400"> 12:00 - 13:30</p>
            <p>Area de trabajo</p>
            <p className=" text-neutral-400">Laboriatorio de Microbiologia</p>
          </div>
          <div className="p-2">
            <p>Tipo</p>
            <p className=" text-neutral-400">Equipo</p>
            <p>Tecnico asignado</p>
            <p className=" text-neutral-400">Eduardo</p>
            <p>Equipo(s) que utilizara</p>
            <p className=" text-neutral-400">
              Encubadora de CO2, Microscopio invertido
            </p>
            <p>Observaciones de revision:</p>
            <p className=" text-neutral-400">
              Datos Incorrectos. Envia de nuevo la solicitud
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Request;
