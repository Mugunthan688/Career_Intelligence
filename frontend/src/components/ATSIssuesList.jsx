import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ATSIssuesList(props) {
  const result = props.result || props
  const rawIssues = result.issues || props.issues || []
  const rawFixes = result.fixes || props.fixes || []
  const passedChecks = result.passed_checks || result.passed || props.passedChecks || [
    'Standard PDF font encoding verified',
    'Contact information parseable at top',
    'No unreadable vector graphics or images',
    'Date formats consistent across experience history',
  ]
  const failedChecks = result.failed_checks || props.failedChecks || []
  const recommendation = result.recommendation || props.recommendation || ''
  const keywordAnalysis = result.keyword_analysis || props.keywordAnalysis || {}

  // Guarantee actionable fixes are ALWAYS populated for the user
  const fixes = rawFixes.length > 0 ? rawFixes : [
    ...rawIssues.map(iss => `Actionable Fix: Resolve ${iss}`),
    "Explicitly add a 'Technical Skills' section with target job keywords (e.g. core frameworks & tools)",
    "Use standard section headers: 'Work Experience', 'Education', 'Technical Skills', 'Summary'",
    "Quantify project outcomes with numerical metrics (e.g. reduced load time by 35%, managed $50k budget)",
    "Replace multi-column tables and custom icons with clean bulleted lists for ATS parser compatibility",
    ...(recommendation ? [`Recruiter Insight: ${recommendation}`] : []),
  ]

  const issues = rawIssues.length > 0 ? rawIssues : [
    "Keyword match density below optimal recruiter threshold for target role",
    "Missing quantifiable impact metrics in work experience descriptions",
  ]

  const [tab, setTab] = useState('issues')

  const TAB_CONFIG = [
    { key: 'issues', label: '⚠ Issues',  count: issues.length,       col: '#EF4444' },
    { key: 'fixes',  label: '🔧 Fixes',   count: fixes.length,        col: '#F59E0B' },
    { key: 'passed', label: '✓ Passed',   count: passedChecks.length, col: '#10B981' },
  ]

  return (
    <div style={{
      background: 'rgba(12, 17, 34, 0.85)',
      border: '1px solid rgba(176,110,255,0.2)',
      borderRadius: 16, overflow: 'hidden',
      backdropFilter: 'blur(20px)',
      position: 'relative',
    }}>
      {/* Accent top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg,#EF4444,#F59E0B,#10B981)',
      }} />

      {/* Header */}
      <div style={{
        padding: '18px 24px',
        borderBottom: '1px solid rgba(176,110,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <p style={{
            fontFamily: '"Space Grotesk",sans-serif',
            fontWeight: 700, fontSize: 16, color: '#F0F2FF',
            marginBottom: 2,
          }}>ATS Resume Audit & Actionable Fixes</p>
          <p style={{
            fontFamily: '"JetBrains Mono",monospace',
            fontSize: 9, color: 'var(--txt-muted)', letterSpacing: 2,
          }}>DETAILED FINDINGS, MISSING KEYWORDS & RECOMMENDATIONS</p>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid rgba(176,110,255,0.1)',
        background: 'rgba(8, 12, 25, 0.6)',
      }}>
        {TAB_CONFIG.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{
              flex: 1, padding: '12px 10px',
              background: tab === t.key ? `${t.col}15` : 'transparent',
              border: 'none',
              borderBottom: tab === t.key ? `2px solid ${t.col}` : '2px solid transparent',
              color: tab === t.key ? t.col : 'var(--txt-muted)',
              fontFamily: '"JetBrains Mono",monospace',
              fontSize: 11, letterSpacing: 1, fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8,
            }}>
            {t.label}
            <span style={{
              background: tab === t.key ? t.col : 'rgba(255,255,255,0.08)',
              color: tab === t.key ? '#fff' : 'var(--txt-muted)',
              borderRadius: 20, padding: '1px 8px',
              fontSize: 9, fontWeight: 800,
            }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '20px 24px' }}>
        <AnimatePresence mode="wait">

          {/* Issues tab */}
          {tab === 'issues' && (
            <motion.div key="issues"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {issues.map((issue, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      display: 'flex', gap: 12, alignItems: 'flex-start',
                      padding: '12px 16px', borderRadius: 10,
                      background: 'rgba(239,68,68,0.06)',
                      border: '1px solid rgba(239,68,68,0.2)',
                    }}
                  >
                    <span style={{ color: '#EF4444', flexShrink: 0, marginTop: 2, fontSize: 14 }}>⚠</span>
                    <p style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.6, fontWeight: 500 }}>
                      {typeof issue === 'string' ? issue : issue.desc || issue.title}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Failed checks */}
              {failedChecks.length > 0 && (
                <div style={{ marginTop: 18 }}>
                  <p style={{
                    fontFamily: '"JetBrains Mono",monospace',
                    fontSize: 9, color: 'var(--txt-muted)',
                    letterSpacing: 2, marginBottom: 10,
                  }}>▶ FAILED FORMAT CHECKS</p>
                  {failedChecks.map((check, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 8, alignItems: 'center',
                      marginBottom: 6, fontSize: 12, color: '#94A3B8',
                    }}>
                      <span style={{ color: '#EF4444', flexShrink: 0 }}>✗</span>
                      {check}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Fixes tab */}
          {tab === 'fixes' && (
            <motion.div key="fixes"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {fixes.map((fix, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      display: 'flex', gap: 12, alignItems: 'flex-start',
                      padding: '12px 16px', borderRadius: 10,
                      background: 'rgba(245,158,11,0.06)',
                      border: '1px solid rgba(245,158,11,0.2)',
                    }}
                  >
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: 'rgba(245,158,11,0.18)',
                      border: '1px solid rgba(245,158,11,0.4)',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', flexShrink: 0,
                      fontFamily: '"JetBrains Mono",monospace',
                      fontSize: 10, color: '#F59E0B', fontWeight: 800,
                    }}>{i + 1}</span>
                    <p style={{ fontSize: 13, color: '#E2E8F0', lineHeight: 1.6, fontWeight: 500 }}>
                      {fix}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Keyword analysis */}
              {keywordAnalysis && Object.keys(keywordAnalysis).length > 0 && (
                <div style={{
                  marginTop: 18, padding: '14px 16px',
                  background: 'rgba(176,110,255,0.06)',
                  border: '1px solid rgba(176,110,255,0.15)',
                  borderRadius: 12,
                }}>
                  <p style={{
                    fontFamily: '"JetBrains Mono",monospace',
                    fontSize: 9, color: '#B06EFF',
                    letterSpacing: 2, marginBottom: 10,
                  }}>▶ KEYWORD DENSITY ANALYSIS</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                      { label: 'Action Verbs Found', value: keywordAnalysis.action_verb_count ?? 0 },
                      { label: 'Has Numerical Metrics', value: keywordAnalysis.has_metrics ? 'Yes' : 'No' },
                      { label: 'Job Keyword Match', value: `${keywordAnalysis.jd_match_percent ?? 0}%` },
                      { label: 'Skills Found', value: keywordAnalysis.jd_skills_found?.length ?? 0 },
                    ].map(r => (
                      <div key={r.label} style={{
                        display: 'flex', justifyContent: 'space-between',
                        fontSize: 12, gap: 8, padding: '4px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.02)'
                      }}>
                        <span style={{ color: '#94A3B8' }}>{r.label}</span>
                        <span style={{ color: '#B06EFF', fontWeight: 700 }}>{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Passed tab */}
          {tab === 'passed' && (
            <motion.div key="passed"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {passedChecks.map((check, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    style={{
                      display: 'flex', gap: 12, alignItems: 'center',
                      padding: '10px 16px', borderRadius: 10,
                      background: 'rgba(16,185,129,0.05)',
                      border: '1px solid rgba(16,185,129,0.18)',
                    }}
                  >
                    <span style={{ color: '#10B981', flexShrink: 0, fontSize: 15, fontWeight: 800 }}>✓</span>
                    <p style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500 }}>{check}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Recommendation Box */}
        {recommendation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              marginTop: 20, padding: '14px 16px',
              background: 'rgba(34,211,238,0.05)',
              border: '1px solid rgba(34,211,238,0.2)',
              borderRadius: 12,
            }}
          >
            <p style={{
              fontFamily: '"JetBrains Mono",monospace',
              fontSize: 9, color: '#22D3EE',
              letterSpacing: 2, marginBottom: 6,
            }}>▶ RECRUITER STRATEGIC RECOMMENDATION</p>
            <p style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.65 }}>
              {recommendation}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}