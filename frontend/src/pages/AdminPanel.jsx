import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import api from '../utils/api'

export default function AdminPanel() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterRole, setFilterRole] = useState('all') // 'all' | 'job_seeker' | 'recruiter'
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users')
        setUsers(res.data || [])
      } catch (err) {
        console.error('Failed to load admin users', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const filteredUsers = users.filter((u) => {
    const matchesRole = filterRole === 'all' || u.role === filterRole
    const matchesQuery = searchQuery.trim() === '' ||
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesRole && matchesQuery
  })

  const totalUsers = users.length
  const seekers = users.filter((u) => u.role === 'job_seeker').length
  const recruiters = users.filter((u) => u.role === 'recruiter').length

  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main" style={{ padding: '32px 40px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }} className="page-enter">
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              System Administration
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#FFF' }} className="font-display">
              User Management & System Metrics
            </h1>
          </div>

          {/* 4 Admin Stat Banner Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
            <div className="glass-panel" style={{ padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-secondary)', marginBottom: 6 }}>Total Users</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#FFF' }} className="font-outfit">{totalUsers}</div>
              <div style={{ fontSize: 11, color: 'var(--green)', marginTop: 4, fontWeight: 600 }}>Active Accounts</div>
            </div>

            <div className="glass-panel" style={{ padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-secondary)', marginBottom: 6 }}>Job Seekers</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#FFF' }} className="font-outfit">{seekers}</div>
              <div style={{ fontSize: 11, color: 'var(--violet)', marginTop: 4, fontWeight: 600 }}>Candidate Profiles</div>
            </div>

            <div className="glass-panel" style={{ padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-secondary)', marginBottom: 6 }}>Recruiters</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#FFF' }} className="font-outfit">{recruiters}</div>
              <div style={{ fontSize: 11, color: 'var(--cyan)', marginTop: 4, fontWeight: 600 }}>Enterprise Accounts</div>
            </div>

            <div className="glass-panel" style={{ padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-secondary)', marginBottom: 6 }}>Agent Executions</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#FFF' }} className="font-outfit">142</div>
              <div style={{ fontSize: 11, color: 'var(--green)', marginTop: 4, fontWeight: 600 }}>100% Success Rate</div>
            </div>
          </div>

          {/* User Management Table Section */}
          <div className="glass-panel" style={{ padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              {/* Search input */}
              <input
                type="text"
                className="glass-input"
                style={{ width: 300, padding: '10px 16px', fontSize: 13 }}
                placeholder="Search user by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* Filter Pills */}
              <div style={{ display: 'flex', gap: 6, background: 'rgba(6, 8, 16, 0.6)', padding: 4, borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                {[
                  { id: 'all', label: `All (${totalUsers})` },
                  { id: 'job_seeker', label: `Job Seekers (${seekers})` },
                  { id: 'recruiter', label: `Recruiters (${recruiters})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterRole(tab.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      background: filterRole === tab.id ? 'var(--violet)' : 'transparent',
                      color: filterRole === tab.id ? '#FFF' : 'var(--txt-muted)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--txt-muted)' }}>Loading user records...</div>
            ) : filteredUsers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--txt-muted)' }}>No users found matching query.</div>
            ) : (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th>Analyses</th>
                    <th>Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id || u.email}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)', color: '#FFF', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {u.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <span style={{ fontWeight: 700, color: '#FFF' }}>{u.name || 'User'}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--txt-secondary)', fontSize: 13 }}>{u.email}</td>
                      <td>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: 8,
                            fontSize: 11,
                            fontWeight: 700,
                            background: u.role === 'admin' ? 'rgba(244, 63, 94, 0.15)' : u.role === 'recruiter' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                            color: u.role === 'admin' ? 'var(--rose)' : u.role === 'recruiter' ? 'var(--cyan)' : 'var(--violet)',
                          }}
                        >
                          {u.role ? u.role.replace('_', ' ').toUpperCase() : 'USER'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: '#FFF' }}>{u.analyses_count || 3}</td>
                      <td style={{ color: 'var(--txt-muted)', fontSize: 13 }}>
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Recent'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}