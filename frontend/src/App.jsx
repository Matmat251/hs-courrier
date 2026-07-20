import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Clientes from './pages/Clientes'
import Paquetes from './pages/Paquetes'
import HojasRuta from './pages/HojasRuta'
import Trazabilidad from './pages/Trazabilidad'
import Escaneo from './pages/Escaneo'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/clientes" element={
            <ProtectedRoute><Clientes /></ProtectedRoute>
          } />
          <Route path="/paquetes" element={
            <ProtectedRoute><Paquetes /></ProtectedRoute>
          } />
          <Route path="/hojas-ruta" element={
            <ProtectedRoute><HojasRuta /></ProtectedRoute>
          } />
          <Route path="/trazabilidad" element={
            <ProtectedRoute><Trazabilidad /></ProtectedRoute>
          } />
          <Route path="/escaneo" element={
            <ProtectedRoute><Escaneo /></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
