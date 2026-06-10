import './styles.css'

const contactChannels = [
  {
    title: 'WhatsApp',
    text: 'Consultas sobre compras, envios y disponibilidad.',
    action: 'Escribir ahora',
    href: 'https://wa.me/',
  },
  {
    title: 'Instagram',
    text: 'Novedades, lanzamientos y mensajes directos.',
    action: 'Ver perfil',
    href: 'https://www.instagram.com/',
  },
  {
    title: 'Email',
    text: 'Pedidos comerciales, eventos y colaboraciones.',
    action: 'Enviar mail',
    href: 'mailto:hola@marvento.com',
  },
]

const Contacto = () => {
  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <section className="contact-page">
      <div className="contact-hero">
        <div className="contact-hero__copy">
          <span>Contacto</span>
          <h1>Hablemos de vermut</h1>
          <p>
            Estamos para ayudarte con compras online, consultas mayoristas, eventos y puntos de
            venta. Escribinos y respondemos a la brevedad.
          </p>
        </div>

        <div className="contact-hero__badge">
          <strong>Marvento</strong>
          <small>Vermut argentino</small>
        </div>
      </div>

      <div className="contact-layout">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-form__header">
            <h2>Enviar consulta</h2>
            <p>Dejanos tus datos y el motivo del mensaje.</p>
          </div>

          <label className="contact-field">
            <span>Nombre</span>
            <input type="text" name="nombre" placeholder="Tu nombre" autoComplete="name" />
          </label>

          <label className="contact-field">
            <span>Email</span>
            <input type="email" name="email" placeholder="tu@email.com" autoComplete="email" />
          </label>

          <label className="contact-field">
            <span>Motivo</span>
            <select name="motivo" defaultValue="">
              <option value="" disabled>
                Seleccionar
              </option>
              <option value="compra">Compra online</option>
              <option value="mayorista">Venta mayorista</option>
              <option value="evento">Eventos</option>
              <option value="otro">Otro</option>
            </select>
          </label>

          <label className="contact-field">
            <span>Mensaje</span>
            <textarea name="mensaje" rows="5" placeholder="Contanos en que podemos ayudarte" />
          </label>

          <button className="contact-form__submit" type="submit">
            Enviar mensaje
          </button>
        </form>

        <aside className="contact-panel">
          <div className="contact-panel__section">
            <h2>Canales directos</h2>
            <div className="contact-cards">
              {contactChannels.map((channel) => (
                <a className="contact-card" href={channel.href} key={channel.title}>
                  <strong>{channel.title}</strong>
                  <span>{channel.text}</span>
                  <small>{channel.action}</small>
                </a>
              ))}
            </div>
          </div>

          <div className="contact-panel__info">
            <h3>Atencion</h3>
            <p>Lunes a viernes de 10 a 18 hs.</p>
            <p>Envios y retiros coordinados segun zona.</p>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default Contacto
