import biancoLabel from '../../assets/label-bianco-clean.png'
import './styles.css'

const HomeTextBianco = () => {
    return (
        <div className="cont-text-bianco">
            <div className="guarda" aria-hidden="true" />
            <div className="bianco-label" aria-label="BIANCO">
                <img src={biancoLabel} alt="" aria-hidden="true" />
            </div>
            <div className="bianco-copy">
                <span className="bianco-meta">Fresco &middot; Herbal &middot; Luminoso</span>
                <p className="texto-bianco">
                    La expresi&oacute;n m&aacute;s fresca de MARVENTO. Inspirado en el encuentro entre el
                    Atl&aacute;ntico y el Mediterr&aacute;neo, MARVENTO BIANCO combina una cuidada
                    selecci&oacute;n de bot&aacute;nicos para dar lugar a un vermut delicado, equilibrado y
                    luminoso.
                </p>
                <p className="texto-bianco">
                    Su perfil herbal, acompa&ntilde;ado por un dulzor sutil y un amargor elegante,
                    invita a descubrir una versi&oacute;n m&aacute;s ligera y refrescante del ritual del vermut.
                </p>
            </div>
        </div>
    )
}

export default HomeTextBianco

