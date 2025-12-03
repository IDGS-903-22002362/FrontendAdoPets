import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import RoleGuard from "./components/RoleGuard";
import DashboardLayout from "./components/DashboardLayout";
import { ROLES } from "./config/roles.config";


// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import BackendTest from "./pages/BackendTest";
import PetProvider from "./context/PetContext";
import { ServicesProvider } from "./context/ServicesContext";
import ListPet from "./pages/ListPet";
import Adoption from "./pages/Adoption";
import Empleados from "./pages/Empleados";
import Especialidades from "./pages/Especialidades";
import Schedules from "./pages/Schedules";
import Donaciones from "./pages/Donaciones";
import ServiciosVeterinarios from "./pages/ServiciosVeterinarios";
import CitasVeterinario from "./pages/CitasVeterinario";
import Inventario from "./pages/Inventario";
import Salas from "./pages/Salas";
import ProveedoresPage from "./pages/ProveedoresPage";
import CitasAdmin from "./pages/CitasAdmin";
import PagosAdmin from "./pages/PagosAdmin";
import CobranzaAdmin from "./pages/CobranzaAdmin";
import Expedientes from "./pages/Expedientes";
import Tickets from "./pages/Tickets";

function App() {
  return (
    <Router>
      <AuthProvider>
        <PetProvider>
          <ServicesProvider>
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/backend-test" element={<BackendTest />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              {/* RUTAS PRIVADAS CON LAYOUT */}
              <Route element={<DashboardLayout />}>
                <Route
                  path="/ListPet"
                  element={
                    <PrivateRoute>
                      <ListPet />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/solicitud- Adopcione"
                  element={
                    <PrivateRoute>
                      <Adoption />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/empleados"
                  element={
                    <PrivateRoute>
                      <RoleGuard allowedRoles={[ROLES.ADMIN]}>
                        <Empleados />
                      </RoleGuard>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/proveedores"
                  element={
                    <PrivateRoute>
                      <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.ALMACENISTA]}>
                        <ProveedoresPage />
                      </RoleGuard>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/inventario"
                  element={
                    <PrivateRoute>
                      <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.ALMACENISTA, ROLES.VETERINARIO]}>
                        <Inventario />
                      </RoleGuard>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/especialidades"
                  element={
                    <PrivateRoute>
                      <RoleGuard allowedRoles={[ROLES.ADMIN]}>
                        <Especialidades />
                      </RoleGuard>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/horarios"
                  element={
                    <PrivateRoute>
                      <RoleGuard allowedRoles={[ROLES.ADMIN]}>
                        <Schedules />
                      </RoleGuard>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/donaciones"
                  element={
                    <PrivateRoute>
                      <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.RECEPCIONISTA]}>
                        <Donaciones />
                      </RoleGuard>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/servicios-veterinarios"
                  element={
                    <PrivateRoute>
                      <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.VETERINARIO]}>
                        <ServiciosVeterinarios />
                      </RoleGuard>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/mis-citas"
                  element={
                    <PrivateRoute>
                      <RoleGuard allowedRoles={[ROLES.VETERINARIO]}>
                        <CitasVeterinario />
                      </RoleGuard>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/citas"
                  element={
                    <PrivateRoute>
                      <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.RECEPCIONISTA, ROLES.VETERINARIO]}>
                        <CitasAdmin />
                      </RoleGuard>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/pagos"
                  element={
                    <PrivateRoute>
                      <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.RECEPCIONISTA]}>
                        <PagosAdmin />
                      </RoleGuard>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/cobranza"
                  element={
                    <PrivateRoute>
                      <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.RECEPCIONISTA]}>
                        <CobranzaAdmin />
                      </RoleGuard>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/salas"
                  element={
                    <PrivateRoute>
                      <RoleGuard allowedRoles={[ROLES.ADMIN]}>
                        <Salas />
                      </RoleGuard>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/expedientes"
                  element={
                    <PrivateRoute>
                      <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.VETERINARIO]}>
                        <Expedientes />
                      </RoleGuard>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/tickets"
                  element={
                    <PrivateRoute>
                      <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.VETERINARIO, ROLES.RECEPCIONISTA]}>
                        <Tickets />
                      </RoleGuard>
                    </PrivateRoute>
                  }
                />
              </Route>

              {/* Página no encontrada */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ServicesProvider>
        </PetProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
