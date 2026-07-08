import { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actualizarConfiguracionSitio, getConfiguracionSitioAdmin } from '../../Redux/Actions'
import { AppContext } from '../../Context/AppContext'
import './styles.css'

const AdminActivarTienda = () => {
    const dispatch = useDispatch()
    const configuracionSitio = useSelector((state) => state.app.configuracionSitio)
    const { setConfiguracionTienda, refreshConfiguracionTienda } = useContext(AppContext)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const comprasActivas = configuracionSitio.carritoActivo !== false

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const config = await dispatch(getConfiguracionSitioAdmin())
                const normalizedConfig = config.productosVisible === false
                    ? await dispatch(actualizarConfiguracionSitio({
                        ...config,
                        productosVisible: true,
                        carritoActivo: config.carritoActivo !== false,
                    }))
                    : config

                setConfiguracionTienda(normalizedConfig)
                setError('')
            } catch (requestError) {
                setError(requestError.message || 'No se pudo cargar la configuracion')
            } finally {
                setIsLoading(false)
            }
        }

        loadConfig()
    }, [dispatch, setConfiguracionTienda])

    const toggleCompras = async () => {
        const nextConfig = {
            ...configuracionSitio,
            productosVisible: true,
            carritoActivo: !comprasActivas,
        }

        try {
            setIsSaving(true)
            setError('')
            const config = await dispatch(actualizarConfiguracionSitio(nextConfig))
            setConfiguracionTienda(config)
            await refreshConfiguracionTienda()
            setMessage(config.carritoActivo ? 'Compras online activadas.' : 'Compras online desactivadas.')
            window.setTimeout(() => setMessage(''), 2400)
        } catch (requestError) {
            setError(requestError.message || 'No se pudo actualizar la tienda')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <section className="admin-store">
            <header className="admin-store__header">
                <span>Tienda</span>
                <h1>Activar tienda</h1>
                <p>Controla si los clientes pueden comprar online. El catalogo de productos queda visible siempre.</p>
            </header>

            <div className={`admin-store__panel ${comprasActivas ? 'admin-store__panel--on' : ''}`}>
                <div className="admin-store__status">
                    <span>Compras online</span>
                    <strong>{comprasActivas ? 'Activadas' : 'Desactivadas'}</strong>
                    <p>
                        {comprasActivas
                            ? 'Se muestra el carrito y los botones para agregar productos.'
                            : 'Los productos se ven como catalogo, sin carrito ni botones de compra.'}
                    </p>
                </div>

                <button type="button" onClick={toggleCompras} disabled={isLoading || isSaving}>
                    {isSaving
                        ? 'Guardando...'
                        : comprasActivas
                            ? 'Desactivar compras'
                            : 'Activar compras'}
                </button>
            </div>

            {message && <div className="admin-store__message">{message}</div>}
            {error && <div className="admin-store__message admin-store__message--error">{error}</div>}
        </section>
    )
}

export default AdminActivarTienda
