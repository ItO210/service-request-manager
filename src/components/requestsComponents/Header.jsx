import { Icon } from "@iconify/react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Logout } from "@/components/LogoutFooter";

const Header = () => {
  const location = useLocation();
  const isRequestForm = location.pathname.startsWith("/solicitud/");
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex h-fit items-center justify-between bg-gradient-to-r from-blue-bg-gradient to-dim-blue-background md:px-6 px-2">
      <div className="flex">
        {" "}
        <img
          src="/Logo.png"
          alt="Logo CICATA"
          className="md:h-12 h-8 w-auto m-4"
        />
      </div>

      <div className="flex items-center text-white">
        <div className="md:m-4 flex">
          {isRequestForm ? (
            <Link
              to="/solicitudes"
              className="flex items-center justify-center gap-2 text-white font-poppins font-semibold text-base transition-all duration-200 ease-in-out md:px-4 md:py-2 rounded-md hover:text-sidebar-accent-foreground cursor-pointer"
            >
              <Icon
                icon="fluent:form-28-regular"
                className="text-2xl hidden md:block"
              />
              <span className="text-center text-sm md:text-base p-2">
                Mis Solicitudes
              </span>
            </Link>
          ) : (
            <Link
              to="/solicitud/equipo"
              className="flex items-center justify-center gap-2 text-white font-poppins font-semibold text-base transition-all duration-200 ease-in-out md:px-4 md:py-2 rounded-md hover:text-sidebar-accent-foreground cursor-pointer"
            >
              <Icon
                icon="fluent:form-new-28-regular"
                className="hidden md:block text-2xl"
              />
              <span className="text-center text-sm md:text-base p-2">
                Nueva Solicitud
              </span>
            </Link>
          )}
        </div>

        <div className="flex items-center md:m-4">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-1 text-white font-poppins font-semibold text-base transition-all duration-200 ease-in-out md:px-4 md:py-2 rounded-md hover:text-sidebar-accent-foreground cursor-pointer"
          >
            <Icon icon="ic:round-logout" className="w-5 h-5 hidden md:block" />
            <span className="text-center text-sm md:text-base p-2">
              Cerrar sesión
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
