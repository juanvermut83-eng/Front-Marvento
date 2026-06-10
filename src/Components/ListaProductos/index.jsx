import { useContext, useState } from 'react'
import productImage from '../../assets/vermuts-productos-marvento.png'
import { AppContext } from '../../Context/AppContext'
import './styles.css'

const productos = [
  {
    id: 'rojo',
    nombre: 'Marvento Rojo',
    tipo: 'Vermut rosso',
    descripcion:
      'Intenso, especiado y botanico. Pensado para servir con hielo, piel de naranja y soda.',
    notas: ['Ajenjo', 'Cascara citrica', 'Hierbas tostadas'],
    precio: '$ 12.500',
    precioUnitario: 12500,
    color: 'red',
  },
  {
    id: 'bianco',
    nombre: 'Marvento Bianco',
    tipo: 'Vermut blanco seco',
    descripcion:
      'Fresco, herbal y elegante. Ideal para aperitivos largos, tonica y rodaja de limon.',
    notas: ['Flores blancas', 'Citrus', 'Salvia'],
    precio: '$ 12.500',
    precioUnitario: 12500,
    color: 'white',
  },
]

const ListaProductos = () => {
  const { addToCart } = useContext(AppContext)
  const [addedProductId, setAddedProductId] = useState('')

  const handleAddToCart = (producto) => {
    addToCart({
      id: producto.id,
      nombre: producto.nombre,
      tipo: producto.tipo,
      precio: producto.precio,
      precioUnitario: producto.precioUnitario,
      color: producto.color,
      image: productImage,
    })
    setAddedProductId(producto.id)
    window.setTimeout(() => setAddedProductId(''), 1200)
  }

  return (
    <section className="product-list">
      <div className="product-list__items">
        {productos.map((producto) => (
          <article className={`product-card product-card--${producto.color}`} key={producto.id}>
            <div className="product-card__content">
              <div className="product-card__number">{producto.id === 'rojo' ? '01' : '02'}</div>
              <div>
                <span className="product-card__type">{producto.tipo}</span>
                <h2>{producto.nombre}</h2>
                <p>{producto.descripcion}</p>
              </div>

              <ul className="product-card__notes">
                {producto.notas.map((nota) => (
                  <li key={nota}>{nota}</li>
                ))}
              </ul>

              <div className="product-card__footer">
                <strong>{producto.precio}</strong>
                <button type="button" onClick={() => handleAddToCart(producto)}>
                  {addedProductId === producto.id ? 'Agregado' : 'Agregar'}
                </button>
              </div>
            </div>

            <div className="product-card__visual" aria-hidden="true">
              <img src={productImage} alt="" />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ListaProductos
