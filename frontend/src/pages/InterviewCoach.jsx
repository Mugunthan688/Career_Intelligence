import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import api from '../utils/api'

const DEFAULT_QUESTIONS = [
  { id: 1, question: 'How do you optimize model architecture and memory footprint for production deployment?', difficulty: 'Hard', category: 'System Architecture' },
  { id: 2, question: 'Explain how you approach feature engineering and data quality verification in your workflow.', difficulty: 'Medium', category: 'Technical Core' },
  { id: 3, question: 'Describe a complex technical bug or pipeline failure you resolved under tight deadlines.', difficulty: 'Hard', category: 'Problem Solving' },
  { id: 4, question: 'How do you design scalable APIs and async state management for high concurrency?', difficulty: 'Medium', category: 'API & State Design' },
  { id: 5, question: 'How do you evaluate trade-offs between model accuracy and real-time inference latency?', difficulty: 'Hard', category: 'Performance Optimization' },
]

const DIFF_COLORS = {
  Hard:   { color: '#FB7185', bg: 'rgba(251,113,133,0.10)', border: 'rgba(251,113,133,0.22)' },
  Medium: { color: '#FBBF24', bg: 'rgba(251,191,36,0.10)',  border: 'rgba(251,191,36,0.22)'  },
  Easy:   { color: '#34D399', bg: 'rgba(52,211,153,0.10)',  border: 'rgba(52,211,153,0.22)'  },
}

