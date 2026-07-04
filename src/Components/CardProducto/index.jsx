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

function CardProducto({ producto, image, onAdd, isAdded }) {
    const variant = getVariantName(producto)
    const isBox = isCajaX6(producto)
    const label = variant === 'bianco' ? 'BIANCO' : 'ROSSO'
    const price = formatProductPrice(producto?.precioUnitario)
    const hasStock = Number(producto?.stock || 0) > 0

    return (
        <article className={`card-producto card-producto--${variant}${isBox ? ' card-producto--box' : ''}`}>
            <div className="card-producto__top">
                <span>{label}</span>
            </div>

            <div className="card-producto__image">
                <img src={image} alt={producto?.nombre || `Marvento ${label}`} />
            </div>

            <div className="card-producto__info">
                <div>
                    <h2>{producto?.nombre || `MARVENTO ${label}`}</h2>
                    <p>{isBox ? 'PRECIO CAJA X6' : 'PRECIO UNIDAD'}: {price}.-</p>
                </div>

                <button type="button" onClick={() => onAdd(producto)} disabled={!hasStock}>
                    {!hasStock ? 'SIN STOCK' : isAdded ? 'AGREGADO' : 'AGREGAR'}
                </button>
            </div>
        </article>
    )
}

export default CardProducto
