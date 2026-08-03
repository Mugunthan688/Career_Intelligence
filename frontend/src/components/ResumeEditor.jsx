import React, { useState } from 'react'

export default function ResumeEditor({ resumeData, onChange }) {
  const [activeTab, setActiveTab] = useState('header')

  if (!resumeData) return null

  const handleFieldChange = (field, val) => {
    onChange({ ...resumeData, [field]: val })
  }

  const handleListChange = (field, index, val) => {
    const list = [...(resumeData[field] || [])]
    list[index] = val
    onChange({ ...resumeData, [field]: list })
  }

  const handleAddListItem = (field) => {
    const list = [...(resumeData[field] || []), '']
    onChange({ ...resumeData, [field]: list })
  }

  const handleRemoveListItem = (field, index) => {
    const list = [...(resumeData[field] || [])]
    list.splice(index, 1)
    onChange({ ...resumeData, [field]: list })
  }

  return (
    <div
      style={{
        background: '#0F172A',
        border: '1px solid rgba(176,110,255,0.15)',
        borderRadius: 16,
        padding: 20,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 16, color: '#F0F2FF', margin: 0 }}>
          ✏️ Edit Resume Content
        </h3>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#10B981', letterSpacing: 1.5 }}>
          LIVE SYNCHRONIZED
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.08)', pb: 8, overflowX: 'auto' }}>
        {[
          { id: 'header', label: 'Header' },
          { id: 'summary', label: 'Summary' },
          { id: 'skills', label: 'Skills' },
          { id: 'experience', label: 'Experience' },
          { id: 'improvements', label: 'AI Fixes' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === t.id ? 'rgba(176,110,255,0.15)' : 'transparent',
              color: activeTab === t.id ? '#B06EFF' : '#475569',
              fontWeight: activeTab === t.id ? 700 : 500,
              fontSize: 12,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Header Tab ── */}
      {activeTab === 'header' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'Full Name', field: 'name' },
            { label: 'Email Address', field: 'email' },
            { label: 'Phone Number', field: 'phone' },
            { label: 'Location', field: 'location' },
            { label: 'LinkedIn / Portfolio', field: 'linkedin' },
          ].map(f => (
            <div key={f.field}>
              <label style={{ display: 'block', fontSize: 10, color: '#B06EFF', fontFamily: '"JetBrains Mono", monospace', marginBottom: 4 }}>
                {f.label.toUpperCase()}
              </label>
              <input
                value={resumeData[f.field] || ''}
                onChange={e => handleFieldChange(f.field, e.target.value)}
                className="neon-input"
                style={{ width: '100%', padding: '8px 12px', fontSize: 13 }}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Summary Tab ── */}
      {activeTab === 'summary' && (
        <div>
          <label style={{ display: 'block', fontSize: 10, color: '#B06EFF', fontFamily: '"JetBrains Mono", monospace', marginBottom: 4 }}>
            PROFESSIONAL SUMMARY
          </label>
          <textarea
            value={resumeData.summary || ''}
            onChange={e => handleFieldChange('summary', e.target.value)}
            className="neon-input"
            rows={6}
            style={{ width: '100%', padding: '10px 12px', fontSize: 13, resize: 'vertical', lineHeight: 1.5 }}
          />
        </div>
      )}

      {/* ── Skills Tab ── */}
      {activeTab === 'skills' && (
        <div>
          <label style={{ display: 'block', fontSize: 10, color: '#B06EFF', fontFamily: '"JetBrains Mono", monospace', marginBottom: 8 }}>
            TECHNICAL & SOFT SKILLS (ONE PER ITEM)
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(resumeData.skills || []).map((skill, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 8 }}>
                <input
                  value={skill}
                  onChange={e => handleListChange('skills', idx, e.target.value)}
                  className="neon-input"
                  style={{ flex: 1, padding: '6px 10px', fontSize: 12 }}
                />
                <button
                  onClick={() => handleRemoveListItem('skills', idx)}
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', borderRadius: 6, padding: '0 10px', cursor: 'pointer' }}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() => handleAddListItem('skills')}
              style={{
                marginTop: 6,
                padding: '8px',
                borderRadius: 8,
                background: 'rgba(176,110,255,0.08)',
                border: '1px dashed rgba(176,110,255,0.25)',
                color: '#B06EFF',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              + Add Skill
            </button>
          </div>
        </div>
      )}

      {/* ── Experience Tab ── */}
      {activeTab === 'experience' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={{ display: 'block', fontSize: 10, color: '#B06EFF', fontFamily: '"JetBrains Mono", monospace' }}>
            WORK EXPERIENCE & HIGHLIGHTS
          </label>
          {(resumeData.experience || []).map((exp, idx) => {
            const expText = typeof exp === 'object' ? `${exp.title || ''} at ${exp.company || ''}: ${exp.description || ''}` : exp
            return (
              <div key={idx} style={{ display: 'flex', gap: 8 }}>
                <textarea
                  value={expText}
                  onChange={e => handleListChange('experience', idx, e.target.value)}
                  className="neon-input"
                  rows={2}
                  style={{ flex: 1, padding: '8px 10px', fontSize: 12, resize: 'vertical' }}
                />
                <button
                  onClick={() => handleRemoveListItem('experience', idx)}
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', borderRadius: 6, padding: '0 10px', cursor: 'pointer' }}
                >
                  ×
                </button>
              </div>
            )
          })}
          <button
            onClick={() => handleAddListItem('experience')}
            style={{
              padding: '8px',
              borderRadius: 8,
              background: 'rgba(176,110,255,0.08)',
              border: '1px dashed rgba(176,110,255,0.25)',
              color: '#B06EFF',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            + Add Experience Bullet
          </button>
        </div>
      )}

      {/* ── AI Improvements Tab ── */}
      {activeTab === 'improvements' && (
        <div>
          <label style={{ display: 'block', fontSize: 10, color: '#10B981', fontFamily: '"JetBrains Mono", monospace', marginBottom: 8 }}>
            ✓ AI IMPROVEMENTS APPLIED
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(resumeData.improvements_made || ['Optimized summary for target role', 'Enhanced keywords']).map((imp, idx) => (
              <div
                key={idx}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: 'rgba(16,185,129,0.06)',
                  border: '1px solid rgba(16,185,129,0.2)',
                  color: '#A7F3D0',
                  fontSize: 12,
                }}
              >
                ✦ {imp}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
