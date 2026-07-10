import { useContext, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { useDispatch } from 'react-redux'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import { AppContext } from './Context/AppContext'
import { getProductos } from './Redux/Actions'
import Home from './Pages/Home'
import Historia from './Pages/Historia'
import Login from './Pages/Login'
import RegistrarsePage from './Pages/Registrarse'
import Contacto from './Pages/Contacto'
import PuntosDeVenta from './Pages/PuntosDeVenta'
import CasaTalina from './Pages/CasaTalina'
import Vermuts from './Pages/Vermuts'
import CarritoPage from './Pages/Carrito'
import CheckoutResultado from './Pages/CheckoutResultado'
import AdminInformes from './Pages/AdminInformes'
import AdminConsultas from './Pages/AdminConsultas'
import AdminPuntosVenta from './Pages/AdminPuntosVenta'
import AdminPedidos from './Pages/AdminPedidos'
import AdminProductoNuevo from './Pages/AdminProductoNuevo'
import AdminProductos from './Pages/AdminProductos'
import AdminActivarTienda from './Pages/AdminActivarTienda'
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
  const { configuracionTienda } = useContext(AppContext)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getProductos()).catch(() => {})
  }, [dispatch])

  return (
    <>
      <Navbar />
      <main className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/historia" element={<Historia />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registrarse" element={<RegistrarsePage />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/puntos-de-venta" element={<PuntosDeVenta />} />
          <Route path="/casa-talina" element={<CasaTalina />} />
          <Route path="/productos" element={<Vermuts />} />
          <Route
            path="/carrito"
            element={configuracionTienda.carritoActivo ? <CarritoPage /> : <Navigate to="/" replace />}
          />
          <Route path="/checkout/success" element={<CheckoutResultado status="success" />} />
          <Route path="/checkout/failure" element={<CheckoutResultado status="failure" />} />
          <Route path="/checkout/pending" element={<CheckoutResultado status="pending" />} />
          <Route
            path="/admin/consultas"
            element={
              <RutaPrivada rolesPermitidos={['ADMIN', 'EMPLEADO']}>
                <AdminConsultas />
              </RutaPrivada>
            }
          />
          <Route
            path="/admin/puntos-venta"
            element={
              <RutaPrivada rolesPermitidos={['ADMIN', 'EMPLEADO']}>
                <AdminPuntosVenta />
              </RutaPrivada>
            }
          />
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
            path="/admin/activar-tienda"
            element={
              <RutaPrivada rolesPermitidos={['ADMIN', 'EMPLEADO']}>
                <AdminActivarTienda />
              </RutaPrivada>
            }
          />
          <Route
            path="/admin/productos"
            element={
              <RutaPrivada rolesPermitidos={['ADMIN', 'EMPLEADO']}>
                <AdminProductos />
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



