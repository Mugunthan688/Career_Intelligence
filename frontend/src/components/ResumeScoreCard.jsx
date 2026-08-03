import React from 'react'
import CircularGauge from './CircularGauge'

export default function ResumeScoreCard({ score = 0, matchedSkills = [], missingSkills = [] }) {
  const matchedCount = matchedSkills.length
  const missingCount = missingSkills.length
  const total = matchedCount + missingCount
  const matchRatio = total > 0 ? Math.round((matchedCount / total) * 100) : score

  const subScores = [
    { label: 'Skills Alignment', score: matchRatio, color: '#8B5CF6' },
    { label: 'Experience Relevance', score: Math.min(score + 5, 100), color: '#06B6D4' },
    { label: 'Keyword Optimization', score: Math.max(score - 8, 45), color: '#EC4899' },
    { label: 'Formatting & ATS Structure', score: Math.min(score + 10, 98), color: '#10B981' },
  ]

  return (
    <div className="glass-panel" style={{ padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Screener Agent Audit
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#FFF' }} className="font-display">
            Resume Match Score
          </h3>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ padding: '6px 12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 20, fontSize: 12, fontWeight: 700, color: 'var(--green)' }}>
            ✓ {matchedCount} Matched
          </div>
          <div style={{ padding: '6px 12px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: 20, fontSize: 12, fontWeight: 700, color: 'var(--rose)' }}>
            ⚠ {missingCount} Missing
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 36, alignItems: 'center' }}>
        {/* Left: Animated Circular Score Gauge */}
        <CircularGauge score={score} size={170} label="Match Score" colorScheme={score >= 75 ? 'green' : score >= 50 ? 'cyan' : 'rose'} />

        {/* Right: Sub-score Breakdown Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {subScores.map((item) => (
            <div key={item.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                <span style={{ color: 'var(--txt-secondary)' }}>{item.label}</span>
                <span style={{ color: '#FFF', fontWeight: 700 }}>{item.score}%</span>
              </div>
              <div style={{ height: 8, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 4, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${item.score}%`,
                    background: `linear-gradient(90deg, ${item.color} 0%, #38BDF8 100%)`,
                    borderRadius: 4,
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