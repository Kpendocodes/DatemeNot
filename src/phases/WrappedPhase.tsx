import { useEffect, useMemo, useState } from 'react'
import type { Scenario } from '../types'

type Props = {
  scenario: Scenario
  onRestart: () => void
}

export default function WrappedPhase({ scenario, onRestart }: Props) {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const timers = [1, 2, 3, 4].map((s, i) => setTimeout(() => setStage(s), (i + 1) * 650))
    return () => timers.forEach(clearTimeout)
  }, [])

  const betrayalBlocks = useMemo(() => {
    const filled = Math.round((scenario.betrayal.level / 100) * 10)
    return `${'█'.repeat(filled)}${'░'.repeat(10 - filled)}`
  }, [scenario.betrayal.level])

  return (
    <div className="wrapped-shell">
      <div className="wrapped-card">
        <div className="wrapped-header">
          <span className="wrapped-logo">DateMeNot</span>
          <span className="wrapped-year">2026</span>
        </div>

        <div className="wrapped-title-block">
          <p className="wrapped-eyebrow">Group Chaos Report</p>
          <h1 className="wrapped-headline">Wrapped.</h1>
        </div>

        <div className="wrapped-receipts">
          {stage >= 1 && (
            <div className="receipt-block">
              <p className="receipt-icon">📍</p>
              <div className="receipt-content">
                <p className="receipt-label">DESTINATION</p>
                <p className="receipt-value">{scenario.destination.name}</p>
                <p className="receipt-narrator">{scenario.destination.conflictReason}</p>
              </div>
            </div>
          )}

          {stage >= 2 && (
            <div className="receipt-block">
              <p className="receipt-icon">🧠</p>
              <div className="receipt-content">
                <p className="receipt-label">DOMINANT VIBE</p>
                <p className="receipt-value">{scenario.analysis.dominantVibe}</p>
                {scenario.users.map((u) => (
                  <p className="receipt-narrator" key={u.name}>
                    {u.name} → {u.dest} | {u.cartoon} | {u.vibe}
                  </p>
                ))}
              </div>
            </div>
          )}

          {stage >= 3 && (
            <div className="receipt-roast">
              <p className="receipt-icon">💀</p>
              <div>
                <p className="receipt-roast-text">Betrayal Level: {betrayalBlocks} {scenario.betrayal.level}%</p>
                <p className="receipt-narrator">This was {scenario.betrayal.culprit}'s fault.</p>
                <p className="receipt-narrator">{scenario.betrayal.blameLine}</p>
              </div>
            </div>
          )}

          {stage >= 4 && (
            <div className="receipt-closing">
              <p className="receipt-closing-text">Fake AI-powered. Real consequences.</p>
            </div>
          )}
        </div>

        {stage >= 4 && (
          <div className="wrapped-actions">
            <button type="button" className="wrapped-share-btn" disabled>
              record reaction (coming soon)
            </button>
            <button type="button" className="wrapped-restart-btn" onClick={onRestart}>
              run it back →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
