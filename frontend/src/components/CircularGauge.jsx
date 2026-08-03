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
    purple: { start: '#8B5CF6', end: '#A855F7', glow: 'rgba(139,92,246,0.35)' },
    cyan:   { start: '#06B6D4', end: '#38BDF8', glow: 'rgba(6,182,212,0.35)' },
    green:  { start: '#10B981', end: '#34D399', glow: 'rgba(16,185,129,0.35)' },
    rose:   { start: '#F43F5E', end: '#FB7185', glow: 'rgba(244,63,94,0.35)' },
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

        {/* Track Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.07)"
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
        <div style={{ fontSize: size * 0.25, fontWeight: 800, lineHeight: 1 }} className="font-outfit text-white">
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
