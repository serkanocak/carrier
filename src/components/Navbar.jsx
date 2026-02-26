import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiMenu, FiX, FiMessageSquare } from 'react-icons/fi'
import './Navbar.css'

const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Education', href: '#education' },
    { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleNavClick = (e, href) => {
        if (href.startsWith('#')) {
            e.preventDefault()
            setMobileOpen(false)
            const el = document.querySelector(href)
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                <a href="#" className="navbar-logo" onClick={e => handleNavClick(e, '#')}>
                    <span className="logo-bracket">&lt;</span>
                    <span className="logo-name">SO</span>
                    <span className="logo-bracket">/&gt;</span>
                </a>

                <ul className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
                    {navLinks.map(link => (
                        <li key={link.label}>
                            <a href={link.href} onClick={e => handleNavClick(e, link.href)}>
                                {link.label}
                            </a>
                        </li>
                    ))}
                    <li>
                        <Link to="/chatbot" className="btn-chatbot" onClick={() => setMobileOpen(false)}>
                            <FiMessageSquare size={14} />
                            Ask My CV
                        </Link>
                    </li>
                </ul>

                <button
                    className="navbar-toggle"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                </button>
            </div>
        </nav>
    )
}
