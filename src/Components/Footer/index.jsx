import { Link } from 'react-router'
import './style.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <section className="footer__brand">
          <Link className="footer__logo" to="/">
            Marvento
          </Link>
          <p>Vermut argentino para sobremesas, encuentros y barras con identidad.</p>
          <div className="footer__social" aria-label="Redes sociales">
            <a href="https://www.instagram.com/marventovermut/" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
              Facebook
            </a>
            <a href="https://wa.me/" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
        </section>

        <div className="footer__content">
          <nav className="footer__group" aria-label="Tienda">
            <h3>Tienda</h3>
            <Link to="/productos">Vermuts</Link>
            <Link to="/carrito">Carrito</Link>
            <Link to="/contacto">Contacto</Link>
          </nav>

          <nav className="footer__group" aria-label="Marca">
            <h3>Marca</h3>
            <Link to="/quienes-somos">Quienes Somos</Link>
            <Link to="/faq">Preguntas frecuentes</Link>
            <Link to="/envios">Envios</Link>
          </nav>

          <address className="footer__group footer__contact">
            <h3>Contacto</h3>
            <a href="mailto:info@marventovermut.com">info@marventovermut.com</a>
            <a href="https://wa.me/" target="_blank" rel="noreferrer">Atencion por WhatsApp</a>
            <span>Argentina</span>
          </address>
        </div>
      </div>

      <div className="footer__bottom">
        <span>Marvento Vermut</span>
        <span>Beber con moderacion. Prohibida su venta a menores de 18 anos.</span>
      </div>
    </footer>
  )
}

export default Footer
