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
import ListPet from './pages/ListPet';
import Adoption from './pages/Adoption';

function App() {
  return (
    <Router>
      <AuthProvider>
        <PetProvider>
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

         

          {/* Página no encontrada */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </PetProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
