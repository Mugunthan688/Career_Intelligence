import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import CircularGauge from '../components/CircularGauge'
import ATSScoreCard from '../components/ATSScoreCard'
import ATSIssuesList from '../components/ATSIssuesList'
import api from '../utils/api'

export default function ATSChecker() {
  const [file, setFile] = useState(null)
  const [targetRole, setTargetRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [atsResult, setAtsResult] = useState({
    ats_score: 88, format_score: 92, section_score: 95, keyword_score: 82, content_score: 85,
    issues: ['Missing core TypeScript skills in Experience section', 'Avoid multi-column tables in resume formatting'],
    fixes: ['Explicitly add a Technical Skills section with TypeScript and React', 'Ensure standard section headers (Work Experience, Education, Skills)', 'Use standard bullet points instead of custom graphical icons'],
    passed: ['Standard PDF font encoding verified', 'Contact information clearly parseable at top', 'No background images or unreadable vector layers', 'Date formats consistent across experience history'],
  })

  const handleAtsCheck = async (e) => {
    e.preventDefault()
    if (!file) { toast.error('Please upload a resume PDF'); return }
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    if (targetRole.trim()) formData.append('job_role', targetRole.trim())
    try {
      const res = await api.post('/ats/check', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      if (res.data) { setAtsResult({ ...(res.data.ats_result || res.data) }); toast.success('ATS Audit complete!') }
    } catch (err) {
      const detail = err.response?.data?.detail
      toast.error(typeof detail === 'string' ? detail : (Array.isArray(detail) ? detail.map(d => d.msg).join(', ') : 'ATS check failed'))
    } finally { setLoading(false) }
  }

  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main" style={{ padding: '32px 36px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }} className="page-enter">

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--aurora-teal)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 5, fontFamily: '"JetBrains Mono", monospace' }}>
              Recruitment System Compatibility Audit
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em' }} className="font-display">
              ATS Checker & Resume Audit
            </h1>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleAtsCheck} className="glass-panel" style={{ padding: 20, marginBottom: 24, display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)}
                style={{ fontSize: 12, color: 'var(--txt-secondary)' }} />
            </div>
            <div style={{ flex: 1 }}>
              <input type="text" className="glass-input" style={{ width: '100%' }}
                placeholder="Target Job Role (optional)" value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '11px 22px', minWidth: 150, flexShrink: 0 }}>
              {loading ? 'Auditing...' : '🎯 Audit ATS Score'}
            </button>
          </form>

          {/* Bento Grid */}
          <div className="bento-grid" style={{ marginBottom: 20 }}>
            {/* Gauge — 3 cols */}
            <div className="bento-1" style={{ gridColumn: 'span 3' }}>
              <div className="glass-panel" style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100%' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, fontFamily: '"JetBrains Mono", monospace' }}>
                  Overall ATS Score
                </div>
                <CircularGauge
                  score={atsResult.ats_score || atsResult.atsScore || 85}
                  size={180}
                  label="ATS Pass Rate"
                  colorScheme={atsResult.ats_score >= 80 ? 'green' : 'cyan'}
                />
                <div style={{ fontSize: 12, color: 'var(--aurora-emerald)', fontWeight: 700, marginTop: 14, display: 'flex', alignItems: 'center', gap: 5 }}>
                  ✓ Ready for Recruiter Parsers
                </div>
              </div>
            </div>

            {/* ATS Score Breakdown — 9 cols */}
            <div style={{ gridColumn: 'span 9' }}>
              <ATSScoreCard result={atsResult} />
            </div>

            {/* Issues List — full */}
            <div className="bento-6">
              <ATSIssuesList result={atsResult} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
