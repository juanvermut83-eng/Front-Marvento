import rosso320Jpg from '../../assets/ROSSO/DSC_1850-320w.jpg'
import rosso320Webp from '../../assets/ROSSO/DSC_1850-320w.webp'
import rosso480Jpg from '../../assets/ROSSO/DSC_1850-480w.jpg'
import rosso480Webp from '../../assets/ROSSO/DSC_1850-480w.webp'
import rosso768Jpg from '../../assets/ROSSO/DSC_1850-768w.jpg'
import rosso768Webp from '../../assets/ROSSO/DSC_1850-768w.webp'
import rosso1024Jpg from '../../assets/ROSSO/DSC_1850-1024w.jpg'
import rosso1024Webp from '../../assets/ROSSO/DSC_1850-1024w.webp'
import rosso1536Jpg from '../../assets/ROSSO/DSC_1850-1536w.jpg'
import rosso1536Webp from '../../assets/ROSSO/DSC_1850-1536w.webp'
import './styles.css'

const rossoWebpSrcSet = `${rosso320Webp} 320w, ${rosso480Webp} 480w, ${rosso768Webp} 768w, ${rosso1024Webp} 1024w, ${rosso1536Webp} 1536w`
const rossoJpgSrcSet = `${rosso320Jpg} 320w, ${rosso480Jpg} 480w, ${rosso768Jpg} 768w, ${rosso1024Jpg} 1024w, ${rosso1536Jpg} 1536w`
const imageSizes = '(max-width: 760px) 100vw, 50vw'

function HomeImgRosso() {
    return (
        <div className="cont-rosso-img">
            <picture className="home-product-picture">
                <source type="image/webp" srcSet={rossoWebpSrcSet} sizes={imageSizes} />
                <img
                    src={rosso1024Jpg}
                    srcSet={rossoJpgSrcSet}
                    sizes={imageSizes}
                    width="1536"
                    height="2048"
                    alt="Botella de Marvento Rosso"
                    loading="lazy"
                    decoding="async"
                    className="imgRosso"
                />
            </picture>
        </div>
    )
}

export default HomeImgRosso
