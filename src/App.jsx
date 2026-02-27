import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import ChatbotPage from './pages/ChatbotPage'
import AdminPage from './pages/AdminPage'

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/chatbot" element={<ChatbotPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
