import MainHeader from '../layouts/MainHeader.tsx'
import RoomCarousel from '../component/RoomCarousel.tsx'
import {BookingBar} from '../component/BookingBar.tsx'
import {Amenities} from '../component/Amenities.tsx'
import {Testimonials} from '../component/Testimonials.tsx'
import {Contact} from '../component/Contact.tsx'
import {About} from '../component/About.tsx'

const Home  = () => {
    return (
        <section>
            <MainHeader/>
            <section className="container item-center p-5">
                <BookingBar/>
                <About/>
                <RoomCarousel/>
                <Amenities/>
                <Testimonials/>
                <Contact/>
            </section>
        </section>
    )
}

export default Home