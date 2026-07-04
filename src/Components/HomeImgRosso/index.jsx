import rossoProductImage from '../../assets/marvento-rojo-producto.jpg'
import './styles.css'

function HomeImgRosso() {
    return (
        <div className="cont-rosso-img">
            <img src={rossoProductImage} alt="Rosso" className="imgRosso" />
        </div>
    )
}

export default HomeImgRosso
