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
    <div className="glass-panel" style={{ padding: 24, borderColor: 'var(--border-mid)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              color: 'var(--cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}
          >
            ⚡
          </div>
          <div>
            <h4 style={{ fontSize: 16, fontWeight: 800, color: '#FFF' }} className="font-display">
              Job Description Auto-Scraper
            </h4>
            <div style={{ fontSize: 11, color: 'var(--txt-secondary)' }}>
              Auto-extract role, company & skills from link or text
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(6, 8, 16, 0.6)', padding: 3, borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'url' ? 'var(--violet)' : 'transparent',
              color: activeTab === 'url' ? '#FFF' : 'var(--txt-muted)',
              transition: 'all 0.2s ease',
            }}
          >
            Paste URL
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'text' ? 'var(--violet)' : 'transparent',
              color: activeTab === 'text' ? '#FFF' : 'var(--txt-muted)',
              transition: 'all 0.2s ease',
            }}
          >
            Paste Raw Text
          </button>
        </div>
      </div>

      <form onSubmit={handleExtract} style={{ display: 'flex', gap: 12 }}>
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
            style={{ flex: 1, height: 75, resize: 'vertical' }}
            placeholder="Paste complete job description text here..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
        )}

        <button type="submit" className="btn-primary" disabled={loading} style={{ height: activeTab === 'url' ? 'auto' : 75, minWidth: 140 }}>
          {loading ? 'Extracting...' : '⚡ Auto-Scrape'}
        </button>
      </form>

      {/* Extracted Details Box */}
      {extracted && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: 16,
            padding: 16,
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ✓ Extracted Successfully
            </span>
            <span style={{ fontSize: 11, color: 'var(--txt-muted)' }}>Auto-filled below</span>
          </div>

          <div style={{ display: 'flex', gap: 20, fontSize: 13, color: '#FFF', fontWeight: 600 }}>
            <div>
              <span style={{ color: 'var(--txt-muted)', fontWeight: 500 }}>Role: </span>
              {extracted.job_role || 'N/A'}
            </div>
            {extracted.company && (
              <div>
                <span style={{ color: 'var(--txt-muted)', fontWeight: 500 }}>Company: </span>
                {extracted.company}
              </div>
            )}
          </div>

          {extracted.required_skills?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              {extracted.required_skills.slice(0, 8).map((sk) => (
                <span key={sk} style={{ padding: '3px 8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: 6, fontSize: 11, color: 'var(--cyan)' }}>
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