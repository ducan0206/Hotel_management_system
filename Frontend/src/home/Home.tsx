import MainHeader from '../layouts/MainHeader.tsx'
import RoomCarousel from '../common/RoomCarousel.tsx'
import {BookingBar} from '../common/BookingBar.tsx'
import {Amenities} from '../common/Amenities.tsx'
import {Testimonials} from '../common/Testimonials.tsx'
import {Contact} from '../common/Contact.tsx'

const Home  = () => {
    return (
        <section>
            <MainHeader/>
            <section className="container item-center p-5">
                <BookingBar/>
                <RoomCarousel/>
                <Amenities/>
                <Testimonials/>
                <Contact/>
            </section>
        </section>
    )
}

export default Home