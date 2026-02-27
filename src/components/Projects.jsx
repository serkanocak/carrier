import { FiExternalLink, FiGithub } from 'react-icons/fi'
import AuthGate from './AuthGate'
import './Projects.css'

const PROJECTS = [
    {
        title: 'Aureus CRM SaaS Platform',
        description: 'Modernized multi-tenant SaaS CRM platform for facility management. Built with PHP/MySQL/AWS, featuring real-time data sync, role-based access control, and custom reporting dashboards.',
        tags: ['PHP', 'MySQL', 'AWS', 'SaaS', 'Multi-tenant'],
        icon: '🏢',
        color: '#7C3AED',
        highlights: ['Multi-tenant architecture', 'PHP to distributed migration', 'AWS infrastructure'],
    },
    {
        title: 'TOMS — Order Management System',
        description: 'Temsa\'s B2B Order Management System handling the complete lifecycle of commercial vehicle orders with end-to-end approval workflows and SAP integration.',
        tags: ['.NET Core', 'DDD', 'CQRS', 'SAP Integration', 'Angular'],
        icon: '🚌',
        color: '#3B82F6',
        highlights: ['End-to-end order workflows', 'SAP ERP integration', 'DDD & CQRS architecture'],
    },
    {
        title: 'Automotive Dealer Management System',
        description: 'Technical analysis and design for automotive sector digitization. Comprehensive sales and service management solution for vehicle dealerships.',
        tags: ['ASP.NET MVC', 'SQL Server', '.NET Core', 'ERP'],
        icon: '🚗',
        color: '#06B6D4',
        highlights: ['Dealer digitization', 'Vehicle inventory', 'Service management'],
    },
    {
        title: 'Corporate Communication Platform',
        description: 'Intranet-based CMS and hybrid mobile apps for enterprise communication. Deployed across Temsa subsidiaries with Angular, React, and .NET backends.',
        tags: ['Angular', 'React', '.NET', 'Hybrid Mobile'],
        icon: '📡',
        color: '#A855F7',
        highlights: ['Intranet CMS', 'Hybrid mobile apps', 'Enterprise-wide deployment'],
    },
    {
        title: 'SAP ECC ERP Full-Cycle Implementation',
        description: 'Complete SAP ABAP development and process analysis. Delivered customization, performance optimization, and Fiori enhancements for enterprise clients.',
        tags: ['SAP ABAP', 'Fiori', 'ERP', 'Process Analysis'],
        icon: '⚙️',
        color: '#F59E0B',
        highlights: ['Full-cycle ABAP development', 'Fiori enhancements', 'Performance optimization'],
    },
    {
        title: 'Enterprise Internal Systems Suite',
        description: 'Suite of .NET/SQL enterprise applications for internal operations including Cost Control, Quality Control, HR Management, and Central Purchasing systems.',
        tags: ['ASP.NET', 'MS-SQL', 'Web Forms', 'Enterprise'],
        icon: '🏗️',
        color: '#10B981',
        highlights: ['Cost Control system', 'HR & Quality platforms', 'Multi-subsidiary deployment'],
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

                <AuthGate label="enterprise projects">
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
                </AuthGate>
            </div>
        </section>
    )
}
