import { FiMail, FiLinkedin, FiGithub, FiMapPin, FiSend } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import './Contact.css'

const CONTACTS = [
    {
        icon: FiMail,
        label: 'Email',
        value: 'serkanocak@gmail.com',
        href: 'mailto:serkanocak@gmail.com',
        color: '#7C3AED',
    },
    {
        icon: FiLinkedin,
        label: 'LinkedIn',
        value: 'linkedin.com/in/serkanocak',
        href: 'https://linkedin.com/in/serkanocak',
        color: '#0077B5',
    },
    {
        icon: FiGithub,
        label: 'GitHub',
        value: 'github.com/serkanocak',
        href: 'https://github.com/serkanocak',
        color: '#94A3B8',
    },
    {
        icon: FiMapPin,
        label: 'Location',
        value: 'Frankfurt, Germany',
        href: null,
        color: '#06B6D4',
    },
]

export default function Contact() {
    return (
        <section className="section contact-section" id="contact">
            <div className="container">
                <div className="section-header">
                    <div className="section-tag">📬 Get In Touch</div>
                    <h2 className="section-title">Let's <span>Connect</span></h2>
                    <p className="section-desc">
                        Open to senior engineering roles, tech lead positions, and consulting engagements.
                        Don't hesitate to reach out!
                    </p>
                </div>

                <div className="contact-layout">
                    <div className="contact-cards">
                        {CONTACTS.map(({ icon: Icon, label, value, href, color }) => (
                            href ? (
                                <a href={href} target="_blank" rel="noopener noreferrer" className="contact-card glass-card" key={label}>
                                    <div className="contact-icon" style={{ background: `${color}18`, color }}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="contact-info">
                                        <span className="contact-label">{label}</span>
                                        <span className="contact-value">{value}</span>
                                    </div>
                                </a>
                            ) : (
                                <div className="contact-card glass-card" key={label}>
                                    <div className="contact-icon" style={{ background: `${color}18`, color }}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="contact-info">
                                        <span className="contact-label">{label}</span>
                                        <span className="contact-value">{value}</span>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>

                    <div className="contact-cta glass-card">
                        <div className="cta-icon">🤖</div>
                        <h3>Chat With My AI Assistant</h3>
                        <p>
                            Curious about my experience, skills, or background?
                            My AI career chatbot can answer any question about my CV in real-time.
                        </p>
                        <Link to="/chatbot" className="btn-primary">
                            <FiSend size={15} /> Open Career Chatbot
                        </Link>
                        <div className="cta-divider">or</div>
                        <a href="mailto:serkanocak@gmail.com" className="btn-outline">
                            <FiMail size={15} /> Send Direct Email
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
