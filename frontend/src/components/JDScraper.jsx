import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import api from '../utils/api'

export default function JDScraper({ onExtracted }) {
  const [activeTab, setActiveTab] = useState('url') // 'url' | 'text'
  const [url, setUrl] = useState('')
  const [rawText, setRawText] = useState('')
  const [loading, setLoading] = useState(false)
  const [extracted, setExtracted] = useState(null)

  const handleExtract = async (e) => {
    e?.preventDefault()
    if (activeTab === 'url' && !url.trim()) {
      toast.error('Please enter a job posting URL')
      return
    }
    if (activeTab === 'text' && !rawText.trim()) {
      toast.error('Please paste job description text')
      return
    }

    setLoading(true)
    try {
      const payload = activeTab === 'url' ? { url: url.trim() } : { text: rawText.trim() }
      const res = await api.post('/jd/extract', payload)
      if (res.data) {
        setExtracted(res.data)
        if (onExtracted) onExtracted(res.data)
        toast.success(`Extracted Job Role: ${res.data.job_role || 'Success'}`)
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to extract job details')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-panel" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: 'rgba(45,212,191,0.12)',
              border: '1px solid rgba(45,212,191,0.25)',
              color: 'var(--aurora-teal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
            }}
          >
            ⚡
          </div>
          <div>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC' }} className="font-display">
              Job Description Auto-Extractor
            </h4>
            <div style={{ fontSize: 11, color: 'var(--txt-muted)' }}>
              Auto-extract role, company & skills from link or text
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(8,9,14,0.6)', padding: 3, borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'url' ? 'var(--aurora-violet)' : 'transparent',
              color: activeTab === 'url' ? '#FFF' : 'var(--txt-muted)',
              transition: 'all 0.18s ease',
            }}
          >
            Paste URL
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'text' ? 'var(--aurora-violet)' : 'transparent',
              color: activeTab === 'text' ? '#FFF' : 'var(--txt-muted)',
              transition: 'all 0.18s ease',
            }}
          >
            Paste Raw Text
          </button>
        </div>
      </div>

      <form onSubmit={handleExtract} style={{ display: 'flex', gap: 10 }}>
        {activeTab === 'url' ? (
          <input
            type="url"
            className="glass-input"
            style={{ flex: 1 }}
            placeholder="https://linkedin.com/jobs/view/... or company career link"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        ) : (
          <textarea
            className="glass-input"
            style={{ flex: 1, height: 72, resize: 'vertical' }}
            placeholder="Paste complete job description text here..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
        )}

        <button type="submit" className="btn-primary" disabled={loading} style={{ height: activeTab === 'url' ? 'auto' : 72, minWidth: 130, padding: '0 16px', fontSize: 13 }}>
          {loading ? 'Extracting...' : '⚡ Extract'}
        </button>
      </form>

      {/* Extracted Details Box */}
      {extracted && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: 14,
            padding: 14,
            background: 'rgba(52,211,153,0.06)',
            border: '1px solid rgba(52,211,153,0.2)',
            borderRadius: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--aurora-emerald)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: '"JetBrains Mono", monospace' }}>
              ✓ Extracted Successfully
            </span>
            <span style={{ fontSize: 10, color: 'var(--txt-muted)' }}>Auto-filled below</span>
          </div>

          <div style={{ display: 'flex', gap: 18, fontSize: 12, color: '#F8FAFC', fontWeight: 600 }}>
            <div>
              <span style={{ color: 'var(--txt-muted)', fontWeight: 400 }}>Role: </span>
              {extracted.job_role || 'N/A'}
            </div>
            {extracted.company && (
              <div>
                <span style={{ color: 'var(--txt-muted)', fontWeight: 400 }}>Company: </span>
                {extracted.company}
              </div>
            )}
          </div>

          {extracted.required_skills?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
              {extracted.required_skills.slice(0, 8).map((sk) => (
                <span key={sk} className="pill-teal" style={{ padding: '2px 7px', borderRadius: 6, fontSize: 10 }}>
                  {sk}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}