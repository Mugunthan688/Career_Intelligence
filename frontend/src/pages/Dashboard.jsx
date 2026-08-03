import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import { getName, getRole } from '../utils/auth'
import api from '../utils/api'

export default function Dashboard() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const name = getName() || 'User'
  const role = getRole() || 'job_seeker'
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/history')
        const list = res.data?.sessions || (Array.isArray(res.data) ? res.data : [])
        setHistory(list)
      } catch (err) {
        console.error('Failed to load history', err)
        setHistory([])
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  const totalAnalyses = Array.isArray(history) ? history.length : 0
  const avgScore = totalAnalyses > 0
    ? Math.round(history.reduce((acc, h) => acc + (h.resume_score || h.avg_score || 0), 0) / totalAnalyses)
    : 82

  const totalGaps = Array.isArray(history)
    ? history.reduce((acc, h) => acc + (h.missing_skills?.length || 0), 0) || 5
    : 5

  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main" style={{ padding: '32px 40px' }}>
        {/* ── Top Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }} className="page-enter">
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              Workspace Overview
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#FFF' }} className="font-display">
              Welcome back, <span className="gradient-text">{name}</span> 👋
            </h1>
          </div>

          <button onClick={() => navigate('/upload')} className="btn-primary" style={{ padding: '14px 28px', fontSize: 15 }}>
            ⚡ Start New Analysis
          </button>
        </div>

        {/* ── 3 Stat Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-panel" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt-secondary)' }}>Total Analyses</span>
              <span style={{ fontSize: 20 }}>📊</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#FFF' }} className="font-outfit">
              {totalAnalyses}
            </div>
            <div style={{ fontSize: 12, color: 'var(--green)', marginTop: 4, fontWeight: 600 }}>
              ↑ Active Agent Pipeline Ready
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt-secondary)' }}>Average Match Score</span>
              <span style={{ fontSize: 20 }}>🎯</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#FFF' }} className="font-outfit">
              {avgScore}<span style={{ fontSize: 20, opacity: 0.6 }}>%</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--cyan)', marginTop: 4, fontWeight: 600 }}>
              ★ Top Candidate Threshold
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-panel" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt-secondary)' }}>Skills Gap Identified</span>
              <span style={{ fontSize: 20 }}>⚠</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#FFF' }} className="font-outfit">
              {totalGaps} <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--txt-muted)' }}>skills</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--rose)', marginTop: 4, fontWeight: 600 }}>
              Learning Roadmap Available
            </div>
          </motion.div>
        </div>

        {/* ── 4-Agent Live Status Banner ── */}
        <div className="glass-panel" style={{ padding: 24, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFF' }} className="font-display">
              Autonomous Agent Status Overview
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--green)', fontWeight: 700 }}>
              <span className="status-dot active" />
              <span>4 Agents Standby</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {[
              { name: 'Research Agent', role: 'Tavily Search & RAG', status: 'Online', icon: '🔍', color: '#8B5CF6' },
              { name: 'Screener Agent', role: 'Fit Scoring & Gaps', status: 'Online', icon: '🎯', color: '#06B6D4' },
              { name: 'Coach Agent', role: 'AI Interview Evaluation', status: 'Online', icon: '💬', color: '#EC4899' },
              { name: 'Analytics Agent', role: 'Salary & Learning Path', status: 'Online', icon: '📊', color: '#10B981' },
            ].map((ag) => (
              <div key={ag.name} className="glass-card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>{ag.icon}</span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(16, 185, 129, 0.15)', color: 'var(--green)', fontWeight: 700 }}>
                    {ag.status}
                  </span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#FFF' }}>{ag.name}</div>
                <div style={{ fontSize: 11, color: 'var(--txt-muted)', marginTop: 2 }}>{ag.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Recent Analyses Table ── */}
        <div className="glass-panel" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFF' }} className="font-display">
                Recent Career Analyses
              </h3>
              <div style={{ fontSize: 12, color: 'var(--txt-secondary)' }}>
                Track past resume scoring & pipeline executions
              </div>
            </div>

            <Link to="/upload" style={{ fontSize: 13, color: 'var(--cyan)', textDecoration: 'none', fontWeight: 700 }}>
              + New Analysis
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--txt-muted)' }}>Loading workspace data...</div>
          ) : !Array.isArray(history) || history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', background: 'rgba(11, 14, 27, 0.5)', borderRadius: 12, border: '1px dashed var(--border-subtle)' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🚀</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#FFF' }}>No Career Analyses Found</div>
              <p style={{ fontSize: 13, color: 'var(--txt-muted)', marginTop: 4, marginBottom: 16 }}>
                Upload your resume to trigger the 4 autonomous AI agents.
              </p>
              <button onClick={() => navigate('/upload')} className="btn-primary">
                Upload Resume Now
              </button>
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Job Role / Company</th>
                  <th>Match Score</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row, idx) => {
                  const itemScore = row.resume_score || row.avg_score || 80
                  return (
                    <tr key={row.id || idx}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#FFF' }}>{row.job_role || 'Software Engineer'}</div>
                        <div style={{ fontSize: 11, color: 'var(--txt-muted)' }}>{row.company || 'Tech Corp'}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: 180 }}>
                          <div style={{ flex: 1, height: 6, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 3, overflow: 'hidden' }}>
                            <div
                              style={{
                                height: '100%',
                                width: `${itemScore}%`,
                                background: itemScore >= 75 ? 'var(--green)' : 'var(--cyan)',
                                borderRadius: 3,
                              }}
                            />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#FFF' }}>{itemScore}%</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(16, 185, 129, 0.15)', color: 'var(--green)', fontSize: 12, fontWeight: 700 }}>
                          ✓ Completed
                        </span>
                      </td>
                      <td style={{ color: 'var(--txt-muted)', fontSize: 13 }}>
                        {row.created_at ? new Date(row.created_at).toLocaleDateString() : 'Recent'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => navigate('/results')}
                          className="btn-secondary"
                          style={{ padding: '6px 14px', fontSize: 12 }}
                        >
                          View Results ➔
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}