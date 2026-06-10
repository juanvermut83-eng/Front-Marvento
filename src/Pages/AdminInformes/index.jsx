import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../Context/AppContext'
import { URL } from '../../Urls'
import './styles.css'

const formatPrice = (value) =>
    new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0,
    }).format(value || 0)

const AdminInformes = () => {
    const { userLog } = useContext(AppContext)
    const [pedidos, setPedidos] = useState([])
    const [resumen, setResumen] = useState({
        totalPedidos: 0,
        ventasPagadas: 0,
        ingresoPagado: 0,
    })
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await fetch(`${URL}/pedidos`, {
                    headers: {
                        Authorization: `Bearer ${userLog?.token}`,
                    },
                })
                const data = await response.json().catch(() => ({}))

                if (!response.ok) {
                    throw new Error(data.message || 'No se pudieron obtener los informes')
                }

                setPedidos(data.pedidos || [])
                setResumen(data.resumen || {
                    totalPedidos: 0,
                    ventasPagadas: 0,
                    ingresoPagado: 0,
                })
            } catch (requestError) {
                setError(requestError.message || 'No se pudieron obtener los informes')
            }
        }

        if (userLog?.token) {
            fetchPedidos()
        }
    }, [userLog?.token])

    return (
        <section className="admin-page">
            <header className="admin-page__header">
                <span>Gestion</span>
                <h1>Informes</h1>
                <p>Resumen operativo para revisar ventas realizadas y evolucion comercial.</p>
            </header>

            <div className="admin-page__grid">
                <article className="admin-page__panel">
                    <span className="admin-page__metric-label">Pedidos registrados</span>
                    <strong>{resumen.totalPedidos}</strong>
                    <p>Total de intentos de compra iniciados desde el carrito.</p>
                </article>

                <article className="admin-page__panel">
                    <span className="admin-page__metric-label">Ingreso confirmado</span>
                    <strong>{formatPrice(resumen.ingresoPagado)}</strong>
                    <p>Suma de pedidos con pago confirmado por Mercado Pago.</p>
                </article>

                <article className="admin-page__panel admin-page__panel--wide">
                    <h2>Ventas recientes</h2>
                    {error && <div className="admin-page__empty">{error}</div>}
                    {!error && !pedidos.length && (
                        <div className="admin-page__empty">Todavia no hay ventas para mostrar.</div>
                    )}
                    {!error && Boolean(pedidos.length) && (
                        <div className="admin-page__recent-list">
                            {pedidos.slice(0, 5).map((pedido) => (
                                <div className="admin-page__recent-item" key={pedido.id}>
                                    <span>#{String(pedido.numero || '').padStart(4, '0')}</span>
                                    <strong>{pedido.estado}</strong>
                                    <span>{pedido.cliente?.nombre} {pedido.cliente?.apellido}</span>
                                    <span>{formatPrice(pedido.total)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </article>
            </div>
        </section>
    )
}

export default AdminInformes
