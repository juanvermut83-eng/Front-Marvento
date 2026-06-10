import { useContext, useState } from 'react'
import { Link } from 'react-router'
import { AppContext } from '../../Context/AppContext'
import MenuHamburguesa from '../MenuHamburguesa'
import './style.css'

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Vermuts', href: '/productos' },
  { label: 'Quienes Somos', href: '/quienes-somos' },
  { label: 'Contacto', href: '/contacto' },
]

const adminLinks = [
  { label: 'Informes', href: '/admin/informes' },
  { label: 'Pedidos', href: '/admin/pedidos' },
  { label: 'Nuevo producto', href: '/admin/productos/nuevo' },
]

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/marventovermut/',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17" cy="7" r="1" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 8.2V6.8c0-.9.6-1.4 1.5-1.4H17V3h-2.2C12.4 3 11 4.5 11 6.7v1.5H9v2.6h2V21h3v-10.2h2.4l.4-2.6H14Z" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.1 4a7.8 7.8 0 0 0-6.7 11.8L4.5 20l4.3-.9A7.8 7.8 0 1 0 12.1 4Z" />
        <path d="M9.6 8.2c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.3 0 1.4 1 2.7 1.1 2.9.2.2 2 3 4.8 4.1 2.4.9 2.9.7 3.4.7.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.2-.2-.5-.4l-1.8-.9c-.3-.1-.5-.2-.7.2-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.4-2.2-1.3-.8-.7-1.4-1.6-1.6-1.9-.1-.3 0-.4.2-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.6l-.9-1.8Z" />
      </svg>
    ),
  },
]

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const { cartItems, isAuthenticated, logout, nombreUser, userLog } = useContext(AppContext)
  const displayName = nombreUser || userLog?.nombre || userLog?.email || ''
  const puedeAdministrar = userLog?.roles?.some((rol) => ['ADMIN', 'EMPLEADO'].includes(rol))
  const cartCount = cartItems.reduce((total, item) => total + item.cantidad, 0)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    setIsLogoutOpen(false)
    closeMenu()
  }

  return (
    <>
      <header className="navbar">
        <Link className="navbar__brand" to="/" onClick={closeMenu}>
          Marvento
        </Link>

        <nav className={`navbar__nav ${isMenuOpen ? 'navbar__nav--open' : ''}`}>
          {navLinks.map((link) => (
            <Link className="navbar__link" to={link.href} key={link.href} onClick={closeMenu}>
              {link.label}
            </Link>
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
          {isAuthenticated && displayName && (
            <span className="navbar__greeting">Hola, {displayName}</span>
          )}

          <div className="navbar__social">
            {socialLinks.map((link) => (
              <a
                className="navbar__icon-link"
                href={link.href}
                key={link.label}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>

          <Link className="navbar__cart" to="/carrito" onClick={closeMenu} aria-label="Carrito">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.4 6H21l-1.7 8.3a2 2 0 0 1-2 1.7H9a2 2 0 0 1-2-1.6L5.2 3.8H3" />
              <circle cx="9.5" cy="20" r="1.2" />
              <circle cx="17.5" cy="20" r="1.2" />
            </svg>
            <span className="navbar__cart-count">{cartCount}</span>
          </Link>

          {isAuthenticated ? (
            <button className="navbar__login" type="button" onClick={() => setIsLogoutOpen(true)} aria-label="Salir">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
            </button>
          ) : (
            <Link className="navbar__login" to="/login" onClick={closeMenu} aria-label="Login">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
              </svg>
            </Link>
          )}

          <MenuHamburguesa isOpen={isMenuOpen} onClick={toggleMenu} />
        </div>
      </header>

      {isLogoutOpen && (
        <div className="logout-modal" role="dialog" aria-modal="true" aria-labelledby="logout-title">
          <div className="logout-modal__panel">
            <h2 id="logout-title">Cerrar sesion</h2>
            <p>Desea salir de su cuenta?</p>
            <div className="logout-modal__actions">
              <button type="button" onClick={() => setIsLogoutOpen(false)}>
                Cancelar
              </button>
              <button type="button" onClick={handleLogout}>
                Salir
              </button>
            </div>
          </div>
          <button
            className="logout-modal__backdrop"
            type="button"
            onClick={() => setIsLogoutOpen(false)}
            aria-label="Cancelar cierre de sesion"
          />
        </div>
      )}
    </>
  )
}

export default Navbar
