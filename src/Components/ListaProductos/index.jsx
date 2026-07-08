import { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CardProducto from '../CardProducto'
import biancoImage from '../../assets/Botella-Bianco.jpg'
import cajaX6Image from '../../assets/cajax6.png'
import rojoImage from '../../assets/Botella-Rosso.jpg'
import { AppContext } from '../../Context/AppContext'
import { formatProductPrice } from '../../Helpers/productos'
import { getProductos } from '../../Redux/Actions'
import './styles.css'

const ListaProductos = () => {
  const { addToCart, configuracionTienda } = useContext(AppContext)
  const dispatch = useDispatch()
  const productos = useSelector((state) => state.app.productos)
  const [addedProductId, setAddedProductId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const isCajaX6 = (producto) => {
    const text = `${producto?.nombre || ''} ${producto?.tipo || ''} ${producto?.descripcion || ''}`.toLowerCase()

    return text.includes('caja') || text.includes('x6') || text.includes('x 6') || text.includes('pack')
  }

  const getProductImage = (producto) => {
    if (isCajaX6(producto)) {
      return cajaX6Image
    }

    return producto.color === 'white' ? biancoImage : rojoImage
  }

  useEffect(() => {
    const loadProductos = async () => {
      try {
        setError('')
        await dispatch(getProductos())
      } catch (requestError) {
        setError(requestError.message || 'No se pudieron cargar los productos')
      } finally {
        setIsLoading(false)
      }
    }

    loadProductos()
  }, [dispatch])

  const handleAddToCart = (producto) => {
    if (!configuracionTienda.carritoActivo) {
      return
    }

    if (producto.stock <= 0) {
      return
    }

    addToCart({
      id: producto.id,
      nombre: producto.nombre,
      tipo: producto.tipo,
      precio: formatProductPrice(producto.precioUnitario),
      precioUnitario: producto.precioUnitario,
      color: producto.color,
      stock: producto.stock,
      image: getProductImage(producto),
    })
    setAddedProductId(producto.id)
    window.setTimeout(() => setAddedProductId(''), 1200)
  }

  return (
    <section className="product-list">
      {isLoading && <div className="product-list__state">Cargando productos...</div>}
      {error && <div className="product-list__state product-list__state--error">{error}</div>}
      <div className="product-list__items">
        {productos.map((producto) => (
          <CardProducto
            key={producto.id}
            producto={producto}
            image={getProductImage(producto)}
            onAdd={handleAddToCart}
            isAdded={addedProductId === producto.id}
            carritoActivo={configuracionTienda.carritoActivo}
          />
        ))}
      </div>
    </section>
  )
}

export default ListaProductos