export default function InterviewCoach() {
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS)
  const [jobRole, setJobRole] = useState('Target Role')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [evaluations, setEvaluations] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const raw = sessionStorage.getItem('agent_results')
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        const resObj = parsed.results || parsed
        const coachQs = resObj.coach_output?.questions || resObj.coach?.questions
        const role = resObj.screener_output?.job_role || resObj.screener?.job_role || parsed.job_role
        if (coachQs && Array.isArray(coachQs) && coachQs.length > 0) setQuestions(coachQs)
        if (role) setJobRole(role)
      } catch {}
    }
  }, [])

  const activeQ = questions[currentIdx] || DEFAULT_QUESTIONS[0]
  const qId = activeQ.id || currentIdx + 1
  const currentAnswer = answers[qId] || ''
  const currentEval = evaluations[qId]
  const diffStyle = DIFF_COLORS[activeQ.difficulty] || DIFF_COLORS.Medium

  const handleAnswerSubmit = async (e) => {
    e.preventDefault()
    if (!currentAnswer.trim()) { toast.error('Please write an answer first'); return }
    setLoading(true)
    try {
      const res = await api.post('/coach/evaluate', { question: activeQ.question, user_answer: currentAnswer.trim(), job_role: jobRole })
      setEvaluations((prev) => ({ ...prev, [qId]: res.data }))
      toast.success('Coach evaluation received!')
    } catch { toast.error('Failed to submit answer') }
    finally { setLoading(false) }
  }

  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main" style={{ padding: '32px 36px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }} className="page-enter">

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--aurora-rose)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 5, fontFamily: '"JetBrains Mono", monospace' }}>
                ▶ Coach Agent Practice Room — {jobRole.toUpperCase()}
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em' }} className="font-display">
                AI Interview Practice Coach
              </h1>
            </div>
            <div style={{ padding: '7px 14px', background: 'rgba(251,113,133,0.10)', border: '1px solid rgba(251,113,133,0.22)', borderRadius: 20, fontSize: 12, fontWeight: 700, color: 'var(--aurora-rose)' }}>
              Q{currentIdx + 1} / {questions.length}
            </div>
          </div>

          {/* Question Navigation Pills */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {questions.map((q, idx) => {
              const thisId = q.id || idx + 1
              const isCurrent = idx === currentIdx
              const isEvaluated = !!evaluations[thisId]
              return (
                <button
                  key={thisId}
                  onClick={() => setCurrentIdx(idx)}
                  style={{
                    flex: 1, padding: '10px 0',
                    borderRadius: 10,
                    border: `1px solid ${isCurrent ? 'rgba(251,113,133,0.5)' : isEvaluated ? 'rgba(52,211,153,0.4)' : 'var(--border-dim)'}`,
                    background: isCurrent
                      ? 'rgba(251,113,133,0.10)'
                      : isEvaluated
                      ? 'rgba(52,211,153,0.08)'
                      : 'rgba(13,15,24,0.5)',
                    color: isCurrent ? '#F8FAFC' : isEvaluated ? 'var(--aurora-emerald)' : 'var(--txt-muted)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    transition: 'all 0.18s ease',
                  }}
                >
                  Q{idx + 1}
                  {isEvaluated && <span style={{ color: 'var(--aurora-emerald)' }}>✓</span>}
                </button>
              )
            })}
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={qId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="glass-panel"
              style={{ padding: 28, marginBottom: 20, borderTop: '2px solid rgba(251,113,133,0.3)' }}
            >
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--aurora-rose)', padding: '4px 10px', background: 'rgba(251,113,133,0.10)', borderRadius: 20, border: '1px solid rgba(251,113,133,0.22)' }}>
                  {activeQ.category || 'Technical Core'}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: diffStyle.color, padding: '4px 10px', background: diffStyle.bg, borderRadius: 20, border: `1px solid ${diffStyle.border}` }}>
                  {activeQ.difficulty || 'Medium'}
                </span>
              </div>

              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#F8FAFC', lineHeight: 1.5, marginBottom: 22 }} className="font-display">
                {activeQ.question}
              </h2>

              <form onSubmit={handleAnswerSubmit}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--txt-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: '"JetBrains Mono", monospace' }}>
                  Your Response
                </label>
                <textarea
                  className="glass-input"
                  rows={5}
                  style={{ width: '100%', marginBottom: 16, resize: 'vertical', fontSize: 14, lineHeight: 1.6 }}
                  placeholder={`Describe your approach for ${jobRole}...`}
                  value={currentAnswer}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [qId]: e.target.value }))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 12, color: 'var(--txt-muted)' }}>
                    💡 Include technical steps, metrics, and architecture patterns.
                  </div>
                  <button type="submit" className="btn-primary" disabled={loading || !currentAnswer.trim()} style={{ padding: '11px 24px' }}>
                    {loading ? 'Evaluating...' : '💬 Evaluate Answer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>

          {/* Evaluation Card */}
          {currentEval && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel"
              style={{ padding: 28, borderLeft: '3px solid var(--aurora-emerald)', background: 'rgba(52,211,153,0.03)', marginBottom: 24 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--aurora-emerald)' }}>
                  ✓ Coach Agent Assessment
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#F8FAFC' }} className="font-outfit">
                  Score: <span style={{ color: currentEval.score >= 7 ? 'var(--aurora-emerald)' : 'var(--aurora-amber)' }}>{currentEval.score}</span>
                  <span style={{ fontSize: 14, color: 'var(--txt-muted)' }}>/10</span>
                </div>
              </div>

              <p style={{ fontSize: 13, color: 'var(--txt-secondary)', lineHeight: 1.7, marginBottom: 18 }}>
                {currentEval.feedback}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {currentEval.strengths?.length > 0 && (
                  <div style={{ padding: 16, borderRadius: 12, background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.18)' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--aurora-emerald)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, fontFamily: '"JetBrains Mono", monospace' }}>
                      Strengths
                    </div>
                    {currentEval.strengths.map((s, i) => (
                      <div key={i} style={{ fontSize: 12, color: '#F8FAFC', marginBottom: 4, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                        <span style={{ color: 'var(--aurora-emerald)', flexShrink: 0 }}>✓</span> {s}
                      </div>
                    ))}
                  </div>
                )}
                {currentEval.improvements?.length > 0 && (
                  <div style={{ padding: 16, borderRadius: 12, background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.18)' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--aurora-amber)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, fontFamily: '"JetBrains Mono", monospace' }}>
                      Improvements
                    </div>
                    {currentEval.improvements.map((imp, i) => (
                      <div key={i} style={{ fontSize: 12, color: '#F8FAFC', marginBottom: 4, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                        <span style={{ color: 'var(--aurora-amber)', flexShrink: 0 }}>⚡</span> {imp}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}