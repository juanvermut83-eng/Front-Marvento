import casaTalinaLogo from '../../assets/logo_casa_talina.png'
import marventoLogo from '../../assets/logo_alfa.png'
import './style.css'

const socialLinks = [
  {
    label: '@marventovermut',
    href: 'https://www.instagram.com/marventovermut/',
    icon: 'instagram',
  },
  {
    label: 'marventovermut',
    href: 'https://www.facebook.com/',
    icon: 'facebook',
  },
  {
    label: '@casatalina',
    href: 'https://www.instagram.com/casatalina/',
    icon: 'instagram',
  },
  {
    label: '+54 9 2234553310',
    href: 'https://wa.me/5492234553310',
    icon: 'whatsapp',
  },
]

const SocialIcon = ({ name }) => {
  if (name === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M15.12 8.08H17V4.9c-.91-.1-1.82-.16-2.73-.17-2.7 0-4.55 1.65-4.55 4.67v2.61H6.67v3.56h3.05v7.7h3.65v-7.7h3.03l.46-3.56h-3.49V9.76c0-1.03.28-1.68 1.75-1.68Z" />
      </svg>
    )
  }

  if (name === 'whatsapp') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M20.1 3.9A11.36 11.36 0 0 0 1.67 16.78L.5 23.5l6.86-1.14A11.36 11.36 0 0 0 20.1 3.9Zm-8.07 17.2a9.2 9.2 0 0 1-4.68-1.28l-.39-.23-4.06.67.69-3.96-.25-.41A9.23 9.23 0 1 1 12.03 21.1Zm5.05-6.9c-.28-.14-1.64-.81-1.9-.9-.25-.1-.44-.14-.62.14-.18.27-.71.9-.87 1.08-.16.18-.32.2-.6.07-.28-.14-1.17-.43-2.23-1.38-.82-.73-1.38-1.64-1.54-1.92-.16-.27-.02-.42.12-.56.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.03-.48-.07-.14-.62-1.5-.85-2.05-.22-.54-.45-.46-.62-.47h-.53c-.18 0-.48.07-.73.34-.25.28-.96.94-.96 2.29 0 1.35.98 2.65 1.12 2.83.14.18 1.93 2.95 4.67 4.14.65.28 1.16.45 1.56.58.66.21 1.25.18 1.72.11.53-.08 1.64-.67 1.87-1.31.23-.64.23-1.2.16-1.31-.07-.12-.25-.19-.53-.33Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5Zm8.8 2.35a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 7.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8Zm0 2a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8Z" />
    </svg>
  )
}

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="footer__inner">
        <section className="footer__column footer__location" aria-label="Casa Talina">
          <img className="footer__location-logo" src={casaTalinaLogo} alt="Casa Talina" />
          <p>
            Bolivar 6171, Mar del Plata
            <br />
            Buenos Aires, Argentina
          </p>
        </section>

        <section className="footer__column footer__social" aria-label="Redes sociales">
          <span className="footer__eyebrow">Contacto</span>
          <div className="footer__social-grid">
            {socialLinks.map((link) => (
              <a href={link.href} target="_blank" rel="noreferrer" key={`${link.icon}-${link.label}`}>
                <span className="footer__icon">
                  <SocialIcon name={link.icon} />
                </span>
                {link.label}
              </a>
            ))}
          </div>
        </section>

        <section className="footer__column footer__payments" aria-label="Medios de pago">
          <span className="footer__eyebrow">Compra</span>
          <p>
            Todos los medios de pago
            <br />
            Compra segura
          </p>
          <a href="mailto:info@marvento.com.ar">info@marvento.com.ar</a>
        </section>
      </div>

      <div className="footer__brand">
        <img src={marventoLogo} alt="Marvento" />
      </div>
    </footer>
  )
}

export default Footer
