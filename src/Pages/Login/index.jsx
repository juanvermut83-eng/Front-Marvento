import { Link } from 'react-router'
import LoginClasico from '../../Components/LoginClasico'
import LoginGoogle from '../../Components/LoginGoogle'
import './styles.css'

const Login = () => {
  return (
    <section className="login-page">
      <div className="login-page__intro">
        <span>Acceso privado</span>
        <h1>Ingreso administrativo</h1>
        <p>
          Este acceso queda pensado para administrar productos, pedidos y contenidos del ecommerce.
          El cliente puede comprar y autenticarse mas adelante durante el checkout.
        </p>
      </div>

      <div className="login-card">
        <div className="login-card__header">
          <h2>Iniciar sesion</h2>
          <p>Entrar con email o continuar con Google.</p>
        </div>

        <LoginClasico />

        <div className="login-card__divider">
          <span>o</span>
        </div>

        <LoginGoogle />

        <div className="login-card__links">
          <Link to="/registrarse">Registrarse</Link>
          <Link to="/login#google">Entrar con Google</Link>
        </div>
      </div>
    </section>
  )
}

export default Login
