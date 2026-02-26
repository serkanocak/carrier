import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import './ChatbotPage.css'

const GRADIO_SRC = 'https://gradio.s3-us-west-2.amazonaws.com/5.49.1/gradio.js'
const SPACE_URL = 'https://serkanocak-career-conversation.hf.space'

export default function ChatbotPage() {
    const embedRef = useRef(null)

    useEffect(() => {
        // Inject Gradio script if not already present
        if (!document.querySelector(`script[src="${GRADIO_SRC}"]`)) {
            const script = document.createElement('script')
            script.type = 'module'
            script.src = GRADIO_SRC
            document.head.appendChild(script)
        }

        // Append the gradio-app custom element
        if (embedRef.current && !embedRef.current.querySelector('gradio-app')) {
            const app = document.createElement('gradio-app')
            app.setAttribute('src', SPACE_URL)
            app.setAttribute('eager', 'true')
            app.setAttribute('theme_mode', 'dark')
            app.style.width = '100%'
            app.style.height = '100%'
            embedRef.current.appendChild(app)
        }
    }, [])

    return (
        <div className="chatbot-page">
            <div className="chatbot-page-header">
                <Link to="/" className="back-link">
                    <FiArrowLeft size={16} /> Back to Portfolio
                </Link>
                <div className="chatbot-page-title">
                    <span className="chatbot-ai-badge">🤖 AI</span>
                    <h1>Career Assistant</h1>
                </div>
                <p className="chatbot-page-desc">
                    Ask me anything about Serkan's experience, skills, projects, or background.
                </p>
            </div>

            <div className="chatbot-page-embed" ref={embedRef} />
        </div>
    )
}
