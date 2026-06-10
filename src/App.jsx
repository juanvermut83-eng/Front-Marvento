import { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import { AppContext } from './Context/AppContext'
import Home from './Pages/Home'
import Login from './Pages/Login'
import RegistrarsePage from './Pages/Registrarse'
import Contacto from './Pages/Contacto'
import QuienesSomos from './Pages/QuienesSomos'
import Vermuts from './Pages/Vermuts'
import CarritoPage from './Pages/Carrito'
import CheckoutResultado from './Pages/CheckoutResultado'
import AdminInformes from './Pages/AdminInformes'
import AdminPedidos from './Pages/AdminPedidos'
import AdminProductoNuevo from './Pages/AdminProductoNuevo'
import './App.css'

const RutaPrivada = ({ children, rolesPermitidos }) => {
  const { isAuthenticated, userLog } = useContext(AppContext)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const tieneRolPermitido = !rolesPermitidos?.length
    || userLog?.roles?.some((rol) => rolesPermitidos.includes(rol))

  return tieneRolPermitido ? children : <Navigate to="/" replace />
}

function App() {

  return (
    <>
      <Navbar />
      <main className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registrarse" element={<RegistrarsePage />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/quienes-somos" element={<QuienesSomos />} />
          <Route path="/productos" element={<Vermuts />} />
          <Route path="/carrito" element={<CarritoPage />} />
          <Route path="/checkout/success" element={<CheckoutResultado status="success" />} />
          <Route path="/checkout/failure" element={<CheckoutResultado status="failure" />} />
          <Route path="/checkout/pending" element={<CheckoutResultado status="pending" />} />
          <Route
            path="/admin/informes"
            element={
              <RutaPrivada rolesPermitidos={['ADMIN', 'EMPLEADO']}>
                <AdminInformes />
              </RutaPrivada>
            }
          />
          <Route
            path="/admin/pedidos"
            element={
              <RutaPrivada rolesPermitidos={['ADMIN', 'EMPLEADO']}>
                <AdminPedidos />
              </RutaPrivada>
            }
          />
          <Route
            path="/admin/productos/nuevo"
            element={
              <RutaPrivada rolesPermitidos={['ADMIN', 'EMPLEADO']}>
                <AdminProductoNuevo />
              </RutaPrivada>
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
