import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth, ADMIN_EMAIL } from '../context/AuthContext'
import { FiArrowLeft, FiUsers } from 'react-icons/fi'
import './AdminPage.css'

export default function AdminPage() {
    const { user, loading } = useAuth()
    const [members, setMembers] = useState([])
    const [fetching, setFetching] = useState(true)

    useEffect(() => {
        if (!user || user.email !== ADMIN_EMAIL) return
        const fetchMembers = async () => {
            try {
                const q = query(collection(db, 'members'), orderBy('joinedAt', 'desc'))
                const snap = await getDocs(q)
                setMembers(snap.docs.map(d => ({ id: d.id, ...d.data() })))
            } catch (err) {
                console.error(err)
            } finally {
                setFetching(false)
            }
        }
        fetchMembers()
    }, [user])

    if (loading) return null

    if (!user || user.email !== ADMIN_EMAIL) {
        return (
            <div className="admin-denied">
                <div className="admin-denied-inner">
                    <span>🚫</span>
                    <h2>Access Denied</h2>
                    <p>This page is only accessible to the site administrator.</p>
                    <Link to="/" className="admin-back-btn">← Back to Portfolio</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <Link to="/" className="back-link">
                    <FiArrowLeft size={16} /> Back to Portfolio
                </Link>
                <div className="admin-title-wrap">
                    <span className="admin-badge">👑 Admin</span>
                    <h1>Member List</h1>
                </div>
                <p className="admin-subtitle">
                    All registered members · {members.length} total
                </p>
            </div>

            <div className="admin-body">
                {fetching ? (
                    <div className="admin-loading">Loading members…</div>
                ) : members.length === 0 ? (
                    <div className="admin-empty">
                        <FiUsers size={40} />
                        <p>No members yet.</p>
                    </div>
                ) : (
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Member</th>
                                    <th>Email</th>
                                    <th>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map((m, i) => (
                                    <tr key={m.id}>
                                        <td className="admin-idx">{i + 1}</td>
                                        <td>
                                            <div className="admin-member-cell">
                                                {m.photoURL
                                                    ? <img src={m.photoURL} alt={m.name} className="admin-avatar" />
                                                    : <div className="admin-avatar-fallback">{m.name?.[0]}</div>
                                                }
                                                <span className="admin-member-name">{m.name}</span>
                                            </div>
                                        </td>
                                        <td className="admin-email">{m.email}</td>
                                        <td className="admin-date">
                                            {m.joinedAt?.toDate
                                                ? m.joinedAt.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                                                : '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
