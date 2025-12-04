const MainHeader = () => {
    return (
        <header className="header-banner">
            <div className="overplay"></div>
            <div className="grid item-center animated-texts overplay-content gap-4">
                <h1 className="text-center">
                    Experience Luxury Living
                </h1>
                <h4 className="text-center text-30">Discover unparalleled comfort and elegance in the heart of the city</h4>
                <div className="flex gap-4 justify-center">
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-lg shadow-md transition cursor-pointer">
                        Book your stay
                    </button>
                    <button className="bg-transparent border border-white hover:bg-white hover:text-black backdrop-blur-sm font-semibold px-6 py-3 rounded-lg transition cursor-pointer">
                        Explore Rooms
                    </button>
                </div>
            </div>
        </header>
    )
}

export default MainHeader