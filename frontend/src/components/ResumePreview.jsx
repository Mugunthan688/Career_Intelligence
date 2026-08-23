import React from 'react'

export default function ResumePreview({ resumeData, onDownload, downloading }) {
  if (!resumeData) return null

  const skills = resumeData.skills || []
  const experience = resumeData.experience || []

  return (
    <div className="glass-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header action bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ fontWeight: 700, fontSize: 15, color: '#F8FAFC', margin: 0 }} className="font-display">
          📄 Live Document Preview
        </h3>

        {onDownload && (
          <button
            onClick={onDownload}
            disabled={downloading}
            className="btn-primary"
            style={{
              padding: '6px 14px',
              fontSize: 11,
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
          padding: '32px 36px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          fontFamily: 'Inter, sans-serif',
          lineHeight: 1.5,
          overflowY: 'auto',
          maxHeight: 620,
        }}
      >
        {/* Name & Header */}
        <div style={{ borderBottom: '2px solid #0F172A', paddingBottom: 10, marginBottom: 16, textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0F172A', letterSpacing: -0.5 }}>
            {resumeData.name || 'Candidate Name'}
          </h1>
          {resumeData.job_role && (
            <p style={{ margin: '4px 0 0', fontSize: 13, fontWeight: 600, color: '#6366F1', textTransform: 'uppercase', letterSpacing: 1 }}>
              {resumeData.job_role}
            </p>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, fontSize: 11, color: '#64748B', marginTop: 6, flexWrap: 'wrap' }}>
            {resumeData.email && <span>📧 {resumeData.email}</span>}
            {resumeData.phone && <span>📞 {resumeData.phone}</span>}
            {resumeData.location && <span>📍 {resumeData.location}</span>}
            {resumeData.linkedin && <span>🔗 {resumeData.linkedin}</span>}
          </div>
        </div>

        {/* Summary */}
        {resumeData.summary && (
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1.2, margin: '0 0 4px 0', borderBottom: '1px solid #E2E8F0', paddingBottom: 3 }}>
              Professional Summary
            </h3>
            <p style={{ fontSize: 12, color: '#334155', margin: 0, lineHeight: 1.5 }}>
              {resumeData.summary}
            </p>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1.2, margin: '0 0 6px 0', borderBottom: '1px solid #E2E8F0', paddingBottom: 3 }}>
              Core Competencies & Skills
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {skills.map((sk, idx) => (
                <span
                  key={idx}
                  style={{
                    background: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    color: '#1E293B',
                    fontSize: 10,
                    fontWeight: 600,
                    padding: '2px 7px',
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
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1.2, margin: '0 0 6px 0', borderBottom: '1px solid #E2E8F0', paddingBottom: 3 }}>
              Work Experience & Accomplishments
            </h3>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#334155' }}>
              {experience.map((exp, idx) => {
                const expText = typeof exp === 'object' ? `${exp.title || ''} at ${exp.company || ''}: ${exp.description || ''}` : exp
                return (
                  <li key={idx} style={{ marginBottom: 5 }}>
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
            <h3 style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1.2, margin: '0 0 6px 0', borderBottom: '1px solid #E2E8F0', paddingBottom: 3 }}>
              Education & Certifications
            </h3>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#334155' }}>
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
