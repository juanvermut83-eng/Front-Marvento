import { useState } from 'react'
import { URL } from '../../Urls'
import './styles.css'

const initialForm = {
  nombre: '',
  email: '',
  telefono: '',
  motivo: 'compra',
  mensaje: '',
}

const contactChannels = [
  {
    title: 'WhatsApp',
    text: '+54 9 2234553310',
    action: 'Escribir ahora',
    href: 'https://wa.me/5492234553310',
  },
  {
    title: 'Instagram',
    text: '@marventovermut',
    action: 'Ver perfil',
    href: 'https://www.instagram.com/marventovermut/',
  },
  {
    title: 'Email',
    text: 'info@marvento.com.ar',
    action: 'Enviar mail',
    href: 'mailto:info@marvento.com.ar',
  },
]

const Contacto = () => {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSending, setIsSending] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ type: '', message: '' })

    try {
      setIsSending(true)
      const response = await fetch(`${URL}/consultas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.message || 'No se pudo enviar la consulta')
      }

      setForm(initialForm)
      setStatus({ type: 'success', message: 'Consulta enviada. Te vamos a responder a la brevedad.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'No se pudo enviar la consulta' })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section className="contact-page">
      <div className="contact-hero">
        <div className="contact-hero__copy">
          <span>Contacto</span>
          <h1>Hablemos de vermut</h1>
          <p>
            Envianos tu consulta y a la brevedad nos pondremos en contacto. Tambien podes escribirnos
            por canales directos.
          </p>
        </div>
      </div>

      <div className="contact-layout">
        <section className="contact-main">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form__header">
              <span>Consulta</span>
              <h2>Dejanos tu mensaje</h2>
            </div>

            <label className="contact-field">
              <span>Nombre</span>
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
            </label>

            <div className="contact-form__row">
              <label className="contact-field">
                <span>Email</span>
                <input type="email" name="email" value={form.email} onChange={handleChange} />
              </label>

              <label className="contact-field">
                <span>Telefono</span>
                <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} />
              </label>
            </div>

            <label className="contact-field">
              <span>Motivo</span>
              <select name="motivo" value={form.motivo} onChange={handleChange}>
                <option value="compra">Compra online</option>
                <option value="mayorista">Venta mayorista</option>
                <option value="evento">Eventos</option>
                <option value="puntos-de-venta">Puntos de venta</option>
                <option value="otro">Otro</option>
              </select>
            </label>

            <label className="contact-field">
              <span>Mensaje</span>
              <textarea name="mensaje" rows="6" value={form.mensaje} onChange={handleChange} required />
            </label>

            {status.message && (
              <p className={`contact-form__status contact-form__status--${status.type}`}>{status.message}</p>
            )}

            <button className="contact-form__submit" type="submit" disabled={isSending}>
              {isSending ? 'Enviando...' : 'Enviar consulta'}
            </button>
          </form>

          <section className="contact-map" aria-label="Ubicacion de fabrica Marvento">
            <iframe
              title="Fabrica Marvento - Bolivar 6171"
              src="https://www.google.com/maps?q=Bolivar%206171%2C%20Mar%20del%20Plata%2C%20Buenos%20Aires%2C%20Argentina&z=16&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="contact-map__info">
              <span>Fabrica Marvento</span>
              <strong>Bolivar 6171</strong>
              <p>Mar del Plata, Buenos Aires</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Bolivar+6171+Mar+del+Plata"
                target="_blank"
                rel="noreferrer"
              >
                Abrir en Google Maps
              </a>
            </div>
          </section>
        </section>

        <aside className="contact-panel" aria-label="Canales de contacto">
          <section className="contact-panel__section">
            <h2>Canales directos</h2>
            <div className="contact-cards">
              {contactChannels.map((channel) => (
                <a className="contact-card" href={channel.href} key={channel.title} target="_blank" rel="noreferrer">
                  <strong>{channel.title}</strong>
                  <span>{channel.text}</span>
                  <small>{channel.action}</small>
                </a>
              ))}
            </div>
          </section>

          <section className="contact-panel__info">
            <h3>Atencion</h3>
            <p>Lunes a viernes de 10 a 18 hs.</p>
            <p>Retiros y visitas con coordinacion previa.</p>
          </section>
        </aside>
      </div>
    </section>
  )
}

export default Contacto
