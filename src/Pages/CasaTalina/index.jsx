import casaTalinaImage from '../../assets/Casa_Talina.png'
import casaTalinaMobileImage from '../../assets/CasaTalinaMobile.png'
import './styles.css'

function CasaTalina() {
    return (
        <section className="casa-talina-page">
            <div className="casa-talina-page__text">
                <div className="casa-talina-page__content">
                    <h1>Casa Talina</h1>

                    <p>
                        <strong>CASA TALINA</strong> es el proyecto que da origen a <strong>MARVENTO</strong> y a una
                        colecci&oacute;n de marcas inspiradas en la tradici&oacute;n mediterr&aacute;nea, reinterpretadas
                        desde la costa atl&aacute;ntica argentina. M&aacute;s que desarrollar productos, construye
                        historias donde el origen, la cultura y el paisaje forman parte de una misma identidad.
                    </p>

                    <p>
                        Cada propuesta nace de un proceso de investigaci&oacute;n y desarrollo que combina herencia,
                        calidad y una mirada contempor&aacute;nea. Un universo donde cada marca tiene su propia
                        personalidad, pero comparte un mismo esp&iacute;ritu: crear productos con identidad, pensados
                        para perdurar y ser compartidos.
                    </p>
                </div>
            </div>

            <div className="casa-talina-page__image">
                <picture>
                    <source media="(max-width: 760px)" srcSet={casaTalinaMobileImage} />
                    <img src={casaTalinaImage} alt="Casa Talina" />
                </picture>
            </div>
        </section>
    )
}

export default CasaTalina
