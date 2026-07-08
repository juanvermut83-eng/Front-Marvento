import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'
import {
    crearProducto,
    eliminarProducto,
    getProductosAdmin,
    modificarProducto,
} from '../../Redux/Actions'
import { createProductId, formatProductPrice } from '../../Helpers/productos'
import './styles.css'

const emptyForm = {
    id: '',
    nombre: '',
    tipo: '',
    descripcion: '',
    notas: '',
    precioUnitario: '',
    stock: '',
    color: 'red',
    activo: true,
}

const normalizeForm = (formData) => ({
    id: formData.id || createProductId(formData.nombre),
    nombre: String(formData.nombre || '').trim(),
    tipo: String(formData.tipo || '').trim(),
    descripcion: String(formData.descripcion || '').trim(),
    notas: String(formData.notas || '')
        .split(',')
        .map((nota) => nota.trim())
        .filter(Boolean),
    precioUnitario: Number(formData.precioUnitario) || 0,
    stock: Math.max(0, Number(formData.stock) || 0),
    color: formData.color || 'red',
    activo: Boolean(formData.activo),
})

const productToForm = (producto) => ({
    ...producto,
    notas: Array.isArray(producto.notas) ? producto.notas.join(', ') : '',
    precioUnitario: String(producto.precioUnitario ?? ''),
    stock: String(producto.stock ?? ''),
})

