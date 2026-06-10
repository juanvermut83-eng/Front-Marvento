import { useContext, useState } from 'react'
import { Link } from 'react-router'
import { AppContext } from '../../Context/AppContext'
import { URL } from '../../Urls'
import './styles.css'

const formatPrice = (value) =>
    new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0,
    }).format(value)

const CarritoPage = () => {
    const {
        cartItems,
        clearCart,
        removeFromCart,
        updateCartItemQuantity,
        userLog,
    } = useContext(AppContext)
    const [checkoutError, setCheckoutError] = useState('')
    const [isCheckingOut, setIsCheckingOut] = useState(false)
    const [checkoutData, setCheckoutData] = useState({
        nombre: userLog?.nombre || '',
        apellido: userLog?.apellido || '',
        email: userLog?.email || '',
        telefono: typeof userLog?.telefono === 'string'
            ? userLog.telefono
            : [userLog?.telefono?.area, userLog?.telefono?.numero || userLog?.telefono?.telefono].filter(Boolean).join(' '),
        direccion: typeof userLog?.direccion === 'string' ? userLog.direccion : userLog?.direccion?.calle || '',
        localidad: userLog?.direccion?.localidad || '',
        provincia: userLog?.direccion?.provincia || '',
        codigoPostal: userLog?.direccion?.codigoPostal || '',
        notas: '',
    })

    const cantidadTotal = cartItems.reduce((total, item) => total + item.cantidad, 0)
    const subtotal = cartItems.reduce(
        (total, item) => total + item.precioUnitario * item.cantidad,
        0
    )

    const handleCheckoutDataChange = (event) => {
        const { name, value } = event.target
        setCheckoutData((currentData) => ({
            ...currentData,
            [name]: value,
        }))
    }

    const handleFinalizarCompra = async () => {
        setCheckoutError('')
        setIsCheckingOut(true)

        try {
            const camposObligatorios = ['nombre', 'apellido', 'email', 'telefono', 'direccion', 'localidad', 'provincia']
            const faltaCampo = camposObligatorios.some((campo) => !String(checkoutData[campo] || '').trim())

            if (faltaCampo) {
                throw new Error('Completa los datos de contacto y envio para continuar')
            }

            const response = await fetch(`${URL}/mercadopago/preferencia`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: cartItems.map((item) => ({
                        id: item.id,
                        cantidad: item.cantidad,
                    })),
                    payer: {
                        nombre: checkoutData.nombre,
                        apellido: checkoutData.apellido,
                        email: checkoutData.email,
                        telefono: checkoutData.telefono,
                    },
                    envio: {
                        direccion: checkoutData.direccion,
                        localidad: checkoutData.localidad,
                        provincia: checkoutData.provincia,
                        codigoPostal: checkoutData.codigoPostal,
                        notas: checkoutData.notas,
                    },
                }),
            })

            const data = await response.json().catch(() => ({}))

            if (!response.ok) {
                throw new Error(data.message || 'No se pudo iniciar el pago')
            }

            const checkoutUrl = data.checkout_url || data.init_point || data.sandbox_init_point

            if (!checkoutUrl) {
                throw new Error('Mercado Pago no devolvio un enlace de pago')
            }

            window.location.href = checkoutUrl
        } catch (error) {
            setCheckoutError(error.message || 'No se pudo iniciar el pago')
            setIsCheckingOut(false)
        }
    }

    if (!cartItems.length) {
        return (
            <section className="cart-page cart-page--empty">
                <div className="cart-empty">
                    <span>Carrito</span>
                    <h1>Tu carrito esta vacio</h1>
                    <p>Elegi tus vermuts favoritos y volve para revisar el pedido.</p>
                    <Link to="/productos">Ver vermuts</Link>
                </div>
            </section>
        )
    }

    return (
        <section className="cart-page">
            <header className="cart-page__header">
                <div>
                    <span>Carrito</span>
                    <h1>Revisar pedido</h1>
                </div>
                <button type="button" onClick={clearCart}>Vaciar carrito</button>
            </header>

            <div className="cart-page__layout">
                <div className="cart-list">
                    {cartItems.map((item) => (
                        <article className={`cart-item cart-item--${item.color}`} key={item.id}>
                            <div className="cart-item__image" aria-hidden="true">
                                <img src={item.image} alt="" />
                            </div>

                            <div className="cart-item__content">
                                <span>{item.tipo}</span>
                                <h2>{item.nombre}</h2>
                                <strong>{formatPrice(item.precioUnitario)}</strong>
                            </div>

                            <div className="cart-item__quantity" aria-label={`Cantidad de ${item.nombre}`}>
                                <button
                                    type="button"
                                    onClick={() => updateCartItemQuantity(item.id, item.cantidad - 1)}
                                    disabled={item.cantidad <= 1}
                                    aria-label="Restar unidad"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    value={item.cantidad}
                                    onChange={(event) => updateCartItemQuantity(item.id, event.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => updateCartItemQuantity(item.id, item.cantidad + 1)}
                                    aria-label="Sumar unidad"
                                >
                                    +
                                </button>
                            </div>

                            <div className="cart-item__total">
                                <span>Total</span>
                                <strong>{formatPrice(item.precioUnitario * item.cantidad)}</strong>
                                <button type="button" onClick={() => removeFromCart(item.id)}>
                                    Eliminar
                                </button>
                            </div>
                        </article>
                    ))}
                </div>

                <aside className="cart-summary">
                    <h2>Resumen</h2>
                    <form className="cart-checkout-form" onSubmit={(event) => event.preventDefault()}>
                        <h3>Datos de compra</h3>
                        <div className="cart-checkout-form__grid">
                            <label>
                                Nombre
                                <input
                                    name="nombre"
                                    value={checkoutData.nombre}
                                    onChange={handleCheckoutDataChange}
                                    required
                                />
                            </label>
                            <label>
                                Apellido
                                <input
                                    name="apellido"
                                    value={checkoutData.apellido}
                                    onChange={handleCheckoutDataChange}
                                    required
                                />
                            </label>
                        </div>
                        <label>
                            Email
                            <input
                                type="email"
                                name="email"
                                value={checkoutData.email}
                                onChange={handleCheckoutDataChange}
                                required
                            />
                        </label>
                        <label>
                            Telefono
                            <input
                                name="telefono"
                                value={checkoutData.telefono}
                                onChange={handleCheckoutDataChange}
                                required
                            />
                        </label>
                        <label>
                            Direccion
                            <input
                                name="direccion"
                                value={checkoutData.direccion}
                                onChange={handleCheckoutDataChange}
                                required
                            />
                        </label>
                        <div className="cart-checkout-form__grid">
                            <label>
                                Localidad
                                <input
                                    name="localidad"
                                    value={checkoutData.localidad}
                                    onChange={handleCheckoutDataChange}
                                    required
                                />
                            </label>
                            <label>
                                Provincia
                                <input
                                    name="provincia"
                                    value={checkoutData.provincia}
                                    onChange={handleCheckoutDataChange}
                                    required
                                />
                            </label>
                        </div>
                        <label>
                            Codigo postal
                            <input
                                name="codigoPostal"
                                value={checkoutData.codigoPostal}
                                onChange={handleCheckoutDataChange}
                            />
                        </label>
                        <label>
                            Notas
                            <textarea
                                name="notas"
                                value={checkoutData.notas}
                                onChange={handleCheckoutDataChange}
                                rows="3"
                            />
                        </label>
                    </form>
                    <div className="cart-summary__row">
                        <span>Productos</span>
                        <strong>{cantidadTotal}</strong>
                    </div>
                    <div className="cart-summary__row">
                        <span>Subtotal</span>
                        <strong>{formatPrice(subtotal)}</strong>
                    </div>
                    <div className="cart-summary__note">
                        El envio y la disponibilidad se confirman al cerrar la compra.
                    </div>
                    {checkoutError && (
                        <div className="cart-summary__message cart-summary__message--error">
                            {checkoutError}
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={handleFinalizarCompra}
                        disabled={isCheckingOut}
                    >
                        {isCheckingOut ? 'Redirigiendo...' : 'Finalizar compra'}
                    </button>
                    <Link to="/productos">Seguir comprando</Link>
                </aside>
            </div>
        </section>
    )
}

export default CarritoPage
