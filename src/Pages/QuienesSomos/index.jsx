import heroImage from '../../assets/quienes-somos-marvento.png'
import './styles.css'

function QuienesSomos() {
    return (
        <section className="about-page">
            <div className="about-hero">
                <div className="about-hero__copy">
                    <span>Quienes Somos</span>
                    <h1>Un vermut con pulso de costa</h1>
                    <p>
                        Marvento nace de una idea simple: llevar el ritual del vermut a una escena
                        mas propia, con botanicos, sobremesa, madera salada y memoria de puerto.
                    </p>
                    <div className="about-hero__actions">
                        <a href="#historia">Nuestra historia</a>
                        <a href="#espiritu">Espiritu marino</a>
                    </div>
                </div>

                <div className="about-hero__visual" aria-label="Botellas de vermut Marvento en una escena maritima">
                    <img src={heroImage} alt="Botellas de vermut sobre un muelle con barcos y mar de fondo" />
                    <div className="about-hero__seal">
                        <strong>Marvento</strong>
                        <small>Aperitivo de autor</small>
                    </div>
                </div>
            </div>

            <div className="about-wave" aria-hidden="true">
                <span />
                <span />
                <span />
            </div>

            <section className="about-story" id="historia">
                <div className="about-story__intro">
                    <span>Origen</span>
                    <h2>Entre botellas, barcos y tardes largas</h2>
                </div>
                <p>
                    La marca toma referencias del imaginario naval: bitacoras, marineros, cuerdas,
                    madera envejecida y horizontes abiertos. Esa estetica acompana un producto pensado
                    para compartir, servir frio y convertir cada encuentro en una pequena ceremonia.
                </p>
            </section>

            <section className="about-values" id="espiritu">
                <article>
                    <span>01</span>
                    <h3>Botanicos</h3>
                    <p>Perfil aromatico, notas amargas y especiadas, equilibrio para beber solo o en coctel.</p>
                </article>
                <article>
                    <span>02</span>
                    <h3>Mar</h3>
                    <p>Una identidad visual ligada a barcos, costa, brisa y espiritu de viaje.</p>
                </article>
                <article>
                    <span>03</span>
                    <h3>Ritual</h3>
                    <p>El vermut como pausa: hielo, rodaja, copa baja y una mesa que invita a quedarse.</p>
                </article>
            </section>

            <section className="about-banner">
                <div>
                    <span>Marvento</span>
                    <h2>De la barra al horizonte</h2>
                </div>
                <p>
                    Una estetica nautica y contemporanea para una marca que quiere sentirse cercana,
                    distinta y con caracter.
                </p>
            </section>
        </section>
    )
}

export default QuienesSomos
