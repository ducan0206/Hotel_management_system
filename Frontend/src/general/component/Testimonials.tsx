import {TestimonialCard} from './TestimonialCard.tsx'

export const Testimonials = () => {
    return (
        <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">What Our Guests Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Read reviews from our satisfied guests who experienced our hospitality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sarah Johnson"
              rating={5}
              comment="Absolutely amazing experience! The staff was incredibly friendly and the room was spotless. Will definitely come back."
              date="October 2025"
            />
            <TestimonialCard
              name="Michael Chen"
              rating={5}
              comment="Best hotel I've stayed at. The location is perfect, amenities are top-notch, and the breakfast was delicious."
              date="September 2025"
            />
            <TestimonialCard
              name="Emma Williams"
              rating={5}
              comment="Perfect for a romantic getaway. The presidential suite exceeded our expectations. Highly recommended!"
              date="November 2025"
            />
          </div>
        </div>
      </section>
    )
}