import { FiExternalLink, FiGithub } from 'react-icons/fi'
import './Projects.css'

const PROJECTS = [
    {
        title: 'Aureus CRM',
        description: 'Multi-tenant SaaS CRM platform serving enterprise clients. Features real-time data sync, role-based access control, custom reporting dashboards, and seamless third-party integrations.',
        tags: ['.NET 8', 'React', 'Azure', 'Docker', 'SaaS', 'Multi-tenant'],
        icon: '🏢',
        color: '#7C3AED',
        highlights: ['Multi-tenant architecture', 'Real-time CRM', 'Azure deployment'],
    },
    {
        title: 'TOMS — Order Management System',
        description: 'Temsa\'s enterprise Order Management System handling the complete lifecycle of commercial vehicle orders, from quotation through production to delivery tracking.',
        tags: ['.NET', 'MSSQL', 'SAP Integration', 'WCF', 'Angular'],
        icon: '🚌',
        color: '#3B82F6',
        highlights: ['Order lifecycle management', 'SAP ERP integration', 'Production tracking'],
    },
    {
        title: 'Automotive Dealer Management System',
        description: 'A comprehensive sales and service management solution for automotive dealerships. Manages vehicle inventory, customer relationships, service orders, and financial reporting.',
        tags: ['ASP.NET MVC', 'SQL Server', 'JavaScript', 'ERP'],
        icon: '🚗',
        color: '#06B6D4',
        highlights: ['Vehicle inventory', 'Service management', 'Financial reporting'],
    },
    {
        title: 'Corporate Communication Platform',
        description: 'Enterprise intranet and HR management platform deployed across Rönesans Holding subsidiaries. Features company news, document management, HR workflows, and employee directory.',
        tags: ['.NET', 'MS SharePoint', 'LDAP', 'SQL Server'],
        icon: '📡',
        color: '#A855F7',
        highlights: ['Intranet portal', 'HR workflows', 'Document management'],
    },
]

export default function Projects() {
    return (
        <section className="section projects-section" id="projects">
            <div className="container">
                <div className="section-header">
                    <div className="section-tag">🚀 Featured Work</div>
                    <h2 className="section-title">Enterprise <span>Projects</span></h2>
                    <p className="section-desc">Highlights from 15+ years of building mission-critical enterprise systems</p>
                </div>

                <div className="projects-grid">
                    {PROJECTS.map((p, i) => (
                        <div className="project-card glass-card" key={i}>
                            <div className="project-card-top">
                                <div className="project-icon" style={{ border: `1px solid ${p.color}44`, background: `${p.color}11` }}>
                                    <span style={{ fontSize: '1.8rem' }}>{p.icon}</span>
                                </div>
                                <div className="project-links">
                                    <div className="project-number" style={{ color: p.color }}>
                                        0{i + 1}
                                    </div>
                                </div>
                            </div>
                            <h3 className="project-title" style={{ color: 'var(--text-primary)' }}>{p.title}</h3>
                            <p className="project-desc">{p.description}</p>
                            <ul className="project-highlights">
                                {p.highlights.map(h => (
                                    <li key={h}>
                                        <span className="highlight-dot" style={{ background: p.color }} />
                                        {h}
                                    </li>
                                ))}
                            </ul>
                            <div className="project-tags">
                                {p.tags.map(t => (
                                    <span className="tag" key={t} style={{
                                        background: `${p.color}14`,
                                        borderColor: `${p.color}30`,
                                        color: `${p.color}`,
                                    }}>{t}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
