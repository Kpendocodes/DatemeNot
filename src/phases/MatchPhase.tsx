import { useEffect, useState } from 'react'
import type { Scenario } from '../types'

type Props = {
  scenario: Scenario
  onNext: () => void
}

const loadingMessages = [
  'Analyzing group vibe...',
  'Checking for main-character inflation...',
  'Measuring delusion per capita...',
  'Scoring sabotage potential...',
]

export default function MatchPhase({ scenario, onNext }: Props) {
  const [stage, setStage] = useState<'loading' | 'results'>('loading')
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    if (stage !== 'loading') return

    const loop = setInterval(() => {
      setMsgIndex((i) => (i + 1) % loadingMessages.length)
    }, 700)

    const done = setTimeout(() => {
      clearInterval(loop)
      setStage('results')
    }, 2600)

    return () => {
      clearInterval(loop)
      clearTimeout(done)
    }
  }, [stage])

  if (stage === 'loading') {
    return (
      <div className="loading-screen">
        <div className="loading-orb" />
        <p className="loading-msg">{loadingMessages[msgIndex]}</p>
        <p className="loading-sub">vibe model confidence: suspiciously high</p>
      </div>
    )
  }

  return (
    <main className="app-shell">
      <section className="phase-header">
        <div className="brand-row">
          <span className="brand-badge">DateMeNot</span>
          <div className="phase-steps">
            <span className="step step-active">Analysis</span>
            <span className="step-sep">·</span>
            <span className="step">GPS</span>
            <span className="step-sep">·</span>
            <span className="step">Wrapped</span>
          </div>
        </div>
      </section>

      <section className="analysis-shell">
        <div className="match-reveal-header">
          <p className="eyebrow">group vibe report</p>
          <h1>Results are in. Nobody is safe.</h1>
          <p className="match-reveal-sub">Dominant vibe: {scenario.analysis.dominantVibe}</p>
        </div>

        <div className="analysis-grid">
          {scenario.analysis.breakdown.map((row) => (
            <div key={row.vibe} className="analysis-row">
              <div className="analysis-row-head">
                <span>{row.vibe}</span>
                <strong>{row.percentage}%</strong>
              </div>
              <div className="analysis-meter">
                <div className="analysis-meter-fill" style={{ width: `${row.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="match-cta">
          <p className="match-cta-note">This analysis is local, fast, and almost certainly biased.</p>
          <button type="button" className="primary-action" onClick={onNext}>
            start DateMeNot gps →
          </button>
        </div>
      </section>
    </main>
  )
}
