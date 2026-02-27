import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import ChatbotFloat from '../components/ChatbotFloat'

export default function Home() {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <About />
                <Contact />
            </main>
            <Footer />
            <ChatbotFloat />
        </>
    )
}
