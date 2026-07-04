import biancoProductImage from '../../assets/marvento-bianco-producto.jpg'
import './styles.css';

function HomeImgBianco() {
    return (
        <div className="cont-bianco">
            <img src={biancoProductImage} alt="Bianco" className='imgBianco'/>
        </div>
    )
}

export default HomeImgBianco
