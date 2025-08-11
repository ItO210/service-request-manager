import { GoBeaker } from "react-icons/go";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setActiveItem(location.pathname);
    setMenuOpen(false); // close dropdown on navigation
  }, [location]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const navItems = [
    {
      path: "/solicitud/equipo",
      icon: <Icon icon="iconoir:microscope-solid" className="text-2xl" />,
      label: "Solicitar equipo",
    },
    {
      path: "/solicitud/material",
      icon: <GoBeaker size={25} />,
      label: "Solicitar reactivos y materiales",
    },
    {
      path: "/solicitud/apoyo",
      icon: <Icon icon="mdi:account-help" className="text-3xl" />,
      label: "Apoyo técnico",
    },
  ];

  const currentItem = navItems.find((item) => item.path === activeItem);
  const otherItems = navItems.filter((item) => item.path !== activeItem);

  return (
    <div className="w-full py-2">
      <div className="hidden md:flex justify-around items-center">
        {navItems.map(({ path, icon, label }) => (
          <div
            key={path}
            className={`flex items-center p-4 cursor-pointer hover:text-dark-blue ${
              activeItem === path
                ? "text-dark-blue border-b-2"
                : "text-deep-blue"
            }`}
            onClick={() => handleNavigation(path)}
          >
            {icon}
            <div className="pl-4 font-poppins font-bold md:text-lg">
              {label}
            </div>
          </div>
        ))}
      </div>

      <div className="md:hidden px-4">
        <button
          className="w-full flex justify-between items-center p-4 border rounded text-deep-blue font-poppins font-bold"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="flex items-center">
            {currentItem?.icon}
            <span className="pl-2">{currentItem?.label}</span>
          </div>
          <Icon icon={menuOpen ? "mdi:chevron-up" : "mdi:chevron-down"} />
        </button>

        {menuOpen && (
          <div className="mt-2 p-2 border rounded shadow border-deep-blue">
            {otherItems.map(({ path, icon, label }) => (
              <div
                key={path}
                className="flex items-center p-4 cursor-pointer hover:text-dark-blue text-deep-blue"
                onClick={() => handleNavigation(path)}
              >
                {icon}
                <div className="pl-4 font-poppins">{label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
