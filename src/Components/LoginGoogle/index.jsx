import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { URL } from '../../Urls'

const googleScriptUrl = 'https://accounts.google.com/gsi/client'

const LoginGoogle = () => {
    const buttonRef = useRef(null)
    const navigate = useNavigate()
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    const [message, setMessage] = useState(
        clientId ? '' : 'Falta configurar VITE_GOOGLE_CLIENT_ID en el front.'
    )

    useEffect(() => {
        if (!clientId) {
            return
        }

        let scriptElement = null

        const initializeGoogle = () => {
            const googleClient = window.google?.accounts?.id

            if (!buttonRef.current) return

            if (!googleClient) {
                setMessage('No se pudo inicializar Google Login.')
                return
            }

            googleClient.initialize({
                client_id: clientId,
                callback: async ({ credential }) => {
                    try {
                        setMessage('')
                        const response = await fetch(`${URL}/auth/login/google`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ credential }),
                        })

                        const result = await response.json()

                        if (!response.ok) {
                            setMessage(result.message || 'No se pudo ingresar con Google.')
                            return
                        }

                        localStorage.setItem('userData', JSON.stringify(result.user))
                        window.dispatchEvent(
                            new CustomEvent('userChanged', { detail: result.user })
                        )
                        navigate('/')
                    } catch (error) {
                        console.error('Error Google login:', error)
                        setMessage('Error de conexion con el servidor.')
                    }
                },
            })

            buttonRef.current.innerHTML = ''
            googleClient.renderButton(buttonRef.current, {
                theme: 'outline',
                size: 'large',
                width: 320,
                text: 'continue_with',
                shape: 'pill',
            })
        }

        const existingScript = document.querySelector(`script[src="${googleScriptUrl}"]`)

        if (existingScript) {
            if (window.google?.accounts?.id) {
                initializeGoogle()
            } else {
                existingScript.addEventListener('load', initializeGoogle, { once: true })
                existingScript.addEventListener('error', () => setMessage('No se pudo cargar Google Login.'), { once: true })
            }
            return () => existingScript.removeEventListener('load', initializeGoogle)
        }

        const script = document.createElement('script')
        scriptElement = script
        script.src = googleScriptUrl
        script.async = true
        script.defer = true
        script.onload = initializeGoogle
        script.onerror = () => setMessage('No se pudo cargar Google Login.')
        document.body.appendChild(script)

        return () => scriptElement?.removeEventListener('load', initializeGoogle)
    }, [clientId, navigate])

    return (
        <div className="login-google">
            <div id="google" ref={buttonRef} />
            {!clientId && (
                <button className="login-google__fallback" type="button" disabled>
                    Entrar con Google
                </button>
            )}
            {message && <p className="login-google__message">{message}</p>}
        </div>
    )
}

export default LoginGoogle
