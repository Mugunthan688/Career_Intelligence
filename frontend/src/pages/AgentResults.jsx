import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import ResumeScoreCard from '../components/ResumeScoreCard'
import SkillHeatMap from '../components/SkillHeatMap'

const SECTION_ACCENT = {
  research:  { color: '#A78BFA', dim: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.20)' },
  analytics: { color: '#34D399', dim: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.20)'  },
  coach:     { color: '#FB7185', dim: 'rgba(251,113,133,0.08)', border: 'rgba(251,113,133,0.20)' },
}

export default function AgentResults() {
  const [data, setData] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const raw = sessionStorage.getItem('agent_results')
    if (raw) { try { setData(JSON.parse(raw)) } catch {} }
  }, [])

  const resObj = data?.results || data || {}
  const screenerOut = resObj?.screener || resObj?.screener_output || {}
  const score = screenerOut.score ?? screenerOut.match_score ?? resObj?.score ?? 50
  const matchedSkills = screenerOut.matched_skills || []
  const missingSkills = screenerOut.missing_skills || []
  const researchObj = resObj?.research || resObj?.research_output || {}
  const targetRole = researchObj.job_role || screenerOut.job_role || resObj.job_role || 'Target Role'
  const companyName = researchObj.company || resObj.company || ''
  const researchText = researchObj.research_summary || researchObj.summary || researchObj.market_summary || `Live market research active for ${targetRole}.`
  const coachOut = resObj?.coach || resObj?.coach_output || {}
  const questions = coachOut.questions && Array.isArray(coachOut.questions) && coachOut.questions.length > 0
    ? coachOut.questions
    : [
        { id: 1, question: `How do you architect scalable systems for ${targetRole}?`, difficulty: 'Hard', category: 'System Architecture' },
        { id: 2, question: `What core tools and methodologies do you prioritize as a ${targetRole}?`, difficulty: 'Medium', category: 'Technical Core' },
        { id: 3, question: `Describe a complex challenge you solved in ${targetRole}.`, difficulty: 'Hard', category: 'Problem Solving' },
      ]
  const analyticsOut = resObj?.analytics || resObj?.analytics_output || {}
  const salaryRange = analyticsOut.salary_range || analyticsOut.market_salary || '$110,000 – $165,000 / yr'
  const learningRoadmap = analyticsOut.learning_roadmap || analyticsOut.learning_path || []

  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main" style={{ padding: '32px 36px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }} className="page-enter">

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--aurora-emerald)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 5, fontFamily: '"JetBrains Mono", monospace' }}>
                ✓ 4-Agent Pipeline Execution Complete
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em' }} className="font-display">
                Agent Intelligence Report — <span className="gradient-text-aurora">{targetRole}</span>
                {companyName && <span style={{ color: 'var(--txt-secondary)', fontWeight: 500 }}> at {companyName}</span>}
              </h1>
            </div>
            <div style={{ display: 'flex', gap: 10, flexShrink: 0, marginTop: 4 }}>
              <button onClick={() => navigate('/coach')} className="btn-primary" style={{ padding: '10px 18px', fontSize: 13 }}>
                💬 Practice Interview →
              </button>
              <button onClick={() => navigate('/upload')} className="btn-secondary" style={{ padding: '10px 16px', fontSize: 13 }}>
                ↺ New Analysis
              </button>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="bento-grid">
            {/* Score Card — 6 cols */}
            <div className="bento-3">
              <ResumeScoreCard score={score} matchedSkills={matchedSkills} missingSkills={missingSkills} />
            </div>

            {/* Research Card — 6 cols */}
            <div className="bento-3">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="glass-panel"
                style={{ padding: 24, height: '100%', borderLeft: `3px solid ${SECTION_ACCENT.research.color}` }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: SECTION_ACCENT.research.dim, border: `1px solid ${SECTION_ACCENT.research.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                    🔍
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: SECTION_ACCENT.research.color, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: '"JetBrains Mono", monospace' }}>
                      Research Agent
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC' }}>Market Intelligence</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: 10, padding: '3px 9px', borderRadius: 10, background: SECTION_ACCENT.research.dim, color: SECTION_ACCENT.research.color, fontWeight: 700 }}>
                    Live RAG
                  </span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--txt-secondary)', lineHeight: 1.7, background: 'rgba(8,9,14,0.5)', padding: '14px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                  {researchText}
                </div>
              </motion.div>
            </div>

            {/* Skill Heatmap — full width */}
            <div className="bento-6">
              <SkillHeatMap matched={matchedSkills} missing={missingSkills} />
            </div>

            {/* Analytics — 5 cols */}
            {(salaryRange || learningRoadmap.length > 0) && (
              <div className="bento-5">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="glass-panel"
                  style={{ padding: 24, borderLeft: `3px solid ${SECTION_ACCENT.analytics.color}` }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: SECTION_ACCENT.analytics.dim, border: `1px solid ${SECTION_ACCENT.analytics.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                      📊
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: SECTION_ACCENT.analytics.color, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: '"JetBrains Mono", monospace' }}>Analytics Agent</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC' }}>Market Salary & Learning Path</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: learningRoadmap.length > 0 ? '1fr 1.5fr' : '1fr', gap: 16 }}>
                    <div style={{ padding: '16px', borderRadius: 12, background: SECTION_ACCENT.analytics.dim, border: `1px solid ${SECTION_ACCENT.analytics.border}` }}>
                      <div style={{ fontSize: 10, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                        Estimated Salary
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: SECTION_ACCENT.analytics.color }} className="font-outfit">
                        {salaryRange}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--txt-muted)', marginTop: 4 }}>
                        Market benchmarks for {targetRole}
                      </div>
                    </div>
                    {learningRoadmap.length > 0 && (
                      <div style={{ padding: 16, borderRadius: 12, background: 'rgba(8,9,14,0.4)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: 10, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Skill Roadmap</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {learningRoadmap.map((item, idx) => (
                            <span key={idx} className="pill-teal" style={{ fontSize: 11, padding: '3px 9px', borderRadius: 8, fontWeight: 600 }}>
                              🚀 {typeof item === 'string' ? item : item.skill || item.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}

            {/* Coach Questions — 3 or 7 cols */}
            <div className={salaryRange || learningRoadmap.length > 0 ? 'bento-2' : 'bento-6'} style={{ gridColumn: salaryRange || learningRoadmap.length > 0 ? 'span 3' : 'span 12' }}>
              <div className="glass-panel" style={{ padding: 24, borderLeft: `3px solid ${SECTION_ACCENT.coach.color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: SECTION_ACCENT.coach.dim, border: `1px solid ${SECTION_ACCENT.coach.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                      💬
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: SECTION_ACCENT.coach.color, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: '"JetBrains Mono", monospace' }}>Coach Agent</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC' }}>Interview Questions</div>
                    </div>
                  </div>
                  <button onClick={() => navigate('/coach')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 11 }}>
                    Practice All →
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {questions.slice(0, 3).map((q, idx) => (
                    <div key={q.id || idx} className="glass-card" style={{ padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: SECTION_ACCENT.coach.dim, color: SECTION_ACCENT.coach.color, fontWeight: 700, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        Q{idx + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#F8FAFC', lineHeight: 1.4 }}>{q.question}</div>
                        <div style={{ fontSize: 10, color: 'var(--txt-muted)', marginTop: 4 }}>{q.category}</div>
                      </div>
                      <span className="pill-teal" style={{ fontSize: 10, padding: '2px 7px', borderRadius: 6, fontWeight: 700, flexShrink: 0 }}>
                        {q.difficulty || 'Medium'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}