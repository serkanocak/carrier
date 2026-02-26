import { FiCalendar, FiMapPin, FiChevronRight } from 'react-icons/fi'
import './Experience.css'

const JOBS = [
    {
        company: 'Mastra GmbH',
        role: 'Senior Software Developer / Tech Lead',
        period: '02/2025 – Present',
        location: 'Frankfurt, Germany',
        current: true,
        highlights: [
            'Leading development of a multi-tenant SaaS CRM platform (Aureus CRM)',
            'Architecting scalable microservices with .NET 8, Docker & Kubernetes',
            'Optimizing CI/CD processes and driving team-wide engineering standards',
            'Managing cross-functional teams and mentoring junior developers',
        ],
        tags: ['.NET 8', 'SaaS', 'Kubernetes', 'Tech Lead'],
    },
    {
        company: 'Mastra GmbH',
        role: 'Software Developer — Microservices Specialist',
        period: '09/2021 – 01/2025',
        location: 'Frankfurt, Germany',
        highlights: [
            'Developed and maintained microservices using .NET 6/8 and Docker',
            'Built RESTful APIs consumed by React and Angular frontends',
            'Implemented event-driven architectures with messaging queues',
            'Collaborated with German & international teams in Agile sprints',
        ],
        tags: ['.NET 6/8', 'Docker', 'Microservices', 'REST'],
    },
    {
        company: 'STFA Holding',
        role: 'Management Systems Manager – IT',
        period: '07/2017 – 08/2019',
        location: 'Istanbul, Turkey',
        highlights: [
            'Implemented cost control and management information systems',
            'Managed SAP integrations across holding subsidiaries',
            'Led enterprise application monitoring and optimization',
        ],
        tags: ['SAP', '.NET', 'ERP', 'Management'],
    },
    {
        company: 'Logon Consulting',
        role: 'Senior Software Consultant',
        period: '05/2016 – 08/2017',
        location: 'Istanbul, Turkey',
        highlights: [
            'Addressed SAP application performance bottlenecks for enterprise clients',
            'Conducted technical analysis and delivered custom development solutions',
            'Provided cross-industry IT consulting for large corporations',
        ],
        tags: ['SAP', 'Consulting', 'Performance'],
    },
    {
        company: 'Rönesans Holding',
        role: 'Software Development Chief – IT',
        period: '03/2014 – 12/2015',
        location: 'Istanbul, Turkey',
        highlights: [
            'Led a development team building ASP.NET enterprise applications',
            'Architected corporate intranet and HR management platforms',
            'Drove adoption of Agile methodologies across the IT department',
        ],
        tags: ['ASP.NET', 'Team Lead', 'Intranet', 'Agile'],
    },
    {
        company: 'Yapı Merkezi Holding',
        role: 'Software Development Specialist – IT',
        period: '03/2010 – 10/2013',
        location: 'Istanbul, Turkey',
        highlights: [
            'Enterprise application development with .NET and SAP ABAP',
            'Built project management and reporting tools for construction operations',
            'Integrated ERP systems with custom .NET business applications',
        ],
        tags: ['.NET', 'SAP ABAP', 'ERP Integration'],
    },
    {
        company: 'Enka Construction',
        role: 'System Support Specialist – IT',
        period: '03/2006 – 08/2009',
        location: 'Istanbul, Turkey',
        highlights: [
            'Managed user account administration and Active Directory',
            'Provided technical support and network infrastructure maintenance',
            'First exposure to enterprise IT in a global construction company',
        ],
        tags: ['IT Support', 'Network', 'Active Directory'],
    },
]

export default function Experience() {
    return (
        <section className="section experience-section" id="experience">
            <div className="container">
                <div className="section-header">
                    <div className="section-tag">🏢 Work History</div>
                    <h2 className="section-title">Professional <span>Experience</span></h2>
                    <p className="section-desc">15+ years shaping enterprise software across Turkey and Germany</p>
                </div>

                <div className="experience-timeline">
                    {JOBS.map((job, i) => (
                        <div className="timeline-item" key={i}>
                            <div className="timeline-dot" style={job.current ? { background: 'var(--gradient-primary)' } : {}}>
                                {job.current && <span className="timeline-dot-pulse" />}
                            </div>
                            <div className="timeline-card glass-card">
                                <div className="timeline-header">
                                    <div>
                                        <h3 className="timeline-role">{job.role}</h3>
                                        <p className="timeline-company">{job.company}</p>
                                    </div>
                                    {job.current && <span className="timeline-badge-current">Current</span>}
                                </div>
                                <div className="timeline-meta">
                                    <span><FiCalendar size={13} /> {job.period}</span>
                                    <span><FiMapPin size={13} /> {job.location}</span>
                                </div>
                                <ul className="timeline-highlights">
                                    {job.highlights.map((h, j) => (
                                        <li key={j}>
                                            <FiChevronRight size={13} className="highlight-arrow" />
                                            {h}
                                        </li>
                                    ))}
                                </ul>
                                <div className="timeline-tags">
                                    {job.tags.map(t => (
                                        <span className="tag" key={t}>{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
