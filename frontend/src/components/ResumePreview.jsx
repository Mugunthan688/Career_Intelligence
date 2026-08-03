import React from 'react'

export default function ResumePreview({ resumeData, onDownload, downloading }) {
  if (!resumeData) return null

  const skills = resumeData.skills || []
  const experience = resumeData.experience || []

  return (
    <div
      style={{
        background: '#0F172A',
        border: '1px solid rgba(176,110,255,0.15)',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Header action bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 16, color: '#F0F2FF', margin: 0 }}>
          📄 Live Preview
        </h3>

        {onDownload && (
          <button
            onClick={onDownload}
            disabled={downloading}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              background: downloading ? 'rgba(176,110,255,0.2)' : 'linear-gradient(135deg,#B06EFF,#7C3AED)',
              border: 'none',
              color: '#fff',
              fontWeight: 600,
              fontSize: 12,
              cursor: downloading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: downloading ? 'none' : '0 4px 14px rgba(176,110,255,0.3)',
            }}
          >
            <span>{downloading ? '⟳ Exporting PDF...' : '📥 Download PDF'}</span>
          </button>
        )}
      </div>

      {/* ── Document Page Representation ── */}
      <div
        style={{
          flex: 1,
          background: '#FFFFFF',
          color: '#1E293B',
          borderRadius: 8,
          padding: '36px 40px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          fontFamily: 'Inter, sans-serif',
          lineHeight: 1.5,
          overflowY: 'auto',
          maxHeight: 620,
        }}
      >
        {/* Name & Header */}
        <div style={{ borderBottom: '2px solid #0F172A', pb: 12, marginBottom: 18, textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#0F172A', letterSpacing: -0.5 }}>
            {resumeData.name || 'Candidate Name'}
          </h1>
          {resumeData.job_role && (
            <p style={{ margin: '4px 0 0', fontSize: 14, fontWeight: 600, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: 1 }}>
              {resumeData.job_role}
            </p>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, fontSize: 11, color: '#64748B', marginTop: 8, flexWrap: 'wrap' }}>
            {resumeData.email && <span>📧 {resumeData.email}</span>}
            {resumeData.phone && <span>📞 {resumeData.phone}</span>}
            {resumeData.location && <span>📍 {resumeData.location}</span>}
            {resumeData.linkedin && <span>🔗 {resumeData.linkedin}</span>}
          </div>
        </div>

        {/* Summary */}
        {resumeData.summary && (
          <div style={{ marginBottom: 18 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1.5, margin: '0 0 6px 0', borderBottom: '1px solid #E2E8F0', paddingBottom: 4 }}>
              Professional Summary
            </h3>
            <p style={{ fontSize: 12, color: '#334155', margin: 0 }}>
              {resumeData.summary}
            </p>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1.5, margin: '0 0 8px 0', borderBottom: '1px solid #E2E8F0', paddingBottom: 4 }}>
              Core Competencies & Skills
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {skills.map((sk, idx) => (
                <span
                  key={idx}
                  style={{
                    background: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    color: '#1E293B',
                    fontSize: 10,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 4,
                  }}
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1.5, margin: '0 0 8px 0', borderBottom: '1px solid #E2E8F0', paddingBottom: 4 }}>
              Work Experience & Accomplishments
            </h3>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 11, color: '#334155' }}>
              {experience.map((exp, idx) => {
                const expText = typeof exp === 'object' ? `${exp.title || ''} at ${exp.company || ''}: ${exp.description || ''}` : exp
                return (
                  <li key={idx} style={{ marginBottom: 6 }}>
                    {expText}
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {/* Education & Certifications */}
        {((resumeData.education && resumeData.education.length > 0) || (resumeData.certifications && resumeData.certifications.length > 0)) && (
          <div>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1.5, margin: '0 0 8px 0', borderBottom: '1px solid #E2E8F0', paddingBottom: 4 }}>
              Education & Certifications
            </h3>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 11, color: '#334155' }}>
              {(resumeData.education || []).map((edu, idx) => (
                <li key={`edu-${idx}`}>
                  {typeof edu === 'object' ? `${edu.degree} - ${edu.institution}` : edu}
                </li>
              ))}
              {(resumeData.certifications || []).map((cert, idx) => (
                <li key={`cert-${idx}`}>
                  📜 {typeof cert === 'object' ? cert.name : cert}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
