import { useState, useCallback } from 'react'

const PIPELINE = ['research', 'screener', 'coach', 'analytics']

const INITIAL = {
  results:     null,
  activeAgent: null,
  doneAgents:  [],
  loading:     false,
  error:       null,
  progress:    0,
}

const useAgentStream = () => {
  const [state, setState] = useState(INITIAL)

  /* ── Simulate stage-by-stage visual progress
        then call the real API fn ─────────────── */
  const run = useCallback(async (apiFn) => {
    setState({ ...INITIAL, loading: true })

    /* Animate each agent node lighting up */
    for (let i = 0; i < PIPELINE.length; i++) {
      const agent = PIPELINE[i]
      setState(s => ({
        ...s,
        activeAgent: agent,
        progress:    Math.round(((i) / PIPELINE.length) * 100),
      }))
      await new Promise(r => setTimeout(r, 700))
      setState(s => ({
        ...s,
        doneAgents: [...s.doneAgents, agent],
      }))
    }

    /* Call the real API */
    try {
      const data = await apiFn()
      setState(s => ({
        ...s,
        results:     data,
        activeAgent: null,
        loading:     false,
        progress:    100,
      }))
      return data
    } catch (err) {
      setState(s => ({
        ...s,
        error:       err.message || 'Pipeline failed',
        activeAgent: null,
        loading:     false,
      }))
      throw err
    }
  }, [])

  const reset = useCallback(() => setState(INITIAL), [])

  return { ...state, run, reset }
}

export default useAgentStream