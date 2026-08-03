import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import CircularGauge from '../components/CircularGauge'
import SalaryChart from '../components/SalaryChart'
import SkillHeatMap from '../components/SkillHeatMap'
import api from '../utils/api'

export default function Analytics() {
  const [readinessScore, setReadinessScore] = useState(86)
  const matchedSkills = ['React', 'JavaScript', 'CSS3', 'Tailwind', 'REST APIs', 'Git', 'HTML5']
  const missingSkills = ['TypeScript', 'GraphQL', 'Next.js', 'Docker', 'Jest']

  const learningRoadmap = [
    { title: 'TypeScript Mastery', resource: 'TypeScript Docs & Practicals', duration: '1-2 Weeks', priority: 'High', color: '#8B5CF6' },
    { title: 'GraphQL & Apollo Integration', resource: 'HowToGraphQL Course', duration: '2 Weeks', priority: 'High', color: '#06B6D4' },
    { title: 'Next.js App Router Architecture', resource: 'Next.js Learn Course', duration: '1 Week', priority: 'Medium', color: '#EC4899' },
    { title: 'Containerization & Docker Basics', resource: 'Docker Handbook', duration: '1 Week', priority: 'Medium', color: '#10B981' },
  ]

  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main" style={{ padding: '32px 40px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }} className="page-enter">
          {/* Top Header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              Analytics Agent Intelligence
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#FFF' }} className="font-display">
              Career Insights & Skill Roadmap
            </h1>
          </div>

          {/* Top Section: Readiness Gauge & Salary Chart */}
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, marginBottom: 28 }}>
            {/* Left: Overall Candidate Readiness Gauge */}
            <div className="glass-panel" style={{ padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                Candidate Readiness
              </div>
              <CircularGauge score={readinessScore} size={180} label="Readiness Index" colorScheme="green" />
              <div style={{ fontSize: 13, color: 'var(--green)', fontWeight: 700, marginTop: 16 }}>
                ✓ Top Candidate Readiness Segment
              </div>
              <div style={{ fontSize: 11, color: 'var(--txt-muted)', marginTop: 4 }}>
                Based on market benchmarking & interview performance
              </div>
            </div>

            {/* Right: Salary Benchmark Area Chart */}
            <div className="glass-panel" style={{ padding: 28 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                Market Compensation
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFF', marginBottom: 16 }} className="font-display">
                Salary Benchmarks by Experience Level
              </h3>
              <SalaryChart />
            </div>
          </div>

          {/* Skill Heatmap */}
          <div style={{ marginBottom: 28 }}>
            <SkillHeatMap matched={matchedSkills} missing={missingSkills} />
          </div>

          {/* Vertical Learning Roadmap Timeline */}
          <div className="glass-panel" style={{ padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', color: 'var(--violet)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                🗺
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Targeted Action Plan
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFF' }} className="font-display">
                  Skill Acquisition Roadmap
                </h3>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {learningRoadmap.map((item, idx) => (
                <div
                  key={item.title}
                  className="glass-card"
                  style={{
                    padding: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderLeft: `4px solid ${item.color}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: `${item.color}22`,
                        color: item.color,
                        fontWeight: 700,
                        fontSize: 14,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#FFF' }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--txt-secondary)', marginTop: 2 }}>
                        Resource: <span style={{ color: 'var(--cyan)' }}>{item.resource}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 12, color: 'var(--txt-muted)', fontWeight: 600 }}>⏱ {item.duration}</span>
                    <span style={{ padding: '4px 10px', borderRadius: 8, background: `${item.color}22`, color: item.color, fontSize: 11, fontWeight: 700 }}>
                      {item.priority} Priority
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}