import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./components/DashboardLayout";


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
                      <Empleados />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/proveedores"
                  element={
                    <PrivateRoute>
                      <ProveedoresPage />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/inventario"
                  element={
                    <PrivateRoute>
                      <Inventario />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/especialidades"
                  element={
                    <PrivateRoute>
                      <Especialidades />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/horarios"
                  element={
                    <PrivateRoute>
                      <Schedules />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/donaciones"
                  element={
                    <PrivateRoute>
                      <Donaciones />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/servicios-veterinarios"
                  element={
                    <PrivateRoute>
                      <ServiciosVeterinarios />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/citas"
                  element={
                    <PrivateRoute>
                      <CitasAdmin />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/pagos"
                  element={
                    <PrivateRoute>
                      <PagosAdmin />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/cobranza"
                  element={
                    <PrivateRoute>
                      <CobranzaAdmin />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/salas"
                  element={
                    <PrivateRoute>
                      <Salas />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/expedientes"
                  element={
                    <PrivateRoute>
                      <Expedientes />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/tickets"
                  element={
                    <PrivateRoute>
                      <Tickets />
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
