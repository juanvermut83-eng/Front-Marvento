import { Link } from 'react-router'
import './styles.css'

const RegistrarsePage = () => {
  return (
    <section className="register-page">
      <div className="register-page__content">
        <span>Crear cuenta</span>
        <h1>Registro de cliente</h1>
        <p>
          Este acceso queda preparado para el registro de clientes. El formulario completo se puede
          conectar al checkout cuando definamos los datos necesarios para la compra.
        </p>
        <div className="register-page__actions">
          <Link to="/login">Ya tengo cuenta</Link>
          <Link to="/">Volver al inicio</Link>
        </div>
      </div>
    </section>
  )
}

export default RegistrarsePage
