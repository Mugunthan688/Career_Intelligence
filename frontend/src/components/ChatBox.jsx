import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ── Typing indicator dots ───────────────────── */
const TypingDots = () => (
  <div style={{ display: 'flex', gap: 4, padding: '4px 0' }}>
    {[0, 1, 2].map(i => (
      <motion.span
        key={i}
        animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.18 }}
        style={{
          width: 5, height: 5, borderRadius: '50%',
          background: 'var(--aurora-violet)',
          boxShadow: '0 0 6px rgba(167,139,250,0.6)',
          display: 'inline-block',
        }}
      />
    ))}
  </div>
)

/* ── Score stars ─────────────────────────────── */
const Stars = ({ score }) => (
  <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
    {Array.from({ length: 10 }).map((_, i) => (
      <span key={i} style={{
        fontSize: 11,
        color: i < score ? 'var(--aurora-amber)' : 'rgba(255,255,255,0.1)',
        transition: 'all 0.3s',
      }}>★</span>
    ))}
    <span style={{
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 11, color: 'var(--aurora-violet)',
      marginLeft: 8, fontWeight: 700,
    }}>{score}/10</span>
  </div>
)

export default function ChatBox({ question, onSubmit, feedback, loading }) {
  const [answer, setAnswer] = useState('')
  const taRef = useRef(null)

  /* Auto-resize textarea */
  useEffect(() => {
    if (taRef.current) {
      taRef.current.style.height = 'auto'
      taRef.current.style.height = taRef.current.scrollHeight + 'px'
    }
  }, [answer])

  /* Clear answer when question changes */
  useEffect(() => { setAnswer('') }, [question])

  const handleSend = () => {
    if (!answer.trim() || loading) return
    onSubmit(answer.trim())
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) handleSend()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* ── Answer input ─────────────────────── */}
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Label bar */}
        <div style={{
          padding: '10px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.02)',
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--aurora-violet)', boxShadow: '0 0 6px var(--aurora-violet)',
          }} />
          <span style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 9, color: 'var(--txt-muted)', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700
          }}>YOUR ANSWER</span>
          <span style={{
            marginLeft: 'auto',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 9, color: 'var(--txt-muted)',
          }}>Ctrl+Enter to submit</span>
        </div>

        {/* Textarea */}
        <textarea
          ref={taRef}
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type your answer here..."
          disabled={loading}
          rows={4}
          style={{
            width: '100%', minHeight: 110,
            background: 'transparent',
            border: 'none', outline: 'none',
            color: '#F8FAFC', fontSize: 13,
            lineHeight: 1.6, resize: 'none',
            padding: '14px 16px',
            opacity: loading ? 0.5 : 1,
          }}
        />

        {/* Bottom action bar */}
        <div style={{
          padding: '10px 16px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(8,9,14,0.4)',
        }}>
          <span style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10, color: 'var(--txt-muted)',
          }}>
            {answer.length} chars
            {answer.length > 50 && (
              <span style={{ color: 'var(--aurora-emerald)', marginLeft: 8 }}>✓ GOOD LENGTH</span>
            )}
          </span>

          <button
            onClick={handleSend}
            disabled={loading || !answer.trim()}
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: 12 }}
          >
            {loading ? 'Evaluating...' : 'Submit Answer →'}
          </button>
        </div>
      </div>

      {/* ── Loading indicator ─────────────────── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 18px',
              background: 'rgba(167,139,250,0.06)',
              border: '1px solid rgba(167,139,250,0.18)',
              borderRadius: 12,
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'linear-gradient(135deg, #A78BFA, #2DD4BF)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, flexShrink: 0,
            }}>🤖</div>
            <div>
              <div style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 9, color: 'var(--aurora-violet)', letterSpacing: 2, marginBottom: 4, fontWeight: 700
              }}>AI COACH EVALUATING</div>
              <TypingDots />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── AI Feedback card ─────────────────── */}
      <AnimatePresence>
        {feedback && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="glass-panel"
            style={{ padding: 20, borderLeft: '3px solid var(--aurora-teal)' }}
          >
            {/* Header */}
            <div style={{
              paddingBottom: 14,
              marginBottom: 14,
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'rgba(45,212,191,0.12)',
                border: '1px solid rgba(45,212,191,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, flexShrink: 0,
              }}>🤖</div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 10, color: 'var(--aurora-teal)', letterSpacing: 1.5, fontWeight: 700
                }}>AI COACH EVALUATION</div>
              </div>
              {feedback.score !== undefined && <Stars score={feedback.score} />}
            </div>

            {/* Body */}
            <div>
              {/* Main feedback text */}
              <p style={{
                fontSize: 13, color: 'var(--txt-secondary)',
                lineHeight: 1.6, marginBottom: 16,
              }}>{feedback.feedback}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {/* Strengths */}
                {feedback.strengths?.length > 0 && (
                  <div style={{
                    background: 'rgba(52,211,153,0.06)',
                    border: '1px solid rgba(52,211,153,0.18)',
                    borderRadius: 10, padding: '12px 14px',
                  }}>
                    <div style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: 9, color: 'var(--aurora-emerald)',
                      letterSpacing: 1.5, marginBottom: 8, fontWeight: 700
                    }}>✓ STRENGTHS</div>
                    {feedback.strengths.map((s, i) => (
                      <div key={i} style={{
                        fontSize: 12, color: '#F8FAFC',
                        marginBottom: 4, lineHeight: 1.4,
                        display: 'flex', gap: 6,
                      }}>
                        <span style={{ color: 'var(--aurora-emerald)', flexShrink: 0 }}>✓</span>
                        {s}
                      </div>
                    ))}
                  </div>
                )}

                {/* Improvements */}
                {feedback.improvements?.length > 0 && (
                  <div style={{
                    background: 'rgba(251,191,36,0.06)',
                    border: '1px solid rgba(251,191,36,0.18)',
                    borderRadius: 10, padding: '12px 14px',
                  }}>
                    <div style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: 9, color: 'var(--aurora-amber)',
                      letterSpacing: 1.5, marginBottom: 8, fontWeight: 700
                    }}>⚡ IMPROVEMENTS</div>
                    {feedback.improvements.map((s, i) => (
                      <div key={i} style={{
                        fontSize: 12, color: '#F8FAFC',
                        marginBottom: 4, lineHeight: 1.4,
                        display: 'flex', gap: 6,
                      }}>
                        <span style={{ color: 'var(--aurora-amber)', flexShrink: 0 }}>⚡</span>
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Ideal answer hint */}
              {feedback.ideal_answer_hint && (
                <div style={{
                  marginTop: 12,
                  background: 'rgba(167,139,250,0.05)',
                  border: '1px solid rgba(167,139,250,0.15)',
                  borderRadius: 10, padding: '10px 14px',
                  display: 'flex', gap: 10,
                }}>
                  <span style={{ color: 'var(--aurora-violet)', flexShrink: 0, fontSize: 13 }}>💡</span>
                  <div>
                    <div style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: 8, color: 'var(--aurora-violet)',
                      letterSpacing: 1.5, marginBottom: 3, fontWeight: 700
                    }}>IDEAL ANSWER HINT</div>
                    <p style={{ fontSize: 12, color: 'var(--txt-secondary)', lineHeight: 1.5, margin: 0 }}>
                      {feedback.ideal_answer_hint}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}