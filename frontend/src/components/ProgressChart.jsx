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
          background: '#0F172A',
          border: '1px solid rgba(176,110,255,0.3)',
          borderRadius: 10,
          padding: '10px 14px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        }}
      >
        <p style={{ color: '#F0F2FF', fontWeight: 600, fontSize: 13, margin: 0 }}>
          {data.job_role || `Session #${label}`}
        </p>
        <p style={{ color: '#3D4A6B', fontSize: 11, margin: '2px 0 6px' }}>
          {data.date || `Session ${label}`}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#B06EFF' }} />
          <span style={{ color: '#E2E8F0', fontSize: 12 }}>
            Score: <strong style={{ color: '#22D3EE' }}>{data.avg_score ?? data.score}%</strong>
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
          height: 220,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(15,23,42,0.4)',
          border: '1px dashed rgba(176,110,255,0.15)',
          borderRadius: 14,
          color: '#475569',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 12,
        }}
      >
        <span>📈 NO SESSION HISTORY DATA YET</span>
        <span style={{ fontSize: 10, marginTop: 4, color: '#334155' }}>
          Complete interview sessions to view score progression
        </span>
      </div>
    )
  }

  // Format data for chart
  const formattedData = data.map((item, index) => ({
    session: index + 1,
    avg_score: item.avg_score ?? item.score ?? 0,
    job_role: item.job_role || 'Practice Session',
    date: item.date ? new Date(item.date).toLocaleDateString() : `Session ${index + 1}`,
  }))

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#B06EFF" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22D3EE" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="session"
            stroke="#475569"
            tick={{ fill: '#475569', fontSize: 11 }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            stroke="#475569"
            tick={{ fill: '#475569', fontSize: 11 }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="avg_score"
            stroke="#B06EFF"
            strokeWidth={3}
            dot={{ r: 5, fill: '#22D3EE', stroke: '#B06EFF', strokeWidth: 2 }}
            activeDot={{ r: 8, fill: '#22D3EE', stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
