import Home from '../src/home/Home.tsx'

import Footer from '../src/layouts/Footer.tsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

    return (
        <>
            <main>
                <Router>
                    {/* <NavBar/> */}
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                    </Routes>
                    <Footer/>
                </Router>
            </main>
        </>
    )
}

export default App
