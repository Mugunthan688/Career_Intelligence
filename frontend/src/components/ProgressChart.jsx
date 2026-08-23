import React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div
        style={{
          background: 'rgba(13,15,24,0.97)',
          border: '1px solid rgba(167,139,250,0.2)',
          borderRadius: 10,
          padding: '10px 14px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <p style={{ color: '#F8FAFC', fontWeight: 600, fontSize: 12, margin: 0 }}>
          {data.job_role || `Session #${label}`}
        </p>
        <p style={{ color: 'var(--txt-muted)', fontSize: 10, margin: '2px 0 6px' }}>
          {data.date || `Session ${label}`}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--aurora-violet)' }} />
          <span style={{ color: '#E2E8F0', fontSize: 12 }}>
            Score: <strong style={{ color: 'var(--aurora-teal)' }}>{data.avg_score ?? data.score}%</strong>
          </span>
        </div>
      </div>
    )
  }
  return null
}

export default function ProgressChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          height: 200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(8,9,14,0.3)',
          border: '1px dashed rgba(255,255,255,0.08)',
          borderRadius: 12,
          color: 'var(--txt-muted)',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 11,
        }}
      >
        <span>📈 NO SESSION HISTORY DATA YET</span>
        <span style={{ fontSize: 10, marginTop: 4, color: 'var(--txt-muted)' }}>
          Complete interview sessions to view score progression
        </span>
      </div>
    )
  }

  const formattedData = data.map((item, index) => ({
    session: index + 1,
    avg_score: item.avg_score ?? item.score ?? 0,
    job_role: item.job_role || 'Practice Session',
    date: item.date ? new Date(item.date).toLocaleDateString() : `Session ${index + 1}`,
  }))

  return (
    <div style={{ width: '100%', height: 240 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="session"
            stroke="var(--txt-muted)"
            tick={{ fill: 'var(--txt-muted)', fontSize: 10 }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            stroke="var(--txt-muted)"
            tick={{ fill: 'var(--txt-muted)', fontSize: 10 }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="avg_score"
            stroke="#A78BFA"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#2DD4BF', stroke: '#A78BFA', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#2DD4BF', stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
