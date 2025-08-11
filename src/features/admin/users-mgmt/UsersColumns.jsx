import { Icon } from "@iconify/react";
import { ROLES } from "@/constants/roles";

export const UsersColumns = (handleEdit, selectedUser) => [
  { header: "Nombre", accessorKey: "name" },
  { header: "Clave de usuario", accessorKey: "registrationNumber" },
  { 
    header: "Rol", 
    accessorFn: (row => row.role),
    cell: ({ getValue }) => {
      const value = getValue();
      if (value === ROLES.ADMIN) return "Administrador";
      if (value === ROLES.TECH) return "Técnico";
      if (value === ROLES.USER) return "Usuario";
      return "Desconocido";
    }
  },
  { header: "Correo electrónico", accessorKey: "email" },
  {
    header: "",
    id: "actions",
    cell: ({ row }) => {
      const isSelected =
        selectedUser?.registrationNumber === row.original.registrationNumber;
      return (
        <button
          onClick={() => handleEdit(row.original)}
          className={`text-black p-1 cursor-pointer transition-transform duration-200 ease-in-out ${
            isSelected
              ? "text-popup-background scale-115"
              : "hover:text-popup-background hover:scale-115"
          }`}
          title="Editar usuario"
          aria-label="Editar usuario"
        >
          <Icon icon="mdi:edit-circle-outline" className="text-2xl" />
        </button>
      );
    },
  },
];
