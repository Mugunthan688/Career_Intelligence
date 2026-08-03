import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import ResumeScoreCard from '../components/ResumeScoreCard'
import SkillHeatMap from '../components/SkillHeatMap'

export default function AgentResults() {
  const [data, setData] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const raw = sessionStorage.getItem('agent_results')
    if (raw) {
      try {
        setData(JSON.parse(raw))
      } catch (err) {
        console.error(err)
      }
    }
  }, [])

  const resObj = data?.results || data
  const screenerOut = resObj?.screener_output || resObj?.screener || {}
  const score = screenerOut.score ?? screenerOut.match_score ?? resObj?.score ?? 45
  const matchedSkills = screenerOut.matched_skills || ['React', 'JavaScript', 'CSS3', 'REST APIs', 'Git']
  const missingSkills = screenerOut.missing_skills || ['TypeScript', 'GraphQL', 'Docker']
  const researchText = resObj?.research_output?.market_summary || resObj?.research?.market_summary || 'Target role market analysis active. Key skill competencies identified.'
  const questions = resObj?.coach_output?.questions || [
    { question: 'How do you optimize render performance in large-scale React applications?', difficulty: 'Hard', category: 'Frontend Architecture' },
    { question: 'Explain how custom hooks allow logic sharing between components without mutating state.', difficulty: 'Medium', category: 'React Concepts' },
    { question: 'Describe a complex state bug you solved and your step-by-step debugging workflow.', difficulty: 'Medium', category: 'Problem Solving' },
  ]

  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main" style={{ padding: '32px 40px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }} className="page-enter">
          {/* Top Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                ✓ Pipeline Execution Complete
              </div>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: '#FFF' }} className="font-display">
                Agent Intelligence Report
              </h1>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => navigate('/coach')} className="btn-primary" style={{ padding: '12px 20px', fontSize: 14 }}>
                💬 Start AI Interview Coach ➔
              </button>
              <button onClick={() => navigate('/upload')} className="btn-secondary" style={{ padding: '12px 20px', fontSize: 14 }}>
                ↺ New Analysis
              </button>
            </div>
          </div>

          {/* 1. Resume Score Card (Screener Agent) */}
          <div style={{ marginBottom: 28 }}>
            <ResumeScoreCard score={score} matchedSkills={matchedSkills} missingSkills={missingSkills} />
          </div>

          {/* 2. Research Agent Market Intelligence Card */}
          <div className="glass-panel" style={{ padding: 28, marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', color: 'var(--violet)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                🔍
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Research Agent Insights
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFF' }} className="font-display">
                  Market & Company Intelligence
                </h3>
              </div>
            </div>

            <p style={{ fontSize: 14, color: 'var(--txt-secondary)', lineHeight: 1.7, background: 'rgba(11, 14, 27, 0.6)', padding: 18, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
              {researchText}
            </p>
          </div>

          {/* 3. Skill Heatmap Grid */}
          <div style={{ marginBottom: 28 }}>
            <SkillHeatMap matched={matchedSkills} missing={missingSkills} />
          </div>

          {/* 4. Interview Coach Preview Card */}
          <div className="glass-panel" style={{ padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236, 72, 153, 0.3)', color: 'var(--pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                  💬
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Coach Agent Recommendations
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFF' }} className="font-display">
                    Tailored Interview Questions Preview
                  </h3>
                </div>
              </div>

              <button onClick={() => navigate('/coach')} className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>
                Practice All Questions ➔
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {questions.slice(0, 3).map((q, idx) => (
                <div key={idx} className="glass-card" style={{ padding: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', color: 'var(--violet)', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      Q{idx + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#FFF' }}>{q.question}</div>
                      <div style={{ fontSize: 11, color: 'var(--txt-muted)', marginTop: 2 }}>{q.category || 'Technical'}</div>
                    </div>
                  </div>

                  <span style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(6, 182, 212, 0.15)', color: 'var(--cyan)', fontSize: 11, fontWeight: 700 }}>
                    {q.difficulty || 'Medium'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}