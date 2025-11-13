import {Button} from '../component/ui/button.tsx'

export const About = () => {
    return (
        <>
        <section id="about" className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                <h2 className="text-4xl mb-6">About PASK Hotel</h2>
                <p className="text-gray-600 mb-4">
                    Welcome to PASK Hotel, where luxury meets comfort in the heart of the city. 
                    Since our establishment, we have been committed to providing exceptional hospitality 
                    and creating memorable experiences for our guests.
                </p>
                <p className="text-gray-600 mb-4">
                    Our hotel features 150 elegantly designed rooms and suites, each equipped with 
                    modern amenities and thoughtful touches to ensure your comfort. From business 
                    travelers to families on vacation, we cater to all your needs with our 
                    world-class facilities and personalized service.
                </p>
                <p className="text-gray-600 mb-6">
                    Experience the perfect blend of contemporary style and timeless elegance, 
                    backed by our dedicated team who are always ready to exceed your expectations.
                </p>
                <Button size="lg">Learn More</Button>
                </div>
                <div className="relative h-96 lg:h-full min-h-[400px]">
                <img
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80"
                    alt="Hotel exterior"
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                />
                </div>
            </div>
            </div>
        </section>
        </>
    )
}