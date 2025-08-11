import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ROLES } from "@/constants/roles";
import ProtectedRoutes from "./ProtectedRoutes";
import Layout from "../src/components/Layout";
import Login from "../src/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "../src/pages/Dashboard";
import Solicitudes from "../src/pages/RequestsManagement";
import InventarioGenerico from "../src/pages/GenericInventory";
import Movimientos from "../src/pages/Movements"
import Usuarios from "../src/pages/UsersManagement";
import RequestsLayout from "@/components/requestsComponents/RequestsLayout";
import MyRequests from "@/pages/MyRequests";
import RequestEquipment from "@/components/requestsComponents/RequestEquipment";
import RequestMaterial from "@/components/requestsComponents/RequestMaterial";
import RequestSupport from "@/components/requestsComponents/RequestSupport";

export default function AppRoutes() {
    return (
        <Router>
            <Toaster />
            <Routes>
            	<Route path="/" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                {/* Routes for Authorized Personnel */}
                <Route element={<ProtectedRoutes allowedRoles={[ROLES.ADMIN, ROLES.TECH] } />}>
                    <Route element={<Layout />}>
                        <Route path="/gestion/solicitudes" element={<Solicitudes />} />
                        <Route path="/inventario/:type" element={<InventarioGenerico />} />
                    </Route>
                </Route>

                {/* Routes for Administrators */}
                <Route element={<ProtectedRoutes allowedRoles={[ROLES.ADMIN] } />}>
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/gestion/usuarios" element={<Usuarios />} />
                    </Route>
                </Route>

                {/* Routes for Technicians */}
                <Route element={<ProtectedRoutes allowedRoles={[ROLES.TECH] } />}>
                    <Route element={<Layout />}>
                        <Route path="/movimientos" element={<Movimientos />} />
                    </Route>
                </Route>

                {/* Routes for Users */}
                <Route element={<ProtectedRoutes allowedRoles={[ROLES.USER] } />}>
                    <Route path="/solicitud" element={<RequestsLayout />}>
                        <Route index path="equipo" element={<RequestEquipment />} />
                        <Route path="material" element={<RequestMaterial />} />
                        <Route path="apoyo" element={<RequestSupport />} />
                    </Route>
                    <Route path="/solicitudes" element={<MyRequests />} />
                </Route>
            </Routes>
        </Router>
    );
}
