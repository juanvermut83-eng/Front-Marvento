import zocaloHistoria from '../../assets/zocalo_historia.png'
import zocaloHistoriaMobile from '../../assets/HistoriaMobile.png'
import './styles.css'

function Historia() {
    return (
        <section className="historia-page">
            <div className="historia-page__text">
                <div className="historia-page__content">
                    <h1>Nuestra historia</h1>

                    <p>
                        <strong>MARVENTO</strong> nace dentro de <strong>CASA TALINA</strong>, un proyecto inspirado en
                        las ra&iacute;ces familiares y en el v&iacute;nculo entre dos costas: Montecorice, sobre el
                        Mediterr&aacute;neo italiano, y Mar del Plata, frente al Atl&aacute;ntico argentino.
                    </p>

                    <p>
                        Durante generaciones, la elaboraci&oacute;n de licores y aperitivos form&oacute; parte de los
                        encuentros familiares, una tradici&oacute;n transmitida con el mismo esp&iacute;ritu de compartir
                        y agasajar. Con el tiempo, ese legado fue incorporando nuevas t&eacute;cnicas, nuevos
                        bot&aacute;nicos y una mirada contempor&aacute;nea, sin perder el respeto por su origen.
                    </p>

                    <p>
                        Hoy, <strong>MARVENTO</strong> representa una nueva etapa de esa historia. Un vermut que
                        recupera la herencia mediterr&aacute;nea para reinterpretarla desde el Atl&aacute;ntico, dando
                        forma a una propuesta con identidad propia, donde tradici&oacute;n e innovaci&oacute;n navegan
                        en la misma direcci&oacute;n.
                    </p>
                </div>
            </div>

            <div className="historia-page__zocalo">
                <picture>
                    <source media="(max-width: 760px)" srcSet={zocaloHistoriaMobile} />
                    <img src={zocaloHistoria} alt="Marvento historia" />
                </picture>
            </div>
        </section>
    )
}

export default Historia
