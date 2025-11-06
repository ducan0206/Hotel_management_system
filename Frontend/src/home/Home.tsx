import MainHeader from '../layouts/MainHeader.tsx'
import RoomCarousel from '../common/RoomCarousel.tsx'

const Home  = () => {
    return (
        <section>
            <MainHeader/>
            <section className="container">
                <RoomCarousel/>
            </section>
        </section>
    )
}

export default Home