import rossoLabel from '../../assets/label-rosso-clean.png'
import './styles.css'

const HomeTextRosso = () => {
    return (
        <div className="cont-text-rosso">
            <div className="guarda-rosso" aria-hidden="true" />
            <div className="rosso-label" aria-label="ROSSO">
                <img src={rossoLabel} alt="" aria-hidden="true" />
            </div>
            <div className="rosso-copy">
                <span className="rosso-meta">Profundo &middot; Equilibrado &middot; Intenso</span>
                <p className="texto-rosso">
                    La expresi&oacute;n m&aacute;s intensa de MARVENTO. Nacido del di&aacute;logo entre la
                    profundidad atl&aacute;ntica de Mar del Plata y el car&aacute;cter del Mediterr&aacute;neo,
                    re&uacute;ne una cuidada selecci&oacute;n de bot&aacute;nicos para construir un vermut de
                    gran personalidad.
                </p>
                <p className="texto-rosso">
                    Profundo, equilibrado y de car&aacute;cter marcado, despliega un juego de dulzor y
                    amargor pensado para disfrutarse sin apuro.
                </p>
            </div>
        </div>
    )
}

export default HomeTextRosso

