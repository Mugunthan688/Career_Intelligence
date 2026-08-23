import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import { getName, getRole } from '../utils/auth'
import api from '../utils/api'

const AGENTS = [
  { name: 'Research Agent',  role: 'Tavily Search & RAG',      icon: '🔍', color: '#A78BFA', accentDim: 'rgba(167,139,250,0.08)' },
  { name: 'Screener Agent',  role: 'Fit Scoring & Skill Gaps', icon: '🎯', color: '#2DD4BF', accentDim: 'rgba(45,212,191,0.08)' },
  { name: 'Coach Agent',     role: 'AI Interview Evaluation',  icon: '💬', color: '#FB7185', accentDim: 'rgba(251,113,133,0.08)' },
  { name: 'Analytics Agent', role: 'Salary & Learning Path',   icon: '📊', color: '#34D399', accentDim: 'rgba(52,211,153,0.08)' },
]

const QUICK_ACTIONS = [
  { to: '/upload',    label: 'Analyze Resume',    icon: '⬆', color: '#A78BFA' },
  { to: '/ats',       label: 'ATS Checker',       icon: '🎯', color: '#2DD4BF' },
  { to: '/coach',     label: 'Practice Interview', icon: '💬', color: '#FB7185' },
  { to: '/analytics', label: 'View Analytics',    icon: '▦', color: '#34D399' },
]

