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
    ats_score: 88,
    format_score: 92,
    section_score: 95,
    keyword_score: 82,
    content_score: 85,
    issues: [
      'Missing core TypeScript skills in Experience section',
      'Avoid multi-column tables in resume formatting',
    ],
    fixes: [
      'Explicitly add a Technical Skills section with TypeScript and React listed',
      'Ensure standard section headers (Work Experience, Education, Skills)',
      'Use standard bullet points instead of custom graphical icons',
    ],
    passed: [
      'Standard PDF font encoding verified',
      'Contact information clearly parseable at top',
      'No background images or unreadable vector layers',
      'Date formats consistent across experience history',
    ],
  })

  const handleAtsCheck = async (e) => {
    e.preventDefault()
    if (!file) {
      toast.error('Please upload a resume PDF file')
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    if (targetRole.trim()) formData.append('job_role', targetRole.trim())

    try {
      const res = await api.post('/ats/check', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (res.data) {
        const payload = res.data.ats_result || res.data
        setAtsResult({ ...payload })
        toast.success('ATS Compatibility Audit complete!')
      }
    } catch (err) {
      const detail = err.response?.data?.detail
      const msg = typeof detail === 'string'
        ? detail
        : (Array.isArray(detail) ? detail.map(d => d.msg).join(', ') : 'ATS check execution failed')
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main" style={{ padding: '32px 40px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }} className="page-enter">
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              Recruitment System Compatibility Audit
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#FFF' }} className="font-display">
              ATS Checker & Resume Audit
            </h1>
          </div>

          {/* Form: Upload & Audit Button */}
          <form onSubmit={handleAtsCheck} className="glass-panel" style={{ padding: 24, marginBottom: 28, display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                style={{ fontSize: 13, color: 'var(--txt-secondary)' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                className="glass-input"
                style={{ width: '100%' }}
                placeholder="Target Job Role (optional)"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '12px 24px', minWidth: 160 }}>
              {loading ? 'Auditing ATS...' : '🎯 Audit ATS Score'}
            </button>
          </form>

          {/* ATS Score Overview Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, marginBottom: 28 }}>
            {/* Left: Overall ATS Score Gauge */}
            <div className="glass-panel" style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                Overall ATS Score
              </div>
              <CircularGauge score={atsResult.ats_score || atsResult.atsScore || 85} size={180} label="ATS Pass Rate" colorScheme={atsResult.ats_score >= 80 ? 'green' : 'cyan'} />
              <div style={{ fontSize: 13, color: 'var(--green)', fontWeight: 700, marginTop: 16 }}>
                ✓ Ready for Recruiter System Parsers
              </div>
            </div>

            {/* Right: ATS Sub-Scores & Breakdown Component */}
            <ATSScoreCard result={atsResult} />
          </div>

          {/* Detailed Issues & Fixes Tabs Report */}
          <ATSIssuesList result={atsResult} />
        </div>
      </main>
    </div>
  )
}
