
import { Link } from 'react-router'
import productImage from '../../assets/vermuts-productos-marvento.png'
import './styles.css'

function Home() {
    return (
        <section className="hero">
            <div className="hero__content">
                <span className="hero__eyebrow">Vermut argentino</span>
                <h1>Marvento Vermut</h1>
                <p>Aperitivos de caracter botanico para una tienda online con presencia propia.</p>
                <div className="hero__actions">
                    <Link to="/productos">Ver tienda</Link>
                    <Link to="/quienes-somos">Conocer marca</Link>
                </div>
            </div>
            <div className="hero__image">
                <img src={productImage} alt="Dos botellas de vermut Marvento en una escena nautica" />
                <div className="hero__tag">
                    <strong>Rojo & Bianco</strong>
                    <span>Edicion costera</span>
                </div>
            </div>
        </section>
    )
}

export default Home;
