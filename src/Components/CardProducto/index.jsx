import { formatProductPrice } from '../../Helpers/productos'
import './styles.css'

const getVariantName = (producto) => {
    const text = `${producto?.nombre || ''} ${producto?.tipo || ''} ${producto?.color || ''}`.toLowerCase()

    if (text.includes('bianco') || text.includes('white')) {
        return 'bianco'
    }

    return 'rosso'
}

const isCajaX6 = (producto) => {
    const text = `${producto?.nombre || ''} ${producto?.tipo || ''} ${producto?.descripcion || ''}`.toLowerCase()

    return text.includes('caja') || text.includes('x6') || text.includes('x 6') || text.includes('pack')
}

function CardProducto({ producto, image, onAdd, isAdded, carritoActivo = true }) {
    const variant = getVariantName(producto)
    const isBox = isCajaX6(producto)
    const label = variant === 'bianco' ? 'BIANCO' : 'ROSSO'
    const price = formatProductPrice(producto?.precioUnitario)
    const unitPrice = isBox ? formatProductPrice(Number(producto?.precioUnitario || 0) / 6) : ''
    const savingPercent = Number(producto?.ahorroPorcentaje ?? 10)
    const hasStock = Number(producto?.stock || 0) > 0

    return (
        <article className={`card-producto card-producto--${variant}${isBox ? ' card-producto--box' : ''}`}>
            <div className="card-producto__top">
                <span>{label}</span>
                {isBox && <strong>CAJA X6</strong>}
            </div>

            <div className="card-producto__image">
                <img src={image} alt={producto?.nombre || `Marvento ${label}`} />
            </div>

            <div className="card-producto__info">
                <div className="card-producto__copy">
                    <h2>{producto?.nombre || `MARVENTO ${label}`}</h2>
                    {isBox ? (
                        <div className="card-producto__deal">
                            <span>AHORRO {savingPercent}%</span>
                            <p>CAJA X6</p>
                            <strong>{price}.-</strong>
                            <small>{unitPrice} por botella</small>
                        </div>
                    ) : (
                        <p className="card-producto__unit-price">
                            PRECIO UNIDAD: <strong>{price}.-</strong>
                        </p>
                    )}
                </div>

                {carritoActivo && (
                    <button type="button" onClick={() => onAdd(producto)} disabled={!hasStock}>
                        {!hasStock ? 'SIN STOCK' : isAdded ? 'AGREGADO' : 'AGREGAR'}
                    </button>
                )}
            </div>
        </article>
    )
}

export default CardProducto
