
import HomeHero from '../../Components/HomeHero'
import HomeIntro from '../../Components/HomeIntro'
import HomeImgBianco from '../../Components/HomeImgBianco'
import HomeImgRosso from '../../Components/HomeImgRosso'
import HomeTextBianco from '../../Components/HomeTextBianco'
import HomeTextRosso from '../../Components/HomeTextRosso'
import './styles.css'

function Home() {
    return (
        <>
            <HomeHero />
            <HomeIntro />
            <section className="vermut-feature">
                <HomeImgBianco/>                
                <HomeTextBianco/>                
            </section>
            <section className="vermut-feature vermut-feature--rosso" aria-label="Marvento Rosso">
                <HomeTextRosso/>
                <HomeImgRosso/>
            </section>
        </>
    )
}

export default Home
