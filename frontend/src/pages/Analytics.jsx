import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import CircularGauge from '../components/CircularGauge'
import SalaryChart from '../components/SalaryChart'
import SkillHeatMap from '../components/SkillHeatMap'

const ROADMAP = [
  { title: 'TypeScript Mastery',           resource: 'TypeScript Docs & Practicals',   duration: '1–2 Weeks', priority: 'High',   color: '#A78BFA' },
  { title: 'GraphQL & Apollo Integration', resource: 'HowToGraphQL Course',             duration: '2 Weeks',   priority: 'High',   color: '#2DD4BF' },
  { title: 'Next.js App Router Architecture', resource: 'Next.js Learn Course',         duration: '1 Week',    priority: 'Medium', color: '#FB7185' },
  { title: 'Containerization & Docker',    resource: 'Docker Handbook',                 duration: '1 Week',    priority: 'Medium', color: '#34D399' },
]

const PRIORITY_COLOR = { High: 'var(--aurora-rose)', Medium: 'var(--aurora-amber)', Low: 'var(--aurora-teal)' }

export default function Analytics() {
  const [readinessScore] = useState(86)
  const matchedSkills = ['React', 'JavaScript', 'CSS3', 'Tailwind', 'REST APIs', 'Git', 'HTML5']
  const missingSkills = ['TypeScript', 'GraphQL', 'Next.js', 'Docker', 'Jest']

  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main" style={{ padding: '32px 36px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }} className="page-enter">

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--aurora-emerald)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 5, fontFamily: '"JetBrains Mono", monospace' }}>
              Analytics Agent Intelligence
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em' }} className="font-display">
              Career Insights & Skill Roadmap
            </h1>
          </div>

          {/* Bento Grid */}
          <div className="bento-grid">

            {/* Readiness Gauge — 3 cols */}
            <div style={{ gridColumn: 'span 3' }}>
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="glass-panel"
                style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100%', justifyContent: 'center' }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, fontFamily: '"JetBrains Mono", monospace' }}>
                  Candidate Readiness
                </div>
                <CircularGauge score={readinessScore} size={180} label="Readiness Index" colorScheme="green" />
                <div style={{ fontSize: 12, color: 'var(--aurora-emerald)', fontWeight: 700, marginTop: 14 }}>
                  ✓ Top Candidate Segment
                </div>
                <div style={{ fontSize: 11, color: 'var(--txt-muted)', marginTop: 4, lineHeight: 1.4 }}>
                  Based on market benchmarking & interview performance
                </div>
              </motion.div>
            </div>

            {/* Salary Chart — 9 cols */}
            <div style={{ gridColumn: 'span 9' }}>
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="glass-panel"
                style={{ padding: 28, height: '100%' }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5, fontFamily: '"JetBrains Mono", monospace' }}>
                  Market Compensation
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#F8FAFC', marginBottom: 20 }} className="font-display">
                  Salary Benchmarks by Experience Level
                </h3>
                <SalaryChart />
              </motion.div>
            </div>

            {/* Skill Heatmap — full */}
            <div className="bento-6">
              <SkillHeatMap matched={matchedSkills} missing={missingSkills} />
            </div>

            {/* Learning Roadmap — full */}
            <div className="bento-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="glass-panel"
                style={{ padding: 28 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(167,139,250,0.10)', border: '1px solid rgba(167,139,250,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                    🗺
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: '"JetBrains Mono", monospace' }}>
                      Targeted Action Plan
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: '#F8FAFC' }} className="font-display">
                      Skill Acquisition Roadmap
                    </h3>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {ROADMAP.map((item, idx) => (
                    <div
                      key={item.title}
                      className="glass-card"
                      style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: `3px solid ${item.color}` }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${item.color}18`, color: item.color, fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {idx + 1}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#F8FAFC' }}>{item.title}</div>
                          <div style={{ fontSize: 11, color: 'var(--txt-muted)', marginTop: 2 }}>
                            Resource: <span style={{ color: 'var(--aurora-teal)' }}>{item.resource}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                        <span style={{ fontSize: 11, color: 'var(--txt-muted)', fontWeight: 500 }}>⏱ {item.duration}</span>
                        <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 8, background: `${item.color}18`, color: item.color, fontWeight: 700 }}>
                          {item.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}