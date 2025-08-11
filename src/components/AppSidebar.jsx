import * as React from "react"
import { ROLES } from "@/constants/roles";
import { jwtDecode } from "jwt-decode";
import { NavMain } from "@/components/NavMain"
import { Logout } from "@/components/LogoutFooter"
import { CicataSidebarHeader } from "@/components/CicataSidebarHeader"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/Sidebar"

const data = {
  [ROLES.ADMIN]: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: "material-symbols:home-outline-rounded",
      isActive: true,
    },
    {
      title: "Solicitudes",
      url: "/gestion/solicitudes",
      icon: "fluent:form-28-regular",
    },
    {
      title: "Inventarios",
      url: "/inventario/equipos",
      icon: "ix:product-catalog",
      items: [
        {
          title: "Equipos",
          url: "/inventario/equipos",
        },
        {
          title: "Reactivos",
          url: "/inventario/reactivos",
        },
        {
          title: "Materiales",
          url: "/inventario/materiales",
        },
      ],
    },
    {
      title: "Usuarios",
      url: "/gestion/usuarios",
      icon: "la:users-cog",
    },
  ],
  [ROLES.TECH]: [
    {
      title: "Solicitudes",
      url: "/gestion/solicitudes",
      icon: "fluent:form-28-regular",
    },
    {
      title: "Inventarios",
      url: "/inventario/equipos",
      icon: "ix:product-catalog",
      items: [
        {
          title: "Equipos",
          url: "/inventario/equipos",
        },
        {
          title: "Reactivos",
          url: "/inventario/reactivos",
        },
        {
          title: "Materiales",
          url: "/inventario/materiales",
        },
      ],
    },
    {
      title: "Movimientos",
      url: "/movimientos",
      icon: "material-symbols:cycle",
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  const { role } = jwtDecode(localStorage.getItem("token"));
  const navItems = data[role];

  return (
    <Sidebar collapsible="icon" className="flex flex-col h-full" {...props}>
      <SidebarHeader>
        <CicataSidebarHeader />
      </SidebarHeader>
      <SidebarContent className="flex-1 min-h-0 overflow-y-auto pb-70">
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter className="shrink-0">
        <Logout />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
