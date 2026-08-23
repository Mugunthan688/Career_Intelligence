import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SessionCard({ session, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const score = session.avg_score ?? session.score ?? 0
  const scoreColor =
    score >= 75 ? 'var(--aurora-emerald)' : score >= 50 ? 'var(--aurora-amber)' : 'var(--aurora-rose)'

  const formattedDate = session.created_at
    ? new Date(session.created_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : session.date || 'Recent Session'

  const questions = session.questions || []
  const answers = session.answers || []
  const scores = session.scores || []
  const feedbacks = session.feedbacks || []

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="glass-panel"
      style={{
        padding: '18px 22px',
        marginBottom: 12,
      }}
    >
      {/* ── Top Summary Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#F8FAFC' }} className="font-display">
              {session.job_role || 'General Interview'}
            </span>
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 9,
                padding: '2px 8px',
                borderRadius: 10,
                background: 'rgba(167,139,250,0.12)',
                border: '1px solid rgba(167,139,250,0.22)',
                color: 'var(--aurora-violet)',
                fontWeight: 700,
              }}
            >
              {questions.length} QUESTIONS
            </span>
          </div>

          <div style={{ fontSize: 11, color: 'var(--txt-muted)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>📅 {formattedDate}</span>
            <span>ID: {session.session_id ? session.session_id.slice(0, 8) : 'session'}</span>
          </div>
        </div>

        {/* Score Gauge Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              textAlign: 'center',
              padding: '6px 14px',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid rgba(255,255,255,0.08)`,
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 18, color: scoreColor }} className="font-outfit">
              {score}%
            </div>
            <div style={{ fontSize: 8, color: 'var(--txt-muted)', letterSpacing: 1, textTransform: 'uppercase', fontFamily: '"JetBrains Mono", monospace' }}>
              AVG SCORE
            </div>
          </div>

          {/* Toggle Expand */}
          <button
            onClick={() => setExpanded(e => !e)}
            className="btn-secondary"
            style={{ padding: '7px 12px', fontSize: 11 }}
          >
            <span>{expanded ? 'Hide Q&A' : 'View Q&A'}</span>
            <span style={{ fontSize: 9 }}>{expanded ? '▲' : '▼'}</span>
          </button>

          {/* Delete Button */}
          {onDelete && (
            <button
              onClick={() => onDelete(session.session_id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--txt-muted)',
                fontSize: 14,
                cursor: 'pointer',
                padding: 6,
                transition: 'color 0.2s',
              }}
              title="Delete session"
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--aurora-rose)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--txt-muted)')}
            >
              🗑
            </button>
          )}
        </div>
      </div>

      {/* ── Expanded Q&A Details ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              overflow: 'hidden',
              marginTop: 16,
              paddingTop: 16,
              borderTop: '1px dashed rgba(255,255,255,0.08)',
            }}
          >
            <div style={{ fontSize: 10, color: 'var(--aurora-violet)', letterSpacing: '0.08em', marginBottom: 10, textTransform: 'uppercase', fontFamily: '"JetBrains Mono", monospace' }}>
              Session Questions & Feedback
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {questions.map((q, idx) => {
                const qText = typeof q === 'object' ? q.question : q
                const ansText = answers[idx] || 'No answer provided'
                const qScore = scores[idx] ?? 0
                const feedback = feedbacks[idx] || {}
                const feedbackText = typeof feedback === 'object' ? feedback.feedback : feedback

                return (
                  <div
                    key={idx}
                    className="glass-card"
                    style={{ padding: 12 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                      <p style={{ color: '#F8FAFC', fontWeight: 600, fontSize: 12, margin: '0 0 4px 0' }}>
                        Q{idx + 1}: {qText}
                      </p>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: qScore >= 7 ? 'var(--aurora-emerald)' : qScore >= 5 ? 'var(--aurora-amber)' : 'var(--aurora-rose)',
                        }}
                      >
                        {qScore}/10
                      </span>
                    </div>

                    <p style={{ color: 'var(--txt-muted)', fontSize: 11, margin: '0 0 6px 0', fontStyle: 'italic' }}>
                      "{ansText}"
                    </p>

                    {feedbackText && (
                      <div
                        style={{
                          fontSize: 11,
                          color: 'var(--txt-secondary)',
                          background: 'rgba(167,139,250,0.06)',
                          borderLeft: '2px solid var(--aurora-violet)',
                          padding: '6px 10px',
                          borderRadius: '0 6px 6px 0',
                        }}
                      >
                        💡 {feedbackText}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
