import { useContext, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { AppContext } from '../../Context/AppContext'
import { URL } from '../../Urls'
import './styles.css'

const statusConfig = {
    success: {
        eyebrow: 'Pago aprobado',
        title: 'Compra recibida',
        message: 'Registramos tu pedido. Te contactaremos para coordinar el envio.',
    },
    failure: {
        eyebrow: 'Pago no completado',
        title: 'No pudimos confirmar el pago',
        message: 'El pedido quedo registrado como fallido. Podes volver al carrito e intentar nuevamente.',
    },
    pending: {
        eyebrow: 'Pago pendiente',
        title: 'Tu pago esta pendiente',
        message: 'Mercado Pago todavia esta procesando la operacion. Te avisaremos cuando se confirme.',
    },
}

const formatPrice = (value) =>
    new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0,
    }).format(value || 0)

const CheckoutResultado = ({ status }) => {
    const { clearCart, configuracionTienda } = useContext(AppContext)
    const [searchParams] = useSearchParams()
    const [pedido, setPedido] = useState(null)
    const [error, setError] = useState('')
    const didClearCart = useRef(false)
    const config = statusConfig[status] || statusConfig.pending
    const pedidoId = searchParams.get('pedido')

    useEffect(() => {
        if (status === 'success' && !didClearCart.current) {
            didClearCart.current = true
            clearCart()
        }
    }, [status, clearCart])

    useEffect(() => {
        const registrarRetorno = async () => {
            if (!pedidoId) {
                return
            }

            try {
                await fetch(`${URL}/mercadopago/pedidos/${pedidoId}/retorno`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        checkoutStatus: status,
                        payment_id: searchParams.get('payment_id'),
                        status: searchParams.get('status'),
                        merchant_order_id: searchParams.get('merchant_order_id'),
                        preference_id: searchParams.get('preference_id'),
                    }),
                })

                const response = await fetch(`${URL}/pedidos/${pedidoId}/publico`)
                const data = await response.json().catch(() => ({}))

                if (!response.ok) {
                    throw new Error(data.message || 'No se pudo obtener el pedido')
                }

                setPedido(data)
            } catch (requestError) {
                setError(requestError.message || 'No se pudo consultar el pedido')
            }
        }

        registrarRetorno()
    }, [pedidoId, searchParams, status])

    return (
        <section className="checkout-result">
            <div className="checkout-result__panel">
                <span>{config.eyebrow}</span>
                <h1>{config.title}</h1>
                <p>{config.message}</p>

                {pedido && (
                    <div className="checkout-result__summary">
                        <div>
                            <span>Pedido</span>
                            <strong>#{String(pedido.numero || '').padStart(4, '0')}</strong>
                        </div>
                        <div>
                            <span>Estado</span>
                            <strong>{pedido.estado}</strong>
                        </div>
                        <div>
                            <span>Total</span>
                            <strong>{formatPrice(pedido.total)}</strong>
                        </div>
                    </div>
                )}

                {error && <div className="checkout-result__error">{error}</div>}

                <div className="checkout-result__actions">
                    {status === 'failure' && configuracionTienda.carritoActivo && <Link to="/carrito">Volver al carrito</Link>}
                    <Link to="/productos">Seguir viendo productos</Link>
                </div>
            </div>
        </section>
    )
}

export default CheckoutResultado
