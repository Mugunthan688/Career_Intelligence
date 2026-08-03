import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ── Typing indicator dots ───────────────────── */
const TypingDots = () => (
  <div style={{ display: 'flex', gap: 4, padding: '4px 0' }}>
    {[0, 1, 2].map(i => (
      <motion.span
        key={i}
        animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.18 }}
        style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#B06EFF',
          boxShadow: '0 0 6px rgba(176,110,255,0.6)',
          display: 'inline-block',
        }}
      />
    ))}
  </div>
)

/* ── Score stars ─────────────────────────────── */
const Stars = ({ score }) => (
  <div style={{ display: 'flex', gap: 3 }}>
    {Array.from({ length: 10 }).map((_, i) => (
      <span key={i} style={{
        fontSize: 12,
        color: i < score ? '#F59E0B' : '#2A3450',
        textShadow: i < score ? '0 0 6px #F59E0B' : 'none',
        transition: 'all 0.3s',
      }}>★</span>
    ))}
    <span style={{
      fontFamily: '"JetBrains Mono",monospace',
      fontSize: 11, color: '#B06EFF',
      marginLeft: 8, fontWeight: 600,
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
      <div style={{
        background: 'rgba(15,18,33,0.85)',
        border: '1px solid rgba(176,110,255,0.18)',
        borderRadius: 14,
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        position: 'relative',
      }}>
        {/* Label bar */}
        <div style={{
          padding: '10px 16px',
          borderBottom: '1px solid rgba(176,110,255,0.08)',
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(176,110,255,0.03)',
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#B06EFF', boxShadow: '0 0 8px #B06EFF',
          }} />
          <span style={{
            fontFamily: '"JetBrains Mono",monospace',
            fontSize: 9, color: '#3D4A6B', letterSpacing: 3,
          }}>YOUR ANSWER</span>
          <span style={{
            marginLeft: 'auto',
            fontFamily: '"JetBrains Mono",monospace',
            fontSize: 9, color: '#2A3450',
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
          rows={5}
          style={{
            width: '100%', minHeight: 120,
            background: 'transparent',
            border: 'none', outline: 'none',
            color: '#E2E8F0', fontSize: 14,
            fontFamily: 'Inter, sans-serif',
            lineHeight: 1.7, resize: 'none',
            padding: '14px 16px',
            transition: 'opacity 0.2s',
            opacity: loading ? 0.5 : 1,
          }}
        />

        {/* Bottom action bar */}
        <div style={{
          padding: '10px 14px',
          borderTop: '1px solid rgba(176,110,255,0.06)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(176,110,255,0.02)',
        }}>
          <span style={{
            fontFamily: '"JetBrains Mono",monospace',
            fontSize: 9, color: '#2A3450',
          }}>
            {answer.length} chars
            {answer.length > 50 && (
              <span style={{ color: '#10B981', marginLeft: 8 }}>✓ GOOD LENGTH</span>
            )}
          </span>

          <button
            onClick={handleSend}
            disabled={loading || !answer.trim()}
            style={{
              background: loading || !answer.trim()
                ? 'rgba(176,110,255,0.1)'
                : 'linear-gradient(135deg,#B06EFF,#7C3AED)',
              border: `1px solid ${loading || !answer.trim() ? 'rgba(176,110,255,0.15)' : 'transparent'}`,
              borderRadius: 9, color: '#fff',
              padding: '9px 22px',
              fontFamily: '"Space Grotesk",sans-serif',
              fontWeight: 600, fontSize: 13,
              cursor: loading || !answer.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !answer.trim() ? 0.5 : 1,
              boxShadow: loading || !answer.trim() ? 'none' : '0 4px 16px rgba(176,110,255,0.35)',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Evaluating...' : 'Submit Answer →'}
          </button>
        </div>
      </div>

      {/* ── Loading indicator ─────────────────── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 18px',
              background: 'rgba(176,110,255,0.05)',
              border: '1px solid rgba(176,110,255,0.15)',
              borderRadius: 12,
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'linear-gradient(135deg,#B06EFF,#22D3EE)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, flexShrink: 0,
            }}>🤖</div>
            <div>
              <div style={{
                fontFamily: '"JetBrains Mono",monospace',
                fontSize: 9, color: '#B06EFF', letterSpacing: 2, marginBottom: 4,
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
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1     }}
            exit={{ opacity: 0, y: -8               }}
            transition={{ duration: 0.4 }}
            style={{
              background: 'rgba(15,18,33,0.9)',
              border: '1px solid rgba(34,211,238,0.2)',
              borderRadius: 14, overflow: 'hidden',
              backdropFilter: 'blur(20px)',
              position: 'relative',
            }}
          >
            {/* Cyan accent top */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg,transparent,#22D3EE,transparent)',
            }} />

            {/* Header */}
            <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid rgba(34,211,238,0.08)',
              background: 'rgba(34,211,238,0.03)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'rgba(34,211,238,0.1)',
                border: '1px solid rgba(34,211,238,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, flexShrink: 0,
              }}>🤖</div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: '"JetBrains Mono",monospace',
                  fontSize: 9, color: '#22D3EE', letterSpacing: 2,
                }}>AI COACH FEEDBACK</div>
              </div>
              {feedback.score !== undefined && <Stars score={feedback.score} />}
            </div>

            {/* Body */}
            <div style={{ padding: '16px 18px' }}>

              {/* Main feedback text */}
              <p style={{
                fontSize: 13, color: '#8892B0',
                lineHeight: 1.7, marginBottom: 16,
              }}>{feedback.feedback}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

                {/* Strengths */}
                {feedback.strengths?.length > 0 && (
                  <div style={{
                    background: 'rgba(16,185,129,0.04)',
                    border: '1px solid rgba(16,185,129,0.15)',
                    borderRadius: 10, padding: '12px 14px',
                  }}>
                    <div style={{
                      fontFamily: '"JetBrains Mono",monospace',
                      fontSize: 8, color: '#10B981',
                      letterSpacing: 2, marginBottom: 8,
                    }}>✓ STRENGTHS</div>
                    {feedback.strengths.map((s, i) => (
                      <div key={i} style={{
                        fontSize: 12, color: '#64748B',
                        marginBottom: 4, lineHeight: 1.5,
                        display: 'flex', gap: 6,
                      }}>
                        <span style={{ color: '#10B981', flexShrink: 0 }}>·</span>
                        {s}
                      </div>
                    ))}
                  </div>
                )}

                {/* Improvements */}
                {feedback.improvements?.length > 0 && (
                  <div style={{
                    background: 'rgba(245,158,11,0.04)',
                    border: '1px solid rgba(245,158,11,0.15)',
                    borderRadius: 10, padding: '12px 14px',
                  }}>
                    <div style={{
                      fontFamily: '"JetBrains Mono",monospace',
                      fontSize: 8, color: '#F59E0B',
                      letterSpacing: 2, marginBottom: 8,
                    }}>⚡ IMPROVE</div>
                    {feedback.improvements.map((s, i) => (
                      <div key={i} style={{
                        fontSize: 12, color: '#64748B',
                        marginBottom: 4, lineHeight: 1.5,
                        display: 'flex', gap: 6,
                      }}>
                        <span style={{ color: '#F59E0B', flexShrink: 0 }}>·</span>
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
                  background: 'rgba(176,110,255,0.05)',
                  border: '1px solid rgba(176,110,255,0.15)',
                  borderRadius: 10, padding: '10px 14px',
                  display: 'flex', gap: 10,
                }}>
                  <span style={{ color: '#B06EFF', flexShrink: 0, fontSize: 14 }}>💡</span>
                  <div>
                    <div style={{
                      fontFamily: '"JetBrains Mono",monospace',
                      fontSize: 8, color: '#B06EFF',
                      letterSpacing: 2, marginBottom: 4,
                    }}>IDEAL ANSWER HINT</div>
                    <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>
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