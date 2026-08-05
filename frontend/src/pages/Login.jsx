import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { saveToken } from '../utils/auth'
import api from '../utils/api'

export default function Login() {
  // Mode: 'login' | 'forgot'
  const [mode, setMode] = useState('login')
  
  // Login State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Forgot Password / OTP State
  const [forgotStep, setForgotStep] = useState(1) // 1: Send OTP, 2: Verify & Reset
  const [resetEmail, setResetEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [sentOtpBanner, setSentOtpBanner] = useState('')

  const navigate = useNavigate()

  // 1. Handle Standard Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter email and password')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      saveToken(res.data.access_token, res.data.role || 'job_seeker', res.data.name || 'User')
      toast.success(`Welcome back, ${res.data.name || 'User'}!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  // 2. Handle Send OTP Request
  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (!resetEmail.trim()) {
      toast.error('Please enter your registered email address')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/forgot-password', { email: resetEmail.trim() })
      const otp = res.data.otp_code
      setSentOtpBanner(otp)
      toast.info(`📩 Verification OTP sent to ${resetEmail}! (Code: ${otp})`, { autoClose: 10000 })
      setForgotStep(2)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to send OTP verification code')
    } finally {
      setLoading(false)
    }
  }

  // 3. Handle Verify OTP & Reset Password Submit
  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!otpCode.trim() || !newPassword.trim()) {
      toast.error('Please enter the 6-digit OTP code and new password')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/reset-password', {
        email: resetEmail.trim(),
        otp: otpCode.trim(),
        new_password: newPassword.trim(),
      })
      toast.success(res.data.message || 'Password reset successfully!')
      // Pre-fill login credentials and return to login tab
      setEmail(resetEmail.trim())
      setPassword(newPassword.trim())
      setMode('login')
      setForgotStep(1)
      setSentOtpBanner('')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid OTP code or request expired')
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
          background: 'radial-gradient(circle at 10% 20%, rgba(139, 92, 246, 0.18) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.12) 0%, transparent 50%)',
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
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }} className="font-mono">
              ▶ MULTI-AGENT AI CAREER PLATFORM
            </div>
            <h1 style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }} className="font-display text-white">
              Autonomous AI Agents <br />
              <span className="gradient-text">Engineered for Your Next Role.</span>
            </h1>
            <p style={{ fontSize: 15, color: 'var(--txt-secondary)', lineHeight: 1.6, maxWidth: 520, marginBottom: 36 }}>
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

        <div style={{ fontSize: 12, color: 'var(--txt-muted)', display: 'flex', gap: 20 }} className="font-mono">
          <span>✓ Next.js & FastAPI Architecture</span>
          <span>✓ LangGraph Agent Workflow</span>
          <span>✓ OTP Verification Security</span>
        </div>
      </div>

      {/* ── Right Sign In / Forgot Password Form Panel ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="glass-panel"
          style={{ width: '100%', maxWidth: 440, padding: 36, position: 'relative' }}
        >
          {/* Mode Switcher Tabs */}
          <div style={{ display: 'flex', background: 'rgba(8, 12, 25, 0.7)', borderRadius: 12, padding: 4, marginBottom: 26, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              type="button"
              onClick={() => setMode('login')}
              style={{
                flex: 1,
                padding: '10px 0',
                border: 'none',
                borderRadius: 8,
                background: mode === 'login' ? 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)' : 'transparent',
                color: mode === 'login' ? '#FFF' : 'var(--txt-muted)',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              🔑 Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('forgot')
                setForgotStep(1)
              }}
              style={{
                flex: 1,
                padding: '10px 0',
                border: 'none',
                borderRadius: 8,
                background: mode === 'forgot' ? 'linear-gradient(135deg, #EC4899 0%, #7C3AED 100%)' : 'transparent',
                color: mode === 'forgot' ? '#FFF' : 'var(--txt-muted)',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              🛡 Reset Password (OTP)
            </button>
          </div>

          <AnimatePresence mode="wait">
            {/* MODE 1: Standard Login Form */}
            {mode === 'login' && (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: '#FFF', marginBottom: 6 }} className="font-display">
                    Welcome Back 👋
                  </h2>
                  <p style={{ fontSize: 13, color: 'var(--txt-secondary)' }}>
                    Sign in to access your Career Intelligence OS workspace.
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }} className="font-mono">
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }} className="font-mono">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot')
                          setResetEmail(email)
                          setForgotStep(1)
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--cyan)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                      >
                        Forgot Password?
                      </button>
                    </div>
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

                  <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: 8, padding: '14px 24px', fontSize: 14 }}>
                    {loading ? 'Authenticating...' : 'Sign In to Workspace ➔'}
                  </button>
                </form>

                {/* Quick Demo Accounts */}
                <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }} className="font-mono">
                    Quick Fill Demo Accounts:
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => fillDemoUser('user@example.com')}
                      style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#C084FC', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Job Seeker
                    </button>
                    <button
                      type="button"
                      onClick={() => fillDemoUser('admin@example.com')}
                      style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.3)', color: 'var(--cyan)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Admin User
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* MODE 2: Forgot Password / OTP Verification Form */}
            {mode === 'forgot' && (
              <motion.div
                key="forgot-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--pink)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }} className="font-mono">
                    {forgotStep === 1 ? 'STEP 1 OF 2 — OTP REQUEST' : 'STEP 2 OF 2 — OTP VERIFICATION'}
                  </div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: '#FFF', marginBottom: 6 }} className="font-display">
                    {forgotStep === 1 ? 'Reset Your Password' : 'Enter Verification OTP'}
                  </h2>
                  <p style={{ fontSize: 13, color: 'var(--txt-secondary)' }}>
                    {forgotStep === 1
                      ? 'Enter your registered email to receive a 6-digit OTP code.'
                      : `Enter the 6-digit OTP code sent to ${resetEmail}.`}
                  </p>
                </div>

                {/* Sent OTP Code Banner for testing */}
                {sentOtpBanner && (
                  <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34D399', fontSize: 13, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>📩 OTP Verification Code:</span>
                    <span style={{ fontSize: 18, letterSpacing: 3, fontFamily: '"JetBrains Mono", monospace' }}>{sentOtpBanner}</span>
                  </div>
                )}

                {forgotStep === 1 ? (
                  <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }} className="font-mono">
                        Registered Email Address
                      </label>
                      <input
                        type="email"
                        required
                        className="glass-input"
                        style={{ width: '100%' }}
                        placeholder="name@company.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                      />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '14px 24px', fontSize: 14 }}>
                      {loading ? 'Sending OTP...' : '📩 Send 6-Digit Verification OTP'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }} className="font-mono">
                        6-Digit OTP Code
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        className="glass-input font-mono"
                        style={{ width: '100%', fontSize: 18, letterSpacing: 4, textAlign: 'center' }}
                        placeholder="123456"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-secondary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }} className="font-mono">
                        New Password
                      </label>
                      <input
                        type="password"
                        required
                        className="glass-input"
                        style={{ width: '100%' }}
                        placeholder="New strong password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '14px 24px', fontSize: 14 }}>
                      {loading ? 'Verifying & Resetting...' : '🔒 Verify OTP & Reset Password'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setForgotStep(1)}
                      style={{ background: 'none', border: 'none', color: 'var(--txt-muted)', fontSize: 12, cursor: 'pointer', textAlign: 'center' }}
                    >
                      ← Re-enter Email Address
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Link */}
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