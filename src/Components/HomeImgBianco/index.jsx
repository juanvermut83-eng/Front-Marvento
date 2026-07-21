import bianco320Jpg from '../../assets/BIANCO/DSC_1730-320w.jpg'
import bianco320Webp from '../../assets/BIANCO/DSC_1730-320w.webp'
import bianco480Jpg from '../../assets/BIANCO/DSC_1730-480w.jpg'
import bianco480Webp from '../../assets/BIANCO/DSC_1730-480w.webp'
import bianco768Jpg from '../../assets/BIANCO/DSC_1730-768w.jpg'
import bianco768Webp from '../../assets/BIANCO/DSC_1730-768w.webp'
import bianco1024Jpg from '../../assets/BIANCO/DSC_1730-1024w.jpg'
import bianco1024Webp from '../../assets/BIANCO/DSC_1730-1024w.webp'
import bianco1536Jpg from '../../assets/BIANCO/DSC_1730-1536w.jpg'
import bianco1536Webp from '../../assets/BIANCO/DSC_1730-1536w.webp'
import './styles.css';

const biancoWebpSrcSet = `${bianco320Webp} 320w, ${bianco480Webp} 480w, ${bianco768Webp} 768w, ${bianco1024Webp} 1024w, ${bianco1536Webp} 1536w`
const biancoJpgSrcSet = `${bianco320Jpg} 320w, ${bianco480Jpg} 480w, ${bianco768Jpg} 768w, ${bianco1024Jpg} 1024w, ${bianco1536Jpg} 1536w`
const imageSizes = '(max-width: 760px) 100vw, 50vw'

function HomeImgBianco() {
    return (
        <div className="cont-bianco">
            <picture className="home-product-picture">
                <source type="image/webp" srcSet={biancoWebpSrcSet} sizes={imageSizes} />
                <img
                    src={bianco1024Jpg}
                    srcSet={biancoJpgSrcSet}
                    sizes={imageSizes}
                    width="1536"
                    height="2048"
                    alt="Botella de Marvento Bianco"
                    loading="lazy"
                    decoding="async"
                    className="imgBianco"
                />
            </picture>
        </div>
    )
}

export default HomeImgBianco
