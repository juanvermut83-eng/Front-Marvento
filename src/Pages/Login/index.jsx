import { Link } from 'react-router'
import LoginClasico from '../../Components/LoginClasico'
import LoginGoogle from '../../Components/LoginGoogle'
import './styles.css'

const Login = () => {
  return (
    <section className="login-page">
      {/* <div className="login-page__intro">
        <span>Accede a nuestro ecommerce</span>
        <p>
          Inicia sesion para continuar tu compra, consultar tus datos y acceder a una experiencia de compra mas agil.
        </p>
      </div> */}

      <div className="login-card">
        <div className="login-card__header">
          <h2>Iniciar sesion</h2>
          <p>Usa tu email o continua con Google.</p>
        </div>

        <LoginClasico />

        <div className="login-card__divider">
          <span>o</span>
        </div>

        <LoginGoogle />

        <div className="login-card__links">
          <Link to="/registrarse">Registrarse</Link>
        </div>
      </div>
    </section>
  )
}

export default Login
