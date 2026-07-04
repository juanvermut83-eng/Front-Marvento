import { useState } from 'react'
import { useNavigate } from 'react-router'
import { URL } from '../../Urls'
import './styles.css'

function LoginClasico() {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const validate = () => {
        const validationErrors = {}

        if (!email) {
            validationErrors.email = 'El email es obligatorio'
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            validationErrors.email = 'El email no es valido'
        }

        if (!password) {
            validationErrors.password = 'La contrasena es obligatoria'
        } else if (password.length < 6) {
            validationErrors.password = 'Debe tener al menos 6 caracteres'
        }

        setErrors(validationErrors)
        return Object.keys(validationErrors).length > 0
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setMessage('')
        if (validate()) return

        try {
            setIsLoading(true)
            const response = await fetch(`${URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const result = await response.json()

            if (!response.ok) {
                setMessage(result.message || 'Error en login')
                return
            }

            localStorage.setItem('userData', JSON.stringify(result.user))
            window.dispatchEvent(
                new CustomEvent('userChanged', { detail: result.user })
            )
            navigate('/')
        } catch (error) {
            console.error('Error login:', error)
            setMessage('Error de conexion con el servidor')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="login-container">
            <h2 className="login-title">Iniciar sesion</h2>

            <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <div className="cont-inputPass-Y-btnVer">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={errors.email ? 'input-error' : 'input-pass'}
                            autoComplete="email"
                        />
                        <span className="icon-email" aria-hidden="true">@</span>
                    </div>
                    {errors.email && <p className="error-message">{errors.email}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <div className="cont-inputPass-Y-btnVer">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={errors.password ? 'input-error' : 'input-pass'}
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className="btn-viewPass-login"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Ocultar contrasena' : 'Ver contrasena'}
                        >
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                {showPassword ? (
                                    <>
                                        <path d="M3 3l18 18" />
                                        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                                        <path d="M9.5 5.4A10.8 10.8 0 0 1 12 5c5 0 8.5 4.3 9.7 6a1.8 1.8 0 0 1 0 2c-.5.7-1.4 1.8-2.6 2.8" />
                                        <path d="M6.6 6.7A17.1 17.1 0 0 0 2.3 11a1.8 1.8 0 0 0 0 2c1.2 1.7 4.7 6 9.7 6 1.3 0 2.5-.3 3.6-.8" />
                                    </>
                                ) : (
                                    <>
                                        <path d="M2.3 11a1.8 1.8 0 0 0 0 2c1.2 1.7 4.7 6 9.7 6s8.5-4.3 9.7-6a1.8 1.8 0 0 0 0-2c-1.2-1.7-4.7-6-9.7-6s-8.5 4.3-9.7 6Z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </>
                                )}
                            </svg>
                        </button>
                    </div>
                    {errors.password && <p className="error-message">{errors.password}</p>}
                </div>

                {message && <p className="error-message error-message--center">{message}</p>}

                <button type="submit" className="login-button" disabled={isLoading}>
                    {isLoading ? 'Ingresando...' : 'Login'}
                </button>
            </form>

            <p className="p-login">Olvidaste tu contrasena o email?</p>

            <button
                type="button"
                className="register-button-login"
                onClick={() => setMessage('Solicita a un administrador el reseteo de tu contrasena.')}
            >
                Recuperar contrasena
            </button>
        </div>
    )
}

export default LoginClasico
