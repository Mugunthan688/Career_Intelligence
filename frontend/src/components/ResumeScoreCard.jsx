import React from 'react'
import CircularGauge from './CircularGauge'

export default function ResumeScoreCard({ score = 0, matchedSkills = [], missingSkills = [] }) {
  const matchedCount = matchedSkills.length
  const missingCount = missingSkills.length
  const total = matchedCount + missingCount
  const matchRatio = total > 0 ? Math.round((matchedCount / total) * 100) : score

  const subScores = [
    { label: 'Skills Alignment', score: matchRatio, color: '#A78BFA' },
    { label: 'Experience Relevance', score: Math.min(score + 5, 100), color: '#2DD4BF' },
    { label: 'Keyword Optimization', score: Math.max(score - 8, 45), color: '#FB7185' },
    { label: 'Formatting & ATS Structure', score: Math.min(score + 10, 98), color: '#34D399' },
  ]

  return (
    <div className="glass-panel" style={{ padding: 24, height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: '"JetBrains Mono", monospace' }}>
            Screener Agent Audit
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#F8FAFC' }} className="font-display">
            Resume Match Score
          </h3>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ padding: '4px 10px', background: 'rgba(52,211,153,0.10)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 20, fontSize: 11, fontWeight: 700, color: 'var(--aurora-emerald)' }}>
            ✓ {matchedCount} Matched
          </div>
          <div style={{ padding: '4px 10px', background: 'rgba(251,113,133,0.10)', border: '1px solid rgba(251,113,133,0.25)', borderRadius: 20, fontSize: 11, fontWeight: 700, color: 'var(--aurora-rose)' }}>
            ⚠ {missingCount} Missing
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 28, alignItems: 'center' }}>
        {/* Left: Animated Circular Score Gauge */}
        <CircularGauge score={score} size={150} label="Match Score" colorScheme={score >= 75 ? 'green' : score >= 50 ? 'cyan' : 'rose'} />

        {/* Right: Sub-score Breakdown Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {subScores.map((item) => (
            <div key={item.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>
                <span style={{ color: 'var(--txt-muted)' }}>{item.label}</span>
                <span style={{ color: '#F8FAFC', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }}>{item.score}%</span>
              </div>
              <div style={{ height: 5, background: 'rgba(255, 255, 255, 0.06)', borderRadius: 3, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${item.score}%`,
                    background: `linear-gradient(90deg, ${item.color} 0%, #2DD4BF 100%)`,
                    borderRadius: 3,
                    transition: 'width 1s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}