function StatCard({ value, label, sub, subColor, icon, delay, accentColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bento-tile"
      style={{ borderTop: `2px solid ${accentColor}40` }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: `${accentColor}14`,
          border: `1px solid ${accentColor}25`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 17,
        }}>
          {icon}
        </div>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: '"JetBrains Mono", monospace' }}>
          {label}
        </div>
      </div>
      <div style={{ fontSize: 40, fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.03em', lineHeight: 1 }} className="font-outfit">
        {value}
      </div>
      <div style={{ fontSize: 11, color: subColor, fontWeight: 600, marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
        {sub}
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const name = getName() || 'User'
  const role = getRole() || 'job_seeker'
  const navigate = useNavigate()

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/history')
        const list = res.data?.sessions || (Array.isArray(res.data) ? res.data : [])
        setHistory(list)
      } catch { setHistory([]) }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  const totalAnalyses = Array.isArray(history) ? history.length : 0
  const avgScore = totalAnalyses > 0
    ? Math.round(history.reduce((acc, h) => acc + (h.resume_score || h.avg_score || 0), 0) / totalAnalyses)
    : 82
  const totalGaps = Array.isArray(history)
    ? (history.reduce((acc, h) => acc + (h.missing_skills?.length || 0), 0) || 5)
    : 5

  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main" style={{ padding: '32px 36px' }}>

        {/* ── Top Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }} className="page-enter">
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--aurora-teal)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 5, fontFamily: '"JetBrains Mono", monospace' }}>
              Workspace Overview
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em' }} className="font-display">
              Welcome back, <span className="gradient-text-aurora">{name}</span> 👋
            </h1>
            <p style={{ fontSize: 13, color: 'var(--txt-secondary)', marginTop: 4 }}>
              Your autonomous AI career intelligence platform is ready.
            </p>
          </div>
          <button onClick={() => navigate('/upload')} className="btn-primary" style={{ padding: '12px 24px', fontSize: 14 }}>
            ⚡ Start New Analysis
          </button>
        </div>

        {/* ── Bento Grid ── */}
        <div className="bento-grid" style={{ marginBottom: 20 }}>

          {/* Stat Cards — 4col each (3 stats across 12 cols) */}
          <div className="bento-1">
            <StatCard
              value={totalAnalyses}
              label="Total Analyses"
              sub="↑ Agent pipeline ready"
              subColor="var(--aurora-emerald)"
              icon="📊"
              delay={0.05}
              accentColor="#34D399"
            />
          </div>
          <div className="bento-1">
            <StatCard
              value={`${avgScore}%`}
              label="Avg Match Score"
              sub="★ Top candidate range"
              subColor="var(--aurora-teal)"
              icon="🎯"
              delay={0.1}
              accentColor="#2DD4BF"
            />
          </div>
          <div className="bento-1">
            <StatCard
              value={totalGaps}
              label="Skills Gap"
              sub="Roadmap available"
              subColor="var(--aurora-rose)"
              icon="⚠"
              delay={0.15}
              accentColor="#FB7185"
            />
          </div>

          {/* Quick Actions — 3col */}
          <div className="bento-1">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bento-tile"
              style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: '"JetBrains Mono", monospace', marginBottom: 4 }}>
                Quick Actions
              </div>
              {QUICK_ACTIONS.map((qa) => (
                <Link
                  key={qa.to}
                  to={qa.to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 9,
                    padding: '9px 12px',
                    borderRadius: 10,
                    background: `${qa.color}10`,
                    border: `1px solid ${qa.color}22`,
                    textDecoration: 'none',
                    color: qa.color,
                    fontSize: 12,
                    fontWeight: 600,
                    transition: 'all 0.18s ease',
                  }}
                >
                  <span style={{ fontSize: 15 }}>{qa.icon}</span>
                  {qa.label}
                </Link>
              ))}
            </motion.div>
          </div>

          {/* Agent Status — span 8 (full remaining row) */}
          <div className="bento-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="bento-tile bento-tile-aurora"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: '"JetBrains Mono", monospace', marginBottom: 3 }}>
                    Agent Network
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#F8FAFC' }} className="font-display">
                    Autonomous Agent Status
                  </h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 12px', borderRadius: 20, background: 'rgba(52,211,153,0.10)', border: '1px solid rgba(52,211,153,0.20)' }}>
                  <span className="status-dot active" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--aurora-emerald)' }}>4 Agents Online</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {AGENTS.map((ag) => (
                  <div key={ag.name} className="glass-card" style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 9,
                        background: ag.accentDim,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16,
                      }}>
                        {ag.icon}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: ag.color,
                          boxShadow: `0 0 6px ${ag.color}80`,
                          animation: 'soft-pulse 2.5s ease-in-out infinite',
                        }} />
                        <span style={{ fontSize: 9, color: ag.color, fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }}>LIVE</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC', marginBottom: 2 }}>{ag.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--txt-muted)' }}>{ag.role}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Analyses — full width */}
          <div className="bento-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="bento-tile"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: '"JetBrains Mono", monospace', marginBottom: 3 }}>
                    Pipeline History
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#F8FAFC' }} className="font-display">
                    Recent Career Analyses
                  </h3>
                </div>
                <Link to="/upload" className="btn-secondary" style={{ padding: '8px 16px', fontSize: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  + New Analysis
                </Link>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--txt-muted)', fontSize: 13 }}>
                  <div className="aurora-shimmer" style={{ height: 3, borderRadius: 2, marginBottom: 16 }} />
                  Loading workspace data...
                </div>
              ) : !Array.isArray(history) || history.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '48px 0',
                  borderRadius: 14,
                  border: '1px dashed rgba(255,255,255,0.07)',
                  background: 'rgba(8,9,14,0.4)',
                }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>🚀</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC', marginBottom: 5 }}>No Analyses Yet</div>
                  <p style={{ fontSize: 13, color: 'var(--txt-muted)', marginBottom: 18 }}>
                    Upload your resume to trigger the 4 autonomous AI agents.
                  </p>
                  <button onClick={() => navigate('/upload')} className="btn-primary" style={{ padding: '10px 20px' }}>
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
                            <div style={{ fontWeight: 600, color: '#F8FAFC', fontSize: 13 }}>{row.job_role || 'Software Engineer'}</div>
                            <div style={{ fontSize: 11, color: 'var(--txt-muted)', marginTop: 2 }}>{row.company || 'Tech Corp'}</div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, maxWidth: 160 }}>
                              <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                                <div style={{
                                  height: '100%',
                                  width: `${itemScore}%`,
                                  background: itemScore >= 75
                                    ? 'linear-gradient(90deg, #34D399, #2DD4BF)'
                                    : 'linear-gradient(90deg, #A78BFA, #2DD4BF)',
                                  borderRadius: 2,
                                }} />
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 700, color: itemScore >= 75 ? 'var(--aurora-emerald)' : 'var(--aurora-teal)' }}>
                                {itemScore}%
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className="pill-green" style={{ fontSize: 11, padding: '3px 9px', borderRadius: 8, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              ✓ Completed
                            </span>
                          </td>
                          <td style={{ color: 'var(--txt-muted)', fontSize: 12 }}>
                            {row.created_at ? new Date(row.created_at).toLocaleDateString() : 'Recent'}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button onClick={() => navigate('/results')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 11 }}>
                              View →
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  )
}