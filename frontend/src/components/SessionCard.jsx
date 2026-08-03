import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SessionCard({ session, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const score = session.avg_score ?? session.score ?? 0
  const scoreColor =
    score >= 75 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444'

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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      style={{
        background: '#0F172A',
        border: '1px solid rgba(176,110,255,0.12)',
        borderRadius: 16,
        padding: '20px 24px',
        marginBottom: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        transition: 'border-color 0.2s',
      }}
    >
      {/* ── Top Summary Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: 16,
                color: '#F0F2FF',
              }}
            >
              {session.job_role || 'General Interview'}
            </span>
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 9,
                padding: '2px 8px',
                borderRadius: 12,
                background: 'rgba(176,110,255,0.1)',
                border: '1px solid rgba(176,110,255,0.2)',
                color: '#B06EFF',
              }}
            >
              {questions.length} QUESTIONS
            </span>
          </div>

          <div style={{ fontSize: 12, color: '#475569', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>📅 {formattedDate}</span>
            <span>ID: {session.session_id ? session.session_id.slice(0, 8) : 'session'}</span>
          </div>
        </div>

        {/* Score Gauge Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              textAlign: 'center',
              padding: '8px 16px',
              borderRadius: 12,
              background: `rgba(${score >= 75 ? '16,185,129' : score >= 50 ? '245,158,11' : '239,68,68'}, 0.08)`,
              border: `1px solid ${scoreColor}40`,
            }}
          >
            <div
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 800,
                fontSize: 20,
                color: scoreColor,
              }}
            >
              {score}%
            </div>
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 8,
                color: scoreColor,
                letterSpacing: 1.5,
              }}
            >
              AVG SCORE
            </div>
          </div>

          {/* Toggle Expand */}
          <button
            onClick={() => setExpanded(e => !e)}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#E2E8F0',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'background 0.2s',
            }}
          >
            <span>{expanded ? 'Hide Q&A' : 'View Q&A'}</span>
            <span style={{ fontSize: 10 }}>{expanded ? '▲' : '▼'}</span>
          </button>

          {/* Delete Button */}
          {onDelete && (
            <button
              onClick={() => onDelete(session.session_id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#475569',
                fontSize: 16,
                cursor: 'pointer',
                padding: 6,
                transition: 'color 0.2s',
              }}
              title="Delete session"
              onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
              onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
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
              marginTop: 18,
              paddingTop: 18,
              borderTop: '1px dashed rgba(255,255,255,0.08)',
            }}
          >
            <h4
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
                color: '#B06EFF',
                letterSpacing: 2,
                marginBottom: 12,
              }}
            >
              ▶ SESSION QUESTIONS & FEEDBACK
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {questions.map((q, idx) => {
                const qText = typeof q === 'object' ? q.question : q
                const ansText = answers[idx] || 'No answer provided'
                const qScore = scores[idx] ?? 0
                const feedback = feedbacks[idx] || {}
                const feedbackText = typeof feedback === 'object' ? feedback.feedback : feedback

                return (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(15,23,42,0.6)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: 10,
                      padding: 14,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                      <p style={{ color: '#F0F2FF', fontWeight: 600, fontSize: 13, margin: '0 0 6px 0' }}>
                        Q{idx + 1}: {qText}
                      </p>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: qScore >= 7 ? '#10B981' : qScore >= 5 ? '#F59E0B' : '#EF4444',
                        }}
                      >
                        {qScore}/10
                      </span>
                    </div>

                    <p style={{ color: '#94A3B8', fontSize: 12, margin: '0 0 8px 0', fontStyle: 'italic' }}>
                      " {ansText} "
                    </p>

                    {feedbackText && (
                      <div
                        style={{
                          fontSize: 11,
                          color: '#CBD5E1',
                          background: 'rgba(176,110,255,0.05)',
                          borderLeft: '2px solid #B06EFF',
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
