import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import api from '../utils/api'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('job_seeker')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()
    const cleanPass = password.trim()

    if (!cleanName || !cleanEmail || !cleanPass) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/register', { name: cleanName, email: cleanEmail, password: cleanPass, role })
      toast.success('Registration successful! Please sign in.')
      navigate('/login')
    } catch (err) {
      const rawDetail = err.response?.data?.detail
      let msg = 'Registration failed'
      if (typeof rawDetail === 'string') {
        msg = rawDetail
      } else if (Array.isArray(rawDetail)) {
        msg = rawDetail.map((d) => d.msg || JSON.stringify(d)).join(', ')
      } else if (err.message) {
        msg = err.message
      }
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', padding: 20 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel"
        style={{ width: '100%', maxWidth: 480, padding: 40 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #A78BFA 0%, #2DD4BF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              margin: '0 auto 16px',
              boxShadow: '0 0 22px rgba(167,139,250,0.35)',
            }}
          >
            ⚡
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em' }} className="font-display">
            Create Your Account
          </h2>
          <p style={{ fontSize: 13, color: 'var(--txt-secondary)', marginTop: 4 }}>
            Join Career Intelligence OS & deploy your autonomous AI career agents
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--txt-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: '"JetBrains Mono", monospace' }}>
              Full Name
            </label>
            <input
              type="text"
              required
              className="glass-input"
              style={{ width: '100%' }}
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--txt-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: '"JetBrains Mono", monospace' }}>
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
            <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--txt-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: '"JetBrains Mono", monospace' }}>
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

          {/* Account Role Selector */}
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--txt-muted)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: '"JetBrains Mono", monospace' }}>
              Account Type
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { id: 'job_seeker', title: 'Job Seeker', icon: '👤', desc: 'Full AI Suite & Coach' },
                { id: 'recruiter', title: 'Recruiter', icon: '🎯', desc: 'Candidate Screening' },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setRole(item.id)}
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    background: role === item.id ? 'rgba(167,139,250,0.15)' : 'rgba(13,15,24,0.7)',
                    border: `1px solid ${role === item.id ? 'rgba(167,139,250,0.45)' : 'rgba(255,255,255,0.06)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: role === item.id ? '0 0 14px rgba(167,139,250,0.2)' : 'none',
                  }}
                >
                  <div style={{ fontSize: 18 }}>{item.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#FFF', marginTop: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--txt-muted)' }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: 10, padding: '14px 24px' }}>
            {loading ? 'Creating Account...' : 'Create Free Account ➔'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: 'var(--txt-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--aurora-teal)', textDecoration: 'none', fontWeight: 700 }}>
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  )
}