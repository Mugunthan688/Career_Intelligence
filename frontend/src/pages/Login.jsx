import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { saveToken } from '../utils/auth'
import api from '../utils/api'

const AGENTS = [
  { title: 'Research Agent',  desc: 'Market Trends & Company Intel',  icon: '🔍', color: '#A78BFA' },
  { title: 'Screener Agent',  desc: '0–100 Match Score & Skill Gaps',  icon: '🎯', color: '#2DD4BF' },
  { title: 'Coach Agent',     desc: 'Real-time AI Practice Interviews', icon: '💬', color: '#FB7185' },
  { title: 'Analytics Agent', desc: 'Salary Benchmarks & Roadmaps',    icon: '📊', color: '#34D399' },
]

export default function Login() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [forgotStep, setForgotStep] = useState(1)
  const [resetEmail, setResetEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [sentOtpBanner, setSentOtpBanner] = useState('')
  const navigate = useNavigate()

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    const cleanEmail = email.trim().toLowerCase()
    const cleanPass = password.trim()
    if (!cleanEmail || !cleanPass) { toast.error('Please enter email and password'); return }
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email: cleanEmail, password: cleanPass })
      saveToken(res.data.access_token, res.data.role || 'job_seeker', res.data.name || 'User')
      toast.success(`Welcome back, ${res.data.name || 'User'}!`)
      navigate('/dashboard')
    } catch (err) {
      const rawDetail = err.response?.data?.detail
      let msg = 'Invalid email or password'
      if (typeof rawDetail === 'string') {
        msg = rawDetail
      } else if (Array.isArray(rawDetail)) {
        msg = rawDetail.map((d) => d.msg || JSON.stringify(d)).join(', ')
      } else if (err.message) {
        msg = err.message
      }
      toast.error(msg)
    } finally { setLoading(false) }
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    const cleanEmail = resetEmail.trim().toLowerCase()
    if (!cleanEmail) { toast.error('Please enter your registered email'); return }
    setLoading(true)
    try {
      const res = await api.post('/auth/forgot-password', { email: cleanEmail })
      const otp = res.data.otp_code
      setSentOtpBanner(otp)
      toast.info(`📩 OTP sent to ${cleanEmail}! (Code: ${otp})`, { autoClose: 10000 })
      setForgotStep(2)
    } catch (err) {
      const rawDetail = err.response?.data?.detail
      let msg = 'Failed to send OTP'
      if (typeof rawDetail === 'string') {
        msg = rawDetail
      } else if (Array.isArray(rawDetail)) {
        msg = rawDetail.map((d) => d.msg || JSON.stringify(d)).join(', ')
      } else if (err.message) {
        msg = err.message
      }
      toast.error(msg)
    } finally { setLoading(false) }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    const cleanEmail = resetEmail.trim().toLowerCase()
    const cleanOtp = otpCode.trim()
    const cleanPass = newPassword.trim()
    if (!cleanOtp || !cleanPass) { toast.error('Enter OTP and new password'); return }
    setLoading(true)
    try {
      const res = await api.post('/auth/reset-password', {
        email: cleanEmail, otp: cleanOtp, new_password: cleanPass,
      })
      toast.success(res.data.message || 'Password reset successfully!')
      setEmail(cleanEmail); setPassword(cleanPass)
      setMode('login'); setForgotStep(1); setSentOtpBanner('')
    } catch (err) {
      const rawDetail = err.response?.data?.detail
      let msg = 'Invalid OTP'
      if (typeof rawDetail === 'string') {
        msg = rawDetail
      } else if (Array.isArray(rawDetail)) {
        msg = rawDetail.map((d) => d.msg || JSON.stringify(d)).join(', ')
      } else if (err.message) {
        msg = err.message
      }
      toast.error(msg)
    } finally { setLoading(false) }
  }

  const fillDemo = (e) => { setEmail(e); setPassword('password123') }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1.05fr 0.95fr',
      background: 'var(--bg-base)',
    }}>
      {/* ── Left: Hero Panel ── */}
      <div style={{
        padding: '48px 64px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Aurora background blobs */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '60%',
          height: '60%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-5%',
          right: '5%',
          width: '50%',
          height: '50%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45,212,191,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #7C3AED 0%, #2DD4BF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              boxShadow: '0 0 20px rgba(124,58,237,0.4)',
            }}>
              ⚡
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: '#F8FAFC' }} className="font-display">
              Career Intelligence OS
            </span>
          </div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ marginBottom: 10 }}>
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--aurora-teal)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontFamily: '"JetBrains Mono", monospace',
              }}>
                ▶ MULTI-AGENT AI CAREER PLATFORM
              </span>
            </div>
            <h1 style={{
              fontSize: 42,
              fontWeight: 800,
              lineHeight: 1.12,
              marginBottom: 18,
              color: '#F8FAFC',
            }} className="font-display">
              Autonomous AI Agents<br />
              <span className="gradient-text">Engineered for Your Next Role.</span>
            </h1>
            <p style={{
              fontSize: 15,
              color: 'var(--txt-secondary)',
              lineHeight: 1.65,
              maxWidth: 500,
              marginBottom: 40,
            }}>
              Upload your resume and target job. Four specialized AI agents collaborate autonomously to audit your match score, conduct practice interviews, and generate targeted skill roadmaps.
            </p>
          </motion.div>

          {/* Agent Bento Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 520 }}>
            {AGENTS.map((agent, i) => (
              <motion.div
                key={agent.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="glass-card"
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'center',
                  borderLeft: `3px solid ${agent.color}40`,
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: `${agent.color}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  flexShrink: 0,
                }}>
                  {agent.icon}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#F8FAFC', marginBottom: 1 }}>{agent.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--txt-muted)', lineHeight: 1.3 }}>{agent.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div style={{
          fontSize: 11,
          color: 'var(--txt-muted)',
          display: 'flex',
          gap: 18,
          fontFamily: '"JetBrains Mono", monospace',
          position: 'relative',
          zIndex: 1,
        }}>
          <span>✓ LangGraph Agent Workflow</span>
          <span>✓ Pinecone RAG Search</span>
          <span>✓ JWT Secure Auth</span>
        </div>
      </div>

      {/* ── Right: Auth Form ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="glass-panel"
          style={{ width: '100%', maxWidth: 420, padding: 32 }}
        >
          {/* Mode tabs */}
          <div style={{
            display: 'flex',
            background: 'rgba(8,9,14,0.7)',
            borderRadius: 12,
            padding: 4,
            marginBottom: 28,
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            {[
              { id: 'login', label: '🔑 Sign In' },
              { id: 'forgot', label: '🛡 Reset Password' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => { setMode(tab.id); if (tab.id === 'forgot') setForgotStep(1) }}
                style={{
                  flex: 1,
                  padding: '9px 0',
                  border: 'none',
                  borderRadius: 9,
                  background: mode === tab.id
                    ? 'linear-gradient(135deg, #7C3AED 0%, #2DD4BF 100%)'
                    : 'transparent',
                  color: mode === tab.id ? '#FFF' : 'var(--txt-muted)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Login Form */}
            {mode === 'login' && (
              <motion.div key="login" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}>
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: '#F8FAFC', marginBottom: 5 }} className="font-display">
                    Welcome Back 👋
                  </h2>
                  <p style={{ fontSize: 13, color: 'var(--txt-secondary)' }}>
                    Sign in to your Career Intelligence workspace.
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--txt-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: '"JetBrains Mono", monospace' }}>
                      Email Address
                    </label>
                    <input
                      type="email" required className="glass-input"
                      placeholder="name@company.com"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: '"JetBrains Mono", monospace' }}>
                        Password
                      </label>
                      <button type="button"
                        onClick={() => { setMode('forgot'); setResetEmail(email); setForgotStep(1) }}
                        style={{ background: 'none', border: 'none', color: 'var(--aurora-teal)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <input
                      type="password" required className="glass-input"
                      placeholder="••••••••"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: 4, padding: '13px 20px' }}>
                    {loading ? 'Authenticating...' : 'Sign In to Workspace →'}
                  </button>
                </form>

                <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, fontFamily: '"JetBrains Mono", monospace' }}>
                    Quick Demo Accounts
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[
                      { label: 'Job Seeker', email: 'user@example.com', color: '#A78BFA' },
                      { label: 'Admin', email: 'admin@example.com', color: '#2DD4BF' },
                    ].map((d) => (
                      <button
                        key={d.label}
                        type="button"
                        onClick={() => fillDemo(d.email)}
                        style={{
                          flex: 1, padding: '7px 10px', borderRadius: 9,
                          background: `${d.color}14`, border: `1px solid ${d.color}30`,
                          color: d.color, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                        }}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Forgot Password Form */}
            {mode === 'forgot' && (
              <motion.div key="forgot" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--aurora-rose)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontFamily: '"JetBrains Mono", monospace' }}>
                    {forgotStep === 1 ? 'STEP 1 OF 2 — REQUEST OTP' : 'STEP 2 OF 2 — VERIFY & RESET'}
                  </div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: '#F8FAFC', marginBottom: 5 }} className="font-display">
                    {forgotStep === 1 ? 'Reset Your Password' : 'Enter Verification OTP'}
                  </h2>
                  <p style={{ fontSize: 13, color: 'var(--txt-secondary)' }}>
                    {forgotStep === 1
                      ? 'Enter your registered email to receive a 6-digit OTP code.'
                      : `Enter the OTP sent to ${resetEmail}.`}
                  </p>
                </div>

                {sentOtpBanner && (
                  <div style={{
                    padding: '10px 14px', borderRadius: 10,
                    background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)',
                    color: '#34D399', fontSize: 13, fontWeight: 700, marginBottom: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span>📩 OTP Code:</span>
                    <span style={{ fontSize: 18, letterSpacing: 4, fontFamily: '"JetBrains Mono", monospace' }}>{sentOtpBanner}</span>
                  </div>
                )}

                {forgotStep === 1 ? (
                  <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <input type="email" required className="glass-input" placeholder="name@company.com" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '13px 20px' }}>
                      {loading ? 'Sending OTP...' : '📩 Send Verification OTP'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <input type="text" required maxLength={6} className="glass-input font-mono"
                      style={{ fontSize: 18, letterSpacing: 6, textAlign: 'center' }}
                      placeholder="123456" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} />
                    <input type="password" required className="glass-input" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '13px 20px' }}>
                      {loading ? 'Verifying...' : '🔒 Verify & Reset Password'}
                    </button>
                    <button type="button" onClick={() => setForgotStep(1)} className="btn-ghost" style={{ textAlign: 'center' }}>
                      ← Re-enter Email
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ marginTop: 22, textAlign: 'center', fontSize: 13, color: 'var(--txt-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--aurora-teal)', textDecoration: 'none', fontWeight: 600 }}>
              Create Account
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}