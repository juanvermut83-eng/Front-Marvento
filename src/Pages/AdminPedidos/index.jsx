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

const formatDate = (value) =>
    value
        ? new Intl.DateTimeFormat('es-AR', {
            dateStyle: 'short',
            timeStyle: 'short',
        }).format(new Date(value))
        : '-'

const AdminPedidos = () => {
    const { userLog } = useContext(AppContext)
    const [pedidos, setPedidos] = useState([])
    const [resumen, setResumen] = useState({
        totalPedidos: 0,
        ventasPagadas: 0,
        ingresoPagado: 0,
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(true)

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
                    throw new Error(data.message || 'No se pudieron obtener los pedidos')
                }

                setPedidos(data.pedidos || [])
                setResumen(data.resumen || {
                    totalPedidos: 0,
                    ventasPagadas: 0,
                    ingresoPagado: 0,
                })
            } catch (requestError) {
                setError(requestError.message || 'No se pudieron obtener los pedidos')
            } finally {
                setIsLoading(false)
            }
        }

        if (userLog?.token) {
            fetchPedidos()
        }
    }, [userLog?.token])

    return (
        <section className="admin-orders">
            <header className="admin-orders__header">
                <span>Gestion</span>
                <h1>Pedidos</h1>
                <p>Seguimiento de compras generadas desde el carrito y sincronizadas con Mercado Pago.</p>
            </header>

            <div className="admin-orders__metrics">
                <article>
                    <span>Pedidos</span>
                    <strong>{resumen.totalPedidos}</strong>
                </article>
                <article>
                    <span>Pagados</span>
                    <strong>{resumen.ventasPagadas}</strong>
                </article>
                <article>
                    <span>Ingreso pagado</span>
                    <strong>{formatPrice(resumen.ingresoPagado)}</strong>
                </article>
            </div>

            <div className="admin-orders__panel">
                {isLoading && <div className="admin-orders__empty">Cargando pedidos...</div>}
                {error && <div className="admin-orders__error">{error}</div>}
                {!isLoading && !error && !pedidos.length && (
                    <div className="admin-orders__empty">Todavia no hay pedidos registrados.</div>
                )}
                {!isLoading && !error && Boolean(pedidos.length) && (
                    <div className="admin-orders__table-wrap">
                        <table className="admin-orders__table">
                            <thead>
                                <tr>
                                    <th>Pedido</th>
                                    <th>Fecha</th>
                                    <th>Cliente</th>
                                    <th>Estado</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Pago</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.map((pedido) => (
                                    <tr key={pedido.id}>
                                        <td>#{String(pedido.numero || '').padStart(4, '0')}</td>
                                        <td>{formatDate(pedido.createdAt)}</td>
                                        <td>
                                            <strong>{pedido.cliente?.nombre} {pedido.cliente?.apellido}</strong>
                                            <span>{pedido.cliente?.email}</span>
                                            <span>{pedido.cliente?.telefono}</span>
                                        </td>
                                        <td>
                                            <span className={`admin-orders__status admin-orders__status--${String(pedido.estado).toLowerCase()}`}>
                                                {pedido.estado}
                                            </span>
                                        </td>
                                        <td>
                                            {pedido.items?.map((item) => (
                                                <span key={item.productoId}>{item.nombre} x{item.cantidad}</span>
                                            ))}
                                        </td>
                                        <td>{formatPrice(pedido.total)}</td>
                                        <td>
                                            <span>{pedido.mercadoPago?.paymentId || 'Sin pago'}</span>
                                            <span>{pedido.mercadoPago?.status || '-'}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    )
}

export default AdminPedidos
