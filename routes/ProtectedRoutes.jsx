import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ROLES } from "@/constants/roles";

export default function ProtectedRoutes({ allowedRoles }) {
    const token = localStorage.getItem("token");

    // Redirect to login if no token
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // Declare role before try
    let role = null;
    try {
        ({ role } = jwtDecode(token));
    } catch (error) {
        return <Navigate to="/" replace />;
    }    

    const roleHomeRoutes = {
        [ROLES.ADMIN]: "/dashboard",
        [ROLES.TECH]: "/gestion/solicitudes",
        [ROLES.USER]: "/solicitud/equipo",
    };

    // Redirects to the home route of the role if the role is not in the allowed roles
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to = {roleHomeRoutes[role] || "/"} replace />;
    }

    return <Outlet />;
}
