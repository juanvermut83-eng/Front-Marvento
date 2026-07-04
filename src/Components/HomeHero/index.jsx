import heroImage from '../../assets/marvento-hero-nautico.jpg';
import heroMobileImage from '../../assets/HomeHeroResponsive.png';
import './styles.css';

function HomeHero() {
    return (
        <section className="hero">
            <picture className="hero__picture">
                <source media="(max-width: 760px)" srcSet={heroMobileImage} />
                <img className="hero__image" src={heroImage} alt="Marvento Vermut" />
            </picture>
            {/*
                    <div className="hero__content">
                        <span className="hero__eyebrow">Casa Talina presenta</span>
                        <h1>Marvento Vermut</h1>
                        <p>Aperitivo argentino inspirado en puerto, madera, mapas y sobremesas con espiritu de viaje.</p>
                        <div className="hero__actions">
                            <Link to="/productos">Comprar vermut</Link>
                            <Link to="/quienes-somos">Conocer marca</Link>
                        </div>
                    </div>
                    <div className="hero__tag" aria-label="Linea de productos">
                        <strong>Rojo & Bianco</strong>
                        <span>750 ml · 15% vol.</span>
                    </div>
                    */}
        </section>
    )
}

export default HomeHero
