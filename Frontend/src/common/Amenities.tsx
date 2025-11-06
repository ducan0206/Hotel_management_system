import {AmenityCard}  from '../common/AmenityCard'
import {Utensils, Wifi, Dumbbell, Waves, Car, Wind} from 'lucide-react'

export const Amenities = () => {
    return (
        <section id="amenities" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">World-Class Amenities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Enjoy a wide range of facilities designed to make your stay unforgettable.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <AmenityCard
              icon={<Wifi className="h-8 w-8 text-blue-600" />}
              title="Free WiFi"
            />
            <AmenityCard
              icon={<Utensils className="h-8 w-8 text-blue-600" />}
              title="Restaurant"
            />
            <AmenityCard
              icon={<Dumbbell className="h-8 w-8 text-blue-600" />}
              title="Fitness Center"
            />
            <AmenityCard
              icon={<Waves className="h-8 w-8 text-blue-600" />}
              title="Swimming Pool"
            />
            <AmenityCard
              icon={<Car className="h-8 w-8 text-blue-600" />}
              title="Parking"
            />
            <AmenityCard
              icon={<Wind className="h-8 w-8 text-blue-600" />}
              title="Spa & Wellness"
            />
          </div>
        </div>
      </section>
    )
}