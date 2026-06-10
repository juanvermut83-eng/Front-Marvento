import './styles.css'

const AdminProductoNuevo = () => {
    return (
        <section className="admin-product-page">
            <header className="admin-product-page__header">
                <span>Catalogo</span>
                <h1>Nuevo producto</h1>
                <p>Alta inicial para cargar un vermut al catalogo. Falta conectar esta pantalla al endpoint de productos.</p>
            </header>

            <form className="admin-product-form">
                <label>
                    Nombre
                    <input type="text" placeholder="Vermut Marvento Rosso" />
                </label>

                <label>
                    Precio
                    <input type="number" min="0" step="1" placeholder="12000" />
                </label>

                <label>
                    Stock inicial
                    <input type="number" min="0" step="1" placeholder="24" />
                </label>

                <label className="admin-product-form__wide">
                    Descripcion
                    <textarea rows="5" placeholder="Notas de sabor, presentacion y detalles comerciales." />
                </label>

                <div className="admin-product-form__actions">
                    <button type="button">Guardar borrador</button>
                    <button type="submit">Publicar producto</button>
                </div>
            </form>
        </section>
    )
}

export default AdminProductoNuevo
