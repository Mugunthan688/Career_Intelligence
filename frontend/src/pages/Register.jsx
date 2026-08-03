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
    if (!name || !email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/register', { name, email, password, role })
      toast.success('Registration successful! Please sign in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
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
              borderRadius: 16,
              background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              margin: '0 auto 16px',
              boxShadow: '0 0 25px rgba(139, 92, 246, 0.5)',
            }}
          >
            ⚡
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#FFF' }} className="font-display">
            Create Your Account
          </h2>
          <p style={{ fontSize: 13, color: 'var(--txt-secondary)', marginTop: 4 }}>
            Join Career Intelligence OS & deploy your autonomous AI career agents
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt-secondary)', display: 'block', marginBottom: 6 }}>
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
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt-secondary)', display: 'block', marginBottom: 6 }}>
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
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt-secondary)', display: 'block', marginBottom: 6 }}>
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
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt-secondary)', display: 'block', marginBottom: 8 }}>
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
                    background: role === item.id ? 'rgba(139, 92, 246, 0.2)' : 'rgba(16, 21, 40, 0.7)',
                    border: `1px solid ${role === item.id ? 'var(--violet)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: role === item.id ? '0 0 15px rgba(139, 92, 246, 0.3)' : 'none',
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
          <Link to="/login" style={{ color: 'var(--cyan)', textDecoration: 'none', fontWeight: 700 }}>
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  )
}