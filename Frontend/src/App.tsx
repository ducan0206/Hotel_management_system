import Home from '../src/home/Home.tsx'
import Footer from '../src/layouts/Footer.tsx'
import NavBar from '../src/layouts/NavBar.tsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {AuthProvider} from '../src/context/AuthContext.tsx'

function App() {

    return (
        <>
        <AuthProvider>
            <main>
                <Router>
                    <NavBar/>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                    </Routes>
                    <Footer/>
                </Router>
            </main>
        </AuthProvider>
        </>
    )
}

export default App
