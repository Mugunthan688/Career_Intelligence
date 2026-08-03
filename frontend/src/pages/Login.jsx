import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { saveToken } from '../utils/auth'
import api from '../utils/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter email and password')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      saveToken(res.data.access_token, res.data.role || 'job_seeker', res.data.name || 'User')
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const fillDemoUser = (userEmail) => {
    setEmail(userEmail)
    setPassword('password123')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', background: 'var(--bg-base)' }}>
      {/* ── Left Hero Panel ── */}
      <div
        style={{
          padding: '60px 80px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'radial-gradient(circle at 10% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)',
          borderRight: '1px solid var(--border-subtle)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                boxShadow: '0 0 25px rgba(139, 92, 246, 0.6)',
              }}
            >
              ⚡
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }} className="font-display gradient-text">
              Career Intelligence OS
            </span>
          </div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
              Multi-Agent AI Career Guidance Platform
            </div>
            <h1 style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }} className="font-display text-white">
              Autonomous AI Agents <br />
              <span className="gradient-text">Engineered for Your Next Role.</span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--txt-secondary)', lineHeight: 1.6, maxWidth: 520, marginBottom: 40 }}>
              Upload your resume and target job. Four specialized AI agents collaborate autonomously to audit your match score, scrape job descriptions, conduct practice interviews, and generate targeted skill roadmaps.
            </p>
          </motion.div>

          {/* 4 Agent Showcase Chips */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, maxWidth: 540 }}>
            {[
              { title: 'Research Agent', desc: 'Market Trends & Company Intelligence', icon: '🔍', color: '#8B5CF6' },
              { title: 'Screener Agent', desc: '0-100 Match Scoring & Skill Gaps', icon: '🎯', color: '#06B6D4' },
              { title: 'Coach Agent', desc: 'Real-time AI Practice Interviews', icon: '💬', color: '#EC4899' },
              { title: 'Analytics Agent', desc: 'Salary Benchmarks & Roadmaps', icon: '📊', color: '#10B981' },
            ].map((agent) => (
              <div
                key={agent.title}
                className="glass-card"
                style={{ padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'center' }}
              >
                <div style={{ fontSize: 22 }}>{agent.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#FFF' }}>{agent.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--txt-muted)', marginTop: 2 }}>{agent.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 12, color: 'var(--txt-muted)', display: 'flex', gap: 20 }}>
          <span>✓ Next.js & FastAPI Architecture</span>
          <span>✓ LangGraph Agent Workflow</span>
          <span>✓ Groq LLM Powered</span>
        </div>
      </div>

      {/* ── Right Sign In Form Panel ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="glass-panel"
          style={{ width: '100%', maxWidth: 440, padding: 40 }}
        >
          <div style={{ marginBottom: 30 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#FFF', marginBottom: 8 }} className="font-display">
              Welcome Back
            </h2>
            <p style={{ fontSize: 14, color: 'var(--txt-secondary)' }}>
              Sign in to access your Career Intelligence OS workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt-secondary)', display: 'block', marginBottom: 8 }}>
                Email Address
              </label>
              <input
                type="email"
                required
                className="glass-input"
                style={{ width: '100%' }}
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt-secondary)', display: 'block', marginBottom: 8 }}>
                Password
              </label>
              <input
                type="password"
                required
                className="glass-input"
                style={{ width: '100%' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: 10, padding: '14px 24px' }}>
              {loading ? 'Authenticating...' : 'Sign In to Workspace ➔'}
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              Quick Fill Demo Accounts:
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => fillDemoUser('user@example.com')}
                style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: 'rgba(139, 92, 246, 0.1)', border: '1px solid var(--border-subtle)', color: 'var(--txt-secondary)', fontSize: 12, cursor: 'pointer' }}
              >
                Job Seeker
              </button>
              <button
                type="button"
                onClick={() => fillDemoUser('admin@example.com')}
                style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: 'rgba(6, 182, 212, 0.1)', border: '1px solid var(--border-subtle)', color: 'var(--txt-secondary)', fontSize: 12, cursor: 'pointer' }}
              >
                Admin User
              </button>
            </div>
          </div>

          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: 'var(--txt-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--cyan)', textDecoration: 'none', fontWeight: 700 }}>
              Create Account
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}