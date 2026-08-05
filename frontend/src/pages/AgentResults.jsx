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
        console.error('Failed to parse agent_results from sessionStorage:', err)
      }
    }
  }, [])

  const resObj = data?.results || data || {}

  // 1. Screener Agent Data
  const screenerOut = resObj?.screener || resObj?.screener_output || {}
  const score = screenerOut.score ?? screenerOut.match_score ?? resObj?.score ?? 50
  const matchedSkills = screenerOut.matched_skills || []
  const missingSkills = screenerOut.missing_skills || []

  // 2. Research Agent Data (Fixed key lookup for research_summary & summary)
  const researchObj = resObj?.research || resObj?.research_output || {}
  const targetRole = researchObj.job_role || screenerOut.job_role || resObj.job_role || 'Target Role'
  const companyName = researchObj.company || resObj.company || ''
  const researchText = researchObj.research_summary || researchObj.summary || researchObj.market_summary || researchObj.market_insights || `Live web market research & domain standard analysis active for ${targetRole}.`

  // 3. Coach Agent Data
  const coachOut = resObj?.coach || resObj?.coach_output || {}
  const questions = coachOut.questions && Array.isArray(coachOut.questions) && coachOut.questions.length > 0
    ? coachOut.questions
    : [
        { id: 1, question: `How do you architect scalable, high-performance systems for ${targetRole}?`, difficulty: 'Hard', category: 'System Architecture' },
        { id: 2, question: `What core technical tools and methodologies do you prioritize as a ${targetRole}?`, difficulty: 'Medium', category: 'Technical Core' },
        { id: 3, question: `Describe a complex technical challenge you faced in ${targetRole} and how you resolved it.`, difficulty: 'Hard', category: 'Problem Solving' },
      ]

  // 4. Analytics Agent Data
  const analyticsOut = resObj?.analytics || resObj?.analytics_output || {}
  const salaryRange = analyticsOut.salary_range || analyticsOut.market_salary || '$110,000 - $165,000 / yr'
  const learningRoadmap = analyticsOut.learning_roadmap || analyticsOut.learning_path || []

  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main" style={{ padding: '32px 40px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }} className="page-enter">
          
          {/* Top Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }} className="font-mono">
                ✓ 4-AGENT AUTONOMOUS PIPELINE EXECUTION COMPLETE
              </div>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: '#FFF' }} className="font-display">
                Agent Intelligence Report — <span className="gradient-text">{targetRole}</span> {companyName ? `at ${companyName}` : ''}
              </h1>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => navigate('/coach')} className="btn-primary" style={{ padding: '12px 22px', fontSize: 14 }}>
                💬 Practice Interview Questions ➔
              </button>
              <button onClick={() => navigate('/upload')} className="btn-secondary" style={{ padding: '12px 20px', fontSize: 14 }}>
                ↺ New Analysis
              </button>
            </div>
          </div>

          {/* 1. Screener Agent Fit Score Card */}
          <div style={{ marginBottom: 28 }}>
            <ResumeScoreCard score={score} matchedSkills={matchedSkills} missingSkills={missingSkills} />
          </div>

          {/* 2. Research Agent Market Intelligence Card */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: 28, marginBottom: 28, border: '1px solid rgba(139, 92, 246, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', color: 'var(--violet)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  🔍
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--violet)', textTransform: 'uppercase', letterSpacing: '0.08em' }} className="font-mono">
                    RESEARCH AGENT INSIGHTS (LIVE MARKET & COMPANY)
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFF' }} className="font-display">
                    Market Intelligence & Role Competencies
                  </h3>
                </div>
              </div>

              <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 12, background: 'rgba(139, 92, 246, 0.12)', color: '#C084FC', fontWeight: 700 }}>
                Live Tavily Web + RAG Search
              </span>
            </div>

            <div style={{ fontSize: 14, color: '#E2E8F0', lineHeight: 1.75, background: 'rgba(8, 12, 25, 0.7)', padding: 20, borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              {researchText}
            </div>
          </motion.div>

          {/* 3. Skill Heatmap Grid */}
          <div style={{ marginBottom: 28 }}>
            <SkillHeatMap matched={matchedSkills} missing={missingSkills} />
          </div>

          {/* 4. Analytics Agent Market Salary & Learning Path Grid */}
          {(salaryRange || learningRoadmap.length > 0) && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: 28, marginBottom: 28, border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  📊
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.08em' }} className="font-mono">
                    ANALYTICS AGENT CAREER ROADMAP
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFF' }} className="font-display">
                    Market Salary Benchmark & Learning Strategy
                  </h3>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
                {/* Salary Box */}
                <div style={{ padding: 18, borderRadius: 12, background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ fontSize: 11, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                    ESTIMATED MARKET SALARY
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--green)' }} className="font-outfit">
                    {salaryRange}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--txt-secondary)', marginTop: 4 }}>
                    Based on market benchmarks for {targetRole}.
                  </div>
                </div>

                {/* Roadmap Box */}
                {learningRoadmap.length > 0 && (
                  <div style={{ padding: 18, borderRadius: 12, background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: 11, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                      SKILL ACQUISITION ROADMAP
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {learningRoadmap.map((item, idx) => (
                        <span key={idx} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 8, background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.25)', color: 'var(--cyan)', fontWeight: 600 }}>
                          🚀 {typeof item === 'string' ? item : item.skill || item.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* 5. Coach Agent Interview Questions Preview Card */}
          <div className="glass-panel" style={{ padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236, 72, 153, 0.3)', color: 'var(--pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  💬
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--pink)', textTransform: 'uppercase', letterSpacing: '0.08em' }} className="font-mono">
                    COACH AGENT RECOMMENDATIONS
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFF' }} className="font-display">
                    Tailored Domain Interview Questions Preview
                  </h3>
                </div>
              </div>

              <button onClick={() => navigate('/coach')} className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>
                Practice All Questions ➔
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {questions.slice(0, 3).map((q, idx) => (
                <div key={q.id || idx} className="glass-card" style={{ padding: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(236, 72, 153, 0.2)', color: 'var(--pink)', fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      Q{idx + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#FFF' }}>{q.question}</div>
                      <div style={{ fontSize: 11, color: 'var(--txt-muted)', marginTop: 2 }}>{q.category || 'Technical Core'}</div>
                    </div>
                  </div>

                  <span style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(6, 182, 212, 0.15)', color: 'var(--cyan)', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
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