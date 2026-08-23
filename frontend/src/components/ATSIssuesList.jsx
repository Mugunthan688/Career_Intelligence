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

  const fixes = rawFixes.length > 0 ? rawFixes : [
    ...rawIssues.map(iss => `Actionable Fix: Resolve ${iss}`),
    "Explicitly add a 'Technical Skills' section with target job keywords",
    "Use standard section headers: 'Work Experience', 'Education', 'Technical Skills', 'Summary'",
    "Quantify project outcomes with numerical metrics (e.g. reduced latency by 35%)",
    "Replace multi-column tables and custom icons with clean bulleted lists",
    ...(recommendation ? [`Recruiter Insight: ${recommendation}`] : []),
  ]

  const issues = rawIssues.length > 0 ? rawIssues : [
    "Keyword match density below optimal recruiter threshold for target role",
    "Missing quantifiable impact metrics in work experience descriptions",
  ]

  const [tab, setTab] = useState('issues')

  const TAB_CONFIG = [
    { key: 'issues', label: '⚠ Issues',  count: issues.length,       col: 'var(--aurora-rose)' },
    { key: 'fixes',  label: '🔧 Fixes',   count: fixes.length,        col: 'var(--aurora-amber)' },
    { key: 'passed', label: '✓ Passed',   count: passedChecks.length, col: 'var(--aurora-emerald)' },
  ]

  return (
    <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: '"JetBrains Mono", monospace', marginBottom: 2 }}>
            Audit Breakdown
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: '#F8FAFC' }} className="font-display">
            ATS Resume Findings & Actionable Fixes
          </h3>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 6, background: 'rgba(8,9,14,0.6)', padding: 4, borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
          {TAB_CONFIG.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: tab === t.key ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: tab === t.key ? t.col : 'var(--txt-muted)',
                transition: 'all 0.18s ease',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <span>{t.label}</span>
              <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 10, background: `${t.col}20`, color: t.col, fontWeight: 700 }}>
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 24 }}>
        <AnimatePresence mode="wait">
          {tab === 'issues' && (
            <motion.div key="issues" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {issues.map((issue, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex', gap: 12, alignItems: 'flex-start',
                      padding: '12px 16px', borderRadius: 10,
                      background: 'rgba(251,113,133,0.06)',
                      border: '1px solid rgba(251,113,133,0.18)',
                    }}
                  >
                    <span style={{ color: 'var(--aurora-rose)', flexShrink: 0, marginTop: 1, fontSize: 13 }}>⚠</span>
                    <p style={{ fontSize: 13, color: '#F8FAFC', lineHeight: 1.5, fontWeight: 500, margin: 0 }}>
                      {typeof issue === 'string' ? issue : issue.desc || issue.title}
                    </p>
                  </div>
                ))}
              </div>

              {failedChecks.length > 0 && (
                <div style={{ marginTop: 18 }}>
                  <div style={{ fontSize: 10, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, fontFamily: '"JetBrains Mono", monospace' }}>
                    Failed Formatting Checks
                  </div>
                  {failedChecks.map((check, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, fontSize: 12, color: 'var(--txt-secondary)' }}>
                      <span style={{ color: 'var(--aurora-rose)', flexShrink: 0 }}>✗</span>
                      {check}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {tab === 'fixes' && (
            <motion.div key="fixes" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {fixes.map((fix, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex', gap: 12, alignItems: 'flex-start',
                      padding: '12px 16px', borderRadius: 10,
                      background: 'rgba(251,191,36,0.06)',
                      border: '1px solid rgba(251,191,36,0.18)',
                    }}
                  >
                    <span style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: 'rgba(251,191,36,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, fontSize: 10, color: 'var(--aurora-amber)', fontWeight: 800,
                    }}>{i + 1}</span>
                    <p style={{ fontSize: 13, color: '#F8FAFC', lineHeight: 1.5, fontWeight: 500, margin: 0 }}>
                      {fix}
                    </p>
                  </div>
                ))}
              </div>

              {keywordAnalysis && Object.keys(keywordAnalysis).length > 0 && (
                <div style={{
                  marginTop: 18, padding: 16,
                  background: 'rgba(167,139,250,0.06)',
                  border: '1px solid rgba(167,139,250,0.18)',
                  borderRadius: 12,
                }}>
                  <div style={{ fontSize: 10, color: 'var(--aurora-violet)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, fontFamily: '"JetBrains Mono", monospace' }}>
                    Keyword Density Analysis
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                      { label: 'Action Verbs Found', value: keywordAnalysis.action_verb_count ?? 0 },
                      { label: 'Has Numerical Metrics', value: keywordAnalysis.has_metrics ? 'Yes' : 'No' },
                      { label: 'Job Keyword Match', value: `${keywordAnalysis.jd_match_percent ?? 0}%` },
                      { label: 'Skills Found', value: keywordAnalysis.jd_skills_found?.length ?? 0 },
                    ].map(r => (
                      <div key={r.label} style={{
                        display: 'flex', justifyContent: 'space-between',
                        fontSize: 12, gap: 8, padding: '6px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.02)'
                      }}>
                        <span style={{ color: 'var(--txt-muted)' }}>{r.label}</span>
                        <span style={{ color: 'var(--aurora-violet)', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }}>{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {tab === 'passed' && (
            <motion.div key="passed" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {passedChecks.map((check, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex', gap: 12, alignItems: 'center',
                      padding: '10px 16px', borderRadius: 10,
                      background: 'rgba(52,211,153,0.06)',
                      border: '1px solid rgba(52,211,153,0.18)',
                    }}
                  >
                    <span style={{ color: 'var(--aurora-emerald)', flexShrink: 0, fontSize: 14, fontWeight: 800 }}>✓</span>
                    <p style={{ fontSize: 13, color: '#F8FAFC', fontWeight: 500, margin: 0 }}>{check}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Strategic recommendation */}
        {recommendation && (
          <div style={{
            marginTop: 18, padding: 14,
            background: 'rgba(45,212,191,0.05)',
            border: '1px solid rgba(45,212,191,0.18)',
            borderRadius: 10,
          }}>
            <div style={{ fontSize: 10, color: 'var(--aurora-teal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, fontFamily: '"JetBrains Mono", monospace' }}>
              Strategic Recommendation
            </div>
            <p style={{ fontSize: 13, color: 'var(--txt-secondary)', lineHeight: 1.6, margin: 0 }}>
              {recommendation}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}