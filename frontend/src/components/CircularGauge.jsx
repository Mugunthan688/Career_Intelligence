import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CircularGauge({
  score = 0,
  size = 180,
  strokeWidth = 14,
  label = 'Overall Score',
  subLabel = '',
  colorScheme = 'purple', // 'purple' | 'cyan' | 'green' | 'rose'
}) {
  const [currentScore, setCurrentScore] = useState(0)

  useEffect(() => {
    const duration = 1000 // ms
    const steps = 30
    const increment = score / steps
    let step = 0

    const timer = setInterval(() => {
      step++
      if (step >= steps) {
        setCurrentScore(score)
        clearInterval(timer)
      } else {
        setCurrentScore(Math.round(step * increment))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [score])

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clampedScore = Math.min(Math.max(score, 0), 100)
  const offset = circumference - (clampedScore / 100) * circumference

  const gradients = {
    purple: { start: '#A78BFA', end: '#7C3AED', glow: 'rgba(167,139,250,0.25)' },
    cyan:   { start: '#2DD4BF', end: '#0891B2', glow: 'rgba(45,212,191,0.25)' },
    green:  { start: '#34D399', end: '#059669', glow: 'rgba(52,211,153,0.25)' },
    rose:   { start: '#FB7185', end: '#E11D48', glow: 'rgba(251,113,133,0.25)' },
  }

  const activeGradient = gradients[colorScheme] || gradients.purple
  const gradientId = `gauge-gradient-${colorScheme}-${Math.random().toString(36).substr(2, 4)}`

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={activeGradient.start} />
            <stop offset="100%" stopColor={activeGradient.end} />
          </linearGradient>
          <filter id={`glow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Track Background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />

        {/* Progress Arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          strokeLinecap="round"
          filter={`url(#glow-${gradientId})`}
        />
      </svg>

      {/* Center Score Text Overlay */}
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <div style={{ fontSize: size * 0.25, fontWeight: 800, lineHeight: 1, color: '#F8FAFC' }} className="font-outfit">
          {currentScore}
          <span style={{ fontSize: size * 0.12, opacity: 0.65, fontWeight: 600 }}>%</span>
        </div>
        {label && (
          <div style={{ fontSize: 11, color: 'var(--txt-secondary)', marginTop: 4, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {label}
          </div>
        )}
        {subLabel && (
          <div style={{ fontSize: 10, color: 'var(--txt-muted)', marginTop: 2 }}>
            {subLabel}
          </div>
        )}
      </div>
    </div>
  )
}
