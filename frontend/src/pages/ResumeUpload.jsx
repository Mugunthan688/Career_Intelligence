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
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const f = e.dataTransfer.files?.[0]
    if (f && f.type === 'application/pdf') {
      setFile(f)
    } else {
      toast.error('Please drop a valid PDF file')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      toast.error('Please select a resume PDF file')
      return
    }
    if (!jobRole.trim()) {
      toast.error('Please specify target job role')
      return
    }

    setLoading(true)
    setDoneAgents([])
    const formData = new FormData()
    formData.append('file', file)
    formData.append('job_role', jobRole.trim())
    if (company.trim()) formData.append('company', company.trim())

    // Visual node progress stepper during API execution
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
      const res = await api.post('/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      clearInterval(interval)
      setDoneAgents(PIPELINE)
      setActiveAgent(null)

      const payload = res.data?.results || res.data
      sessionStorage.setItem('agent_results', JSON.stringify(payload))
      toast.success('Agent pipeline analysis completed!')
      navigate('/results')
    } catch (err) {
      clearInterval(interval)
      const detail = err.response?.data?.detail
      const msg = typeof detail === 'string'
        ? detail
        : (Array.isArray(detail) ? detail.map(d => d.msg).join(', ') : 'Analysis pipeline execution failed')
      toast.error(msg)
    } finally {
      setLoading(false)
      setActiveAgent(null)
    }
  }

  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main" style={{ padding: '32px 40px' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }} className="page-enter">
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              Step 1 of 2 — Input Specifications
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#FFF' }} className="font-display">
              Analyze Resume & Job Description
            </h1>
            <p style={{ fontSize: 14, color: 'var(--txt-secondary)', marginTop: 4 }}>
              Upload your resume and target role to deploy the 4-agent autonomous pipeline.
            </p>
          </div>

          {/* Connected Node Graph Status Bar (Shown during or after execution) */}
          {(loading || doneAgents.length > 0) && (
            <AgentStatusBar activeAgent={activeAgent} doneAgents={doneAgents} />
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* File Dropzone */}
            <div
              className={`glass-panel ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              style={{
                padding: 40,
                textAlign: 'center',
                border: dragActive ? '2px dashed var(--purple)' : '2px dashed rgba(255, 255, 255, 0.12)',
                borderRadius: 16,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: dragActive ? 'rgba(139, 92, 246, 0.05)' : 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <input
                type="file"
                accept=".pdf"
                id="resume-file-input"
                style={{ display: 'none' }}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <label htmlFor="resume-file-input" style={{ cursor: 'pointer' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
                {file ? (
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--green)' }}>
                      ✓ Selected: {file.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--txt-muted)', marginTop: 4 }}>
                      {(file.size / 1024).toFixed(1)} KB — Click or drag to replace
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#FFF' }}>
                      Drag and drop your Resume PDF here
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--txt-secondary)', marginTop: 4 }}>
                      or click to browse local files
                    </div>
                  </div>
                )}
              </label>
            </div>

            {/* Inputs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--txt-secondary)', marginBottom: 8 }}>
                  Target Job Role *
                </label>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--txt-secondary)', marginBottom: 8 }}>
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="e.g. Google, Stripe, Meta"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                padding: '16px 32px',
                fontSize: 16,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                marginTop: 8,
              }}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Running Agent Pipeline...
                </>
              ) : (
                <>
                  ⚡ Deploy Agent Pipeline & Analyze
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}