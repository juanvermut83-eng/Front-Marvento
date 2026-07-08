import { useContext, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { AppContext } from '../../Context/AppContext'
import MenuHamburguesa from '../MenuHamburguesa'
import marventoLogo from '../../assets/logo_alfa.png'
import './style.css'

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Historia', href: '/historia', mobileVisible: true },
  { label: 'Productos', href: '/productos', mobileVisible: true },
  { label: 'Puntos de venta', href: '/puntos-de-venta', mobileVisible: true },
  { label: 'Casa Talina', href: '/casa-talina' },
  { label: 'Contacto', href: '/contacto' },
]

const adminLinks = [
  { label: 'Informes', href: '/admin/informes' },
  { label: 'Pedidos', href: '/admin/pedidos' },
  { label: 'Consultas', href: '/admin/consultas' },
  { label: 'Activar tienda', href: '/admin/activar-tienda' },
  { label: 'Puntos de venta', href: '/admin/puntos-venta' },
  { label: 'Productos', href: '/admin/productos' },
]

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const navigate = useNavigate()
  const { userLog, cartItems, logout, configuracionTienda } = useContext(AppContext)
  const puedeAdministrar = userLog?.roles?.some((rol) => ['ADMIN', 'EMPLEADO'].includes(rol))
  const mostrarCarrito = !puedeAdministrar && configuracionTienda.carritoActivo
  const cantidadCarrito = cartItems?.reduce((total, item) => total + Number(item.cantidad || 0), 0) || 0

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const openLogoutModal = () => {
    closeMenu()
    setIsLogoutOpen(true)
  }

  const closeLogoutModal = () => {
    setIsLogoutOpen(false)
  }

  const handleLogout = () => {
    logout()
    setIsLogoutOpen(false)
    navigate('/')
  }

  return (
    <>
      <header className="navbar">
        <div className="navbar__top">
          <Link className="navbar__brand" to="/" onClick={closeMenu}>
            <img src={marventoLogo} alt="Marvento" />
          </Link>
        </div>

        <div className="navbar__bar">
          <div className="navbar__menu-action">
            <MenuHamburguesa isOpen={isMenuOpen} onClick={toggleMenu} />
          </div>

          <nav className="navbar__mobile-links" aria-label="Navegacion principal mobile">
            {navLinks.filter((link) => link.mobileVisible).map((link) => (
              <NavLink
                className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
                to={link.href}
                key={`mobile-${link.label}-${link.href}`}
                onClick={closeMenu}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <nav className={`navbar__nav ${isMenuOpen ? ' navbar__nav--open' : ''}`}>
            {navLinks.map((link) => (
              <NavLink
                className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
                to={link.href}
                end={link.href === '/'}
                key={`${link.label}-${link.href}`}
                onClick={closeMenu}
              >
                {link.label}
              </NavLink>
            ))}

            {puedeAdministrar && (
              <div className="navbar__admin">
                <span className="navbar__admin-label">Admin</span>
                <div className="navbar__admin-menu">
                  {adminLinks.map((link) => (
                    <Link className="navbar__admin-link" to={link.href} key={link.href} onClick={closeMenu}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </nav>

          <div className="navbar__actions">
            {mostrarCarrito && (
              <Link className="navbar__cart" to="/carrito" aria-label="Carrito" onClick={closeMenu}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="9" cy="20" r="1.7" />
                  <circle cx="18" cy="20" r="1.7" />
                  <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.5L21 8H7" />
                </svg>
                {cantidadCarrito > 0 && <span className="navbar__cart-count">{cantidadCarrito}</span>}
              </Link>
            )}

            {userLog ? (
              <button className="navbar__logout" type="button" aria-label="Cerrar sesion" onClick={openLogoutModal}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M10 6V4h9v16h-9v-2" />
                  <path d="M15 12H3" />
                  <path d="m7 8-4 4 4 4" />
                </svg>
              </button>
            ) : (
              <Link className="navbar__login" to="/login" aria-label="Login" onClick={closeMenu}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21a8 8 0 0 1 16 0" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </header>

      {isLogoutOpen && (
        <div className="logout-modal" role="dialog" aria-modal="true" aria-labelledby="logout-title">
          <button className="logout-modal__backdrop" type="button" aria-label="Cancelar cierre de sesion" onClick={closeLogoutModal} />
          <div className="logout-modal__panel">
            <h2 id="logout-title">Cerrar sesion</h2>
            <p>Vas a salir de tu cuenta en este dispositivo.</p>
            <div className="logout-modal__actions">
              <button type="button" onClick={closeLogoutModal}>Cancelar</button>
              <button type="button" onClick={handleLogout}>Cerrar sesion</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
