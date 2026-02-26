import { Link } from 'react-router-dom'
import { FiLinkedin, FiGithub, FiMail, FiHeart, FiMessageSquare } from 'react-icons/fi'
import './Footer.css'

export default function Footer() {
    const year = new Date().getFullYear()
    return (
        <footer className="footer">
            <div className="footer-glow" />
            <div className="container footer-content">
                <div className="footer-left">
                    <a href="#" className="footer-logo">
                        <span className="logo-bracket">&lt;</span>
                        <span className="logo-name-f">SO</span>
                        <span className="logo-bracket">/&gt;</span>
                    </a>
                    <p className="footer-tagline">
                        Built with <FiHeart size={13} className="heart" /> and lots of ☕ in Frankfurt, Germany
                    </p>
                </div>

                <div className="footer-links">
                    <Link to="/chatbot" className="footer-chatbot">
                        <FiMessageSquare size={14} /> Ask My CV
                    </Link>
                    <a href="https://linkedin.com/in/serkanocak" target="_blank" rel="noopener noreferrer">
                        <FiLinkedin size={18} />
                    </a>
                    <a href="https://github.com/serkanocak" target="_blank" rel="noopener noreferrer">
                        <FiGithub size={18} />
                    </a>
                    <a href="mailto:serkanocak@gmail.com">
                        <FiMail size={18} />
                    </a>
                </div>

                <p className="footer-copy">© {year} Serkan Ocak. All rights reserved.</p>
            </div>
        </footer>
    )
}
