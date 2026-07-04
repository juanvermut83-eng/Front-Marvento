import './styles.css'

function HomeIntro() {
    return (
        <section className="home-intro" aria-label="Origen de Marvento">
            <div className="home-intro__inner">
                <span className="home-intro__eyebrow">Origen</span>
                <h2>Dos costas Una identidad</h2>
                <p>
                    <strong>MARVENTO</strong> es un proyecto de <strong>CASA TALINA</strong> nacido entre el
                    Atlantico de Mar del Plata y el Mediterraneo de Montecorice. Una coleccion de vermuts
                    que transforma ese encuentro en una propuesta de caracter.
                </p>
                <div className="home-intro__tags" aria-label="Conceptos de identidad Marvento">
                    <span>Mar</span>
                    <span>Viento</span>
                    <span>Botanicos</span>
                </div>
            </div>
        </section>
    )
}

export default HomeIntro
