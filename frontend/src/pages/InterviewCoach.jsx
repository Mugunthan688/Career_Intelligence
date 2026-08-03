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
        if (coachQs && Array.isArray(coachQs) && coachQs.length > 0) {
          setQuestions(coachQs)
        }
        if (role) {
          setJobRole(role)
        }
      } catch (err) {
        console.error(err)
      }
    }
  }, [])

  const activeQ = questions[currentIdx] || DEFAULT_QUESTIONS[0]
  const qId = activeQ.id || currentIdx + 1
  const currentAnswer = answers[qId] || ''
  const currentEval = evaluations[qId]

  const handleAnswerSubmit = async (e) => {
    e.preventDefault()
    if (!currentAnswer.trim()) {
      toast.error('Please write an answer before submitting')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/coach/evaluate', {
        question: activeQ.question,
        user_answer: currentAnswer.trim(),
        job_role: jobRole,
      })
      setEvaluations((prev) => ({ ...prev, [qId]: res.data }))
      toast.success('Coach evaluation received!')
    } catch (err) {
      toast.error('Failed to submit answer for evaluation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main" style={{ padding: '32px 40px' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }} className="page-enter">
          {/* Top Header & Progress */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--pink)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }} className="font-mono">
                ▶ COACH AGENT PRACTICE ROOM — {jobRole.toUpperCase()}
              </div>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: '#FFF' }} className="font-display">
                AI Interview Practice Coach
              </h1>
            </div>

            <div style={{ padding: '8px 16px', background: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236, 72, 153, 0.3)', borderRadius: 20, fontSize: 13, fontWeight: 700, color: 'var(--pink)' }}>
              Question {currentIdx + 1} of {questions.length}
            </div>
          </div>

          {/* Numbered Navigation Pills */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
            {questions.map((q, idx) => {
              const thisId = q.id || idx + 1
              const isCurrent = idx === currentIdx
              const isEvaluated = !!evaluations[thisId]
              return (
                <button
                  key={thisId}
                  onClick={() => setCurrentIdx(idx)}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 12,
                    border: `1px solid ${isCurrent ? 'var(--pink)' : isEvaluated ? 'var(--green)' : 'var(--border-subtle)'}`,
                    background: isCurrent
                      ? 'linear-gradient(135deg, rgba(236,72,153,0.2) 0%, rgba(139,92,246,0.2) 100%)'
                      : isEvaluated
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'rgba(16, 21, 40, 0.6)',
                    color: isCurrent || isEvaluated ? '#FFF' : 'var(--txt-muted)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span>Q{idx + 1}</span>
                  {isEvaluated && <span style={{ color: 'var(--green)' }}>✓</span>}
                </button>
              )
            })}
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={qId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-panel"
              style={{ padding: 32, marginBottom: 28 }}
            >
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--pink)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 10px', background: 'rgba(236, 72, 153, 0.1)', borderRadius: 20, border: '1px solid rgba(236, 72, 153, 0.25)' }}>
                  {activeQ.category || 'Technical Core'}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 10px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: 20, border: '1px solid rgba(6, 182, 212, 0.25)' }}>
                  {activeQ.difficulty || 'Medium'} Difficulty
                </span>
              </div>

              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#FFF', lineHeight: 1.45, marginBottom: 24 }} className="font-display">
                {activeQ.question}
              </h2>

              <form onSubmit={handleAnswerSubmit}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--txt-secondary)', marginBottom: 8 }}>
                  Your Response / Explanation:
                </label>
                <textarea
                  className="glass-input"
                  rows={5}
                  style={{ width: '100%', marginBottom: 20, resize: 'vertical', fontSize: 14, lineHeight: 1.6 }}
                  placeholder={`Describe your technical solution or approach for ${jobRole}...`}
                  value={currentAnswer}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [qId]: e.target.value }))}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 12, color: 'var(--txt-muted)' }}>
                    💡 Tip: Provide technical steps, metrics, and architecture patterns.
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading || !currentAnswer.trim()}
                    style={{ padding: '12px 28px' }}
                  >
                    {loading ? 'Evaluating Response...' : '💬 Evaluate Answer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>

          {/* Coach Evaluation Results Card */}
          {currentEval && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel"
              style={{ padding: 32, border: '1px solid rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.04)', marginBottom: 32 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--green)' }} className="font-display">
                  ✓ Coach Agent Assessment
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#FFF' }} className="font-outfit">
                  Score: <span style={{ color: currentEval.score >= 7 ? 'var(--green)' : 'var(--amber)' }}>{currentEval.score}</span> / 10
                </div>
              </div>

              <p style={{ fontSize: 14, color: 'var(--txt-secondary)', lineHeight: 1.65, marginBottom: 20 }}>
                {currentEval.feedback}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {currentEval.strengths?.length > 0 && (
                  <div style={{ padding: 16, borderRadius: 12, background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                      Strengths Noted
                    </div>
                    {currentEval.strengths.map((s, i) => (
                      <div key={i} style={{ fontSize: 13, color: '#FFF', marginBottom: 4 }}>✓ {s}</div>
                    ))}
                  </div>
                )}

                {currentEval.improvements?.length > 0 && (
                  <div style={{ padding: 16, borderRadius: 12, background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                      Areas to Improve
                    </div>
                    {currentEval.improvements.map((imp, i) => (
                      <div key={i} style={{ fontSize: 13, color: '#FFF', marginBottom: 4 }}>⚡ {imp}</div>
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