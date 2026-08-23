import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import AgentStatusBar from '../components/AgentStatusBar'
import api from '../utils/api'

const PIPELINE = ['research', 'screener', 'coach', 'analytics']

export default function ResumeUpload() {
  const [file, setFile] = useState(null)
  const [jobRole, setJobRole] = useState('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeAgent, setActiveAgent] = useState(null)
  const [doneAgents, setDoneAgents] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const navigate = useNavigate()

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false)
    const f = e.dataTransfer.files?.[0]
    if (f && f.type === 'application/pdf') setFile(f)
    else toast.error('Please drop a valid PDF file')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) { toast.error('Please select a resume PDF'); return }
    if (!jobRole.trim()) { toast.error('Please specify target job role'); return }
    setLoading(true); setDoneAgents([])
    const formData = new FormData()
    formData.append('file', file)
    formData.append('job_role', jobRole.trim())
    if (company.trim()) formData.append('company', company.trim())

    const interval = setInterval(() => {
      setDoneAgents((prev) => {
        if (prev.length < PIPELINE.length) {
          const next = PIPELINE[prev.length]
          setActiveAgent(next)
          return [...prev, next]
        }
        return prev
      })
    }, 2000)

    try {
      const res = await api.post('/analyze', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      clearInterval(interval); setDoneAgents(PIPELINE); setActiveAgent(null)
      sessionStorage.setItem('agent_results', JSON.stringify(res.data?.results || res.data))
      toast.success('Agent pipeline analysis completed!')
      navigate('/results')
    } catch (err) {
      clearInterval(interval)
      const detail = err.response?.data?.detail
      toast.error(typeof detail === 'string' ? detail : (Array.isArray(detail) ? detail.map(d => d.msg).join(', ') : 'Analysis pipeline failed'))
    } finally { setLoading(false); setActiveAgent(null) }
  }

  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main" style={{ padding: '32px 36px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }} className="page-enter">

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--aurora-teal)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 5, fontFamily: '"JetBrains Mono", monospace' }}>
              Step 1 of 2 — Input Specifications
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em' }} className="font-display">
              Analyze Resume & Job Description
            </h1>
            <p style={{ fontSize: 13, color: 'var(--txt-secondary)', marginTop: 4 }}>
              Upload your resume and target role to deploy the 4-agent autonomous pipeline.
            </p>
          </div>

          {(loading || doneAgents.length > 0) && (
            <div style={{ marginBottom: 24 }}>
              <AgentStatusBar activeAgent={activeAgent} doneAgents={doneAgents} />
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Dropzone */}
            <div
              className="glass-panel"
              onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
              style={{
                padding: '44px 40px',
                textAlign: 'center',
                border: dragActive
                  ? '2px dashed var(--aurora-violet)'
                  : '2px dashed rgba(255,255,255,0.08)',
                cursor: 'pointer',
                background: dragActive ? 'rgba(167,139,250,0.04)' : 'rgba(8,9,14,0.3)',
                transition: 'all 0.2s ease',
              }}
            >
              <input type="file" accept=".pdf" id="resume-file" style={{ display: 'none' }}
                onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <label htmlFor="resume-file" style={{ cursor: 'pointer', display: 'block' }}>
                <div style={{ fontSize: 44, marginBottom: 12, opacity: 0.8 }}>📄</div>
                {file ? (
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--aurora-emerald)' }}>
                      ✓ {file.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--txt-muted)', marginTop: 4 }}>
                      {(file.size / 1024).toFixed(1)} KB — Click or drag to replace
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC', marginBottom: 4 }}>
                      Drag and drop your Resume PDF
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--txt-muted)' }}>or click to browse files</div>
                  </div>
                )}
              </label>
            </div>

            {/* Input Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--txt-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: '"JetBrains Mono", monospace' }}>
                  Target Job Role *
                </label>
                <input type="text" className="glass-input" placeholder="e.g. Senior Frontend Engineer"
                  value={jobRole} onChange={(e) => setJobRole(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--txt-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: '"JetBrains Mono", monospace' }}>
                  Company Name <span style={{ opacity: 0.5 }}>(Optional)</span>
                </label>
                <input type="text" className="glass-input" placeholder="e.g. Google, Stripe, Meta"
                  value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '15px 28px', fontSize: 15, fontWeight: 700, gap: 10 }}>
              {loading ? (
                <><span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#FFF', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Running Agent Pipeline...</>
              ) : '⚡ Deploy Agent Pipeline & Analyze'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}