import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { isAuthenticated, getRole } from './utils/auth'

/* ── Pages ────────────────────────────────────── */
import Login            from './pages/Login.jsx'
import Register         from './pages/Register.jsx'
import Dashboard        from './pages/Dashboard.jsx'
import ResumeUpload     from './pages/ResumeUpload.jsx'
import AgentResults     from './pages/AgentResults.jsx'
import InterviewCoach   from './pages/InterviewCoach.jsx'
import Analytics        from './pages/Analytics.jsx'
import AdminPanel       from './pages/AdminPanel.jsx'
import ATSChecker       from './pages/ATSChecker.jsx'
import InterviewHistory from './pages/InterviewHistory.jsx'
import ResumeBuilder    from './pages/ResumeBuilder.jsx'

/* ── Guard ────────────────────────────────────── */
const Guard = ({ children, roles }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />
  if (roles?.length && !roles.includes(getRole())) return <Navigate to="/dashboard" replace />
  return children
}

/* ── App ──────────────────────────────────────── */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<Navigate to="/login" replace />} />
        <Route path="/login"    element={<Login />}    />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Guard><Dashboard /></Guard>}        />
        <Route path="/upload"    element={<Guard><ResumeUpload /></Guard>}     />
        <Route path="/results"   element={<Guard><AgentResults /></Guard>}     />
        <Route path="/coach"     element={<Guard><InterviewCoach /></Guard>}   />
        <Route path="/analytics" element={<Guard><Analytics /></Guard>}        />
        <Route path="/ats"       element={<Guard><ATSChecker /></Guard>}       />
        <Route path="/history"   element={<Guard><InterviewHistory /></Guard>} />
        <Route path="/builder"   element={<Guard><ResumeBuilder /></Guard>}    />
        <Route path="/admin"     element={<Guard roles={['admin']}><AdminPanel /></Guard>} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}