import React, { useEffect, useState } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import { motion } from 'framer-motion'
import 'react-circular-progressbar/dist/styles.css'

const getColor = (score) =>
  score >= 75 ? '#34D399' :
  score >= 50 ? '#FBBF24' : '#FB7185'

const getLabel = (score) =>
  score >= 75 ? 'ATS READY' :
  score >= 50 ? 'NEEDS WORK' : 'HIGH RISK'

const SubScore = ({ label, score, delay }) => {
  const col = getColor(score)
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 12,
        padding: '8px 12px', borderRadius: 8,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <span style={{
        fontFamily: '"JetBrains Mono",monospace',
        fontSize: 9, color: '#8892B0', letterSpacing: 1,
      }}>{label}</span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 60, height: 4,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 2, overflow: 'hidden',
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, delay }}
            style={{
              height: '100%', borderRadius: 2,
              background: col,
              boxShadow: `0 0 6px ${col}66`,
            }}
          />
        </div>
        <span style={{
          fontFamily: '"JetBrains Mono",monospace',
          fontSize: 11, fontWeight: 700, color: col,
          minWidth: 28, textAlign: 'right',
        }}>{score}%</span>
      </div>
    </motion.div>
  )
}

export default function ATSScoreCard(props) {
  const result = props.result || props
  const atsScore = result.ats_score ?? result.atsScore ?? 0
  const formatScore = result.format_score ?? result.formatScore ?? 0
  const sectionScore = result.section_score ?? result.sectionScore ?? 0
  const keywordScore = result.keyword_score ?? result.keywordScore ?? 0
  const contentScore = result.content_score ?? result.contentScore ?? 0
  const passedChecks = result.passed_checks || result.passed || result.passedChecks || []
  const failedChecks = result.failed_checks || result.issues || result.failedChecks || []

  const [displayed, setDisplayed] = useState(0)
  const color = getColor(atsScore)
  const label = getLabel(atsScore)

  useEffect(() => {
    const t = setTimeout(() => setDisplayed(atsScore), 400)
    return () => clearTimeout(t)
  }, [atsScore])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'rgba(13,15,24,0.9)',
        border: '1px solid rgba(167,139,250,0.15)',
        borderRadius: 18, padding: 24,
        position: 'relative', overflow: 'hidden',
        backdropFilter: 'blur(16px)',
        height: '100%',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg,transparent,${color},transparent)`,
      }} />

      <p style={{
        fontFamily: '"JetBrains Mono",monospace',
        fontSize: 9, color: '#3D4A6B', letterSpacing: 3,
        marginBottom: 20, textAlign: 'center',
      }}>▶ ATS COMPATIBILITY SCORE</p>

      <div style={{
        width: 150, height: 150,
        margin: '0 auto 18px',
        position: 'relative',
      }}>
        <CircularProgressbar
          value={displayed}
          text={`${displayed}%`}
          strokeWidth={8}
          styles={buildStyles({
            pathColor:              color,
            trailColor:             'rgba(255,255,255,0.04)',
            textColor:              '#F0F2FF',
            textSize:               '22px',
            pathTransitionDuration: 1.4,
          })}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <span style={{
          fontFamily: '"JetBrains Mono",monospace',
          fontSize: 10, color, letterSpacing: 2, fontWeight: 600,
          padding: '4px 16px', borderRadius: 20,
          background: `${color}12`,
          border: `1px solid ${color}30`,
        }}>{label}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
        <SubScore label="FORMAT"   score={formatScore}  delay={0.15} />
        <SubScore label="SECTIONS" score={sectionScore} delay={0.20} />
        <SubScore label="KEYWORDS" score={keywordScore} delay={0.25} />
        <SubScore label="CONTENT"  score={contentScore} delay={0.30} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{
          padding: '10px', borderRadius: 10, textAlign: 'center',
          background: 'rgba(52,211,153,0.07)',
          border: '1px solid rgba(52,211,153,0.18)',
        }}>
          <div style={{
            fontFamily: '"Space Grotesk",sans-serif',
            fontWeight: 700, fontSize: '1.5rem', color: '#10B981',
          }}>{passedChecks.length}</div>
          <div style={{
            fontFamily: '"JetBrains Mono",monospace',
            fontSize: 8, color: '#10B981', letterSpacing: 1,
          }}>PASSED</div>
        </div>
        <div style={{
          padding: '10px', borderRadius: 10, textAlign: 'center',
          background: 'rgba(251,113,133,0.07)',
          border: '1px solid rgba(251,113,133,0.18)',
        }}>
          <div style={{
            fontFamily: '"Space Grotesk",sans-serif',
            fontWeight: 700, fontSize: '1.5rem', color: '#EF4444',
          }}>{failedChecks.length}</div>
          <div style={{
            fontFamily: '"JetBrains Mono",monospace',
            fontSize: 8, color: '#EF4444', letterSpacing: 1,
          }}>ISSUES</div>
        </div>
      </div>
    </motion.div>
  )
}