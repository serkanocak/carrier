import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ChatbotPage from './pages/ChatbotPage'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chatbot" element={<ChatbotPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