const AdminProductos = () => {
    const dispatch = useDispatch()
    const productos = useSelector((state) => state.app.productosAdmin)
    const [editingId, setEditingId] = useState('')
    const [formData, setFormData] = useState(emptyForm)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [productToDelete, setProductToDelete] = useState(null)

    const totals = useMemo(() => {
        const activos = productos.filter((producto) => producto.activo !== false)
        const stockTotal = productos.reduce((total, producto) => total + Number(producto.stock || 0), 0)

        return {
            activos: activos.length,
            stockTotal,
            inventario: productos.reduce(
                (total, producto) => total + Number(producto.stock || 0) * Number(producto.precioUnitario || 0),
                0
            ),
        }
    }, [productos])

    const loadProductos = useCallback(async () => {
        try {
            await dispatch(getProductosAdmin())
            setError('')
        } catch (requestError) {
            setError(requestError.message || 'No se pudieron cargar los productos')
        } finally {
            setIsLoading(false)
        }
    }, [dispatch])

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            loadProductos()
        }, 0)

        return () => window.clearTimeout(timeoutId)
    }, [loadProductos])

    const showMessage = (successMessage) => {
        setMessage(successMessage)
        window.setTimeout(() => setMessage(''), 2400)
    }

    const startEdit = (producto) => {
        setEditingId(producto.id)
        setFormData(productToForm(producto))
    }

    const startCreate = () => {
        setEditingId('nuevo')
        setFormData(emptyForm)
    }

    const cancelEdit = () => {
        setEditingId('')
        setFormData(emptyForm)
    }

    const handleChange = (event) => {
        const { name, type, checked, value } = event.target

        setFormData((currentData) => ({
            ...currentData,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const producto = normalizeForm(formData)

        if (!producto.nombre || !producto.tipo || producto.precioUnitario <= 0) {
            setMessage('Completa nombre, tipo y precio para guardar.')
            return
        }

        try {
            setError('')

            if (editingId === 'nuevo') {
                await dispatch(crearProducto(producto))
                showMessage('Producto creado con exito.')
            } else {
                await dispatch(modificarProducto(editingId, producto))
                showMessage('Producto editado con exito.')
            }

            cancelEdit()
            await loadProductos()
        } catch (requestError) {
            setError(requestError.message || 'No se pudo guardar el producto')
        }
    }

    const handleDelete = async (producto) => {
        setProductToDelete(producto)
    }

    const confirmDelete = async () => {
        if (!productToDelete) return

        try {
            setError('')
            await dispatch(eliminarProducto(productToDelete.id))
            showMessage('Producto eliminado con exito.')
            setProductToDelete(null)
            await loadProductos()
        } catch (requestError) {
            setError(requestError.message || 'No se pudo eliminar el producto')
        }
    }

    const cancelDelete = () => {
        setProductToDelete(null)
    }

    const updateStock = async (producto, amount) => {
        try {
            setError('')
            await dispatch(modificarProducto(producto.id, {
                ...producto,
                stock: Math.max(0, Number(producto.stock || 0) + amount),
            }))
            showMessage('Stock actualizado.')
            await loadProductos()
        } catch (requestError) {
            setError(requestError.message || 'No se pudo actualizar el stock')
        }
    }

    const toggleActivo = async (producto) => {
        try {
            setError('')
            await dispatch(modificarProducto(producto.id, {
                ...producto,
                activo: producto.activo === false,
            }))
            showMessage('Estado actualizado.')
            await loadProductos()
        } catch (requestError) {
            setError(requestError.message || 'No se pudo actualizar el estado')
        }
    }

    return (
        <section className="admin-products">
            <header className="admin-products__header">
                <div>
                    <span>Catalogo</span>
                    <h1>Productos</h1>
                    <p>Edita productos, controla stock y define que vermuts quedan visibles en la tienda.</p>
                </div>
                <div className="admin-products__header-actions">
                    <button type="button" onClick={startCreate}>Nuevo producto</button>
                    <Link to="/productos">Ver tienda</Link>
                </div>
            </header>

            <div className="admin-products__metrics">
                <article>
                    <span>Activos</span>
                    <strong>{totals.activos}</strong>
                </article>
                <article>
                    <span>Unidades</span>
                    <strong>{totals.stockTotal}</strong>
                </article>
                <article>
                    <span>Inventario</span>
                    <strong>{formatProductPrice(totals.inventario)}</strong>
                </article>
            </div>

            {message && <div className="admin-products__message">{message}</div>}
            {error && <div className="admin-products__message admin-products__message--error">{error}</div>}
            {productToDelete && (
                <div className="admin-products__confirm" role="alertdialog" aria-modal="false">
                    <div className="admin-products__confirm-panel">
                        <div>
                            <strong>Desea eliminar?</strong>
                            <span>{productToDelete.nombre}</span>
                        </div>
                        <div className="admin-products__confirm-actions">
                            <button type="button" onClick={cancelDelete}>Cancelar</button>
                            <button type="button" onClick={confirmDelete}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            {editingId && (
                <form className="admin-products__form" onSubmit={handleSubmit}>
                    <div className="admin-products__form-title">
                        <h2>{editingId === 'nuevo' ? 'Nuevo producto' : 'Editar producto'}</h2>
                        <button type="button" onClick={cancelEdit}>Cerrar</button>
                    </div>

                    <label>
                        Nombre
                        <input name="nombre" value={formData.nombre} onChange={handleChange} />
                    </label>
                    <label>
                        Tipo
                        <input name="tipo" value={formData.tipo} onChange={handleChange} />
                    </label>
                    <label>
                        Precio
                        <input type="number" min="0" step="1" name="precioUnitario" value={formData.precioUnitario} onChange={handleChange} />
                    </label>
                    <label>
                        Stock
                        <input type="number" min="0" step="1" name="stock" value={formData.stock} onChange={handleChange} />
                    </label>
                    <label>
                        Color
                        <select name="color" value={formData.color} onChange={handleChange}>
                            <option value="red">Rojo</option>
                            <option value="white">Blanco</option>
                        </select>
                    </label>
                    <label className="admin-products__checkbox">
                        <input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} />
                        Visible en tienda
                    </label>
                    <label className="admin-products__wide">
                        Notas
                        <input name="notas" value={formData.notas} onChange={handleChange} placeholder="Ajenjo, Citrus, Salvia" />
                    </label>
                    <label className="admin-products__wide">
                        Descripcion
                        <textarea rows="4" name="descripcion" value={formData.descripcion} onChange={handleChange} />
                    </label>

                    <div className="admin-products__form-actions">
                        <button type="button" onClick={cancelEdit}>Cancelar</button>
                        <button type="submit">Guardar producto</button>
                    </div>
                </form>
            )}

            <div className="admin-products__panel">
                {isLoading && <div className="admin-products__empty">Cargando productos...</div>}
                {!isLoading && !error && !productos.length && (
                    <div className="admin-products__empty">Todavia no hay productos cargados.</div>
                )}
                {!isLoading && Boolean(productos.length) && (
                <div className="admin-products__table-wrap">
                    <table className="admin-products__table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((producto) => (
                                <tr key={producto.id}>
                                    <td>
                                        <strong>{producto.nombre}</strong>
                                        <span>{producto.tipo}</span>
                                    </td>
                                    <td>{formatProductPrice(producto.precioUnitario)}</td>
                                    <td>
                                        <div className="admin-products__stock">
                                            <button type="button" onClick={() => updateStock(producto, -1)} disabled={producto.stock <= 0}>-</button>
                                            <strong>{producto.stock}</strong>
                                            <button type="button" onClick={() => updateStock(producto, 1)}>+</button>
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className={`admin-products__status ${producto.activo === false ? 'admin-products__status--off' : ''}`}
                                            onClick={() => toggleActivo(producto)}
                                        >
                                            {producto.activo === false ? 'Oculto' : 'Visible'}
                                        </button>
                                    </td>
                                    <td>
                                        <div className="admin-products__actions">
                                            <button type="button" onClick={() => startEdit(producto)}>Editar</button>
                                            <button type="button" onClick={() => handleDelete(producto)}>Eliminar</button>
                                        </div>
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

export default AdminProductos
