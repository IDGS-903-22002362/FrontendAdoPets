import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import BackendTest from './pages/BackendTest';
import PetProvider from './context/PetContext';
import { ServicesProvider } from './context/ServicesContext';
import ListPet from './pages/ListPet';
import Adoption from './pages/Adoption';
import Empleados from './pages/Empleados';
import Especialidades from './pages/Especialidades';

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

          {/* Rutas Privadas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/ListPet"
            element={
              <PrivateRoute>
                <ListPet />
              </PrivateRoute>
            }
          />

          <Route
          path= "/solicitud- Adopcione"
          element = {
           <PrivateRoute>
            <Adoption/>
           </PrivateRoute> 
          }/>

          <Route
            path="/empleados"
            element={
              <PrivateRoute>
                <Empleados />
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
