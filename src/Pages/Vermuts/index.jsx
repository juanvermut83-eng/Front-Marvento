import ListaProductos from '../../Components/ListaProductos'
import productImage from '../../assets/vermuts-productos-marvento.png'
import './styles.css'

const Vermuts = () => {
  return (
    <section className="vermuts-page">
      <div className="vermuts-hero">
        <div className="vermuts-hero__copy">
          <span>La coleccion</span>
          <h1>Dos botellas, una ceremonia</h1>
          <p>
            La linea Marvento concentra el universo de la marca en dos perfiles: uno profundo y
            especiado; otro luminoso, fresco y costero.
          </p>
        </div>

        <div className="vermuts-hero__visual">
          <img src={productImage} alt="Dos botellas de vermut Marvento sobre una escena nautica" />
        </div>
      </div>

      <ListaProductos />
    </section>
  )
}

export default Vermuts
