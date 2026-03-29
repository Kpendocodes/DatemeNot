import { useEffect, useState } from 'react'
import type { Scenario } from '../types'

type Props = {
  scenario: Scenario
  onNext: () => void
}

type Stage = 'navigating' | 'revealed'

export default function RestaurantPhase({ scenario, onNext }: Props) {
  const [visibleSteps, setVisibleSteps] = useState(0)
  const [stage, setStage] = useState<Stage>('navigating')

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    scenario.steps.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleSteps(i + 1), (i + 1) * 1700))
    })

    timers.push(
      setTimeout(() => {
        setStage('revealed')
      }, scenario.steps.length * 1700 + 800),
    )

    return () => timers.forEach(clearTimeout)
  }, [scenario.steps])

  return (
    <main className="gps-shell">
      <div className="gps-topbar">
        <span className="brand-badge brand-badge-dark">Cursed GPS</span>
        <div className="phase-steps phase-steps-dark">
          <span className="step step-done">Analysis ✓</span>
          <span className="step-sep">·</span>
          <span className="step step-active">GPS</span>
          <span className="step-sep">·</span>
          <span className="step">Wrapped</span>
        </div>
      </div>

      <div className="gps-hero">
        <div className="gps-distance-block">
          <span className="gps-distance">{scenario.totalDistance}</span>
          <span className="gps-distance-label">to your "perfect" destination</span>
        </div>
        <div className="gps-map-bg">
          <div className="gps-route-line" />
          <div className="gps-pulse-dot" />
        </div>
      </div>

      <div className="gps-steps-panel">
        {scenario.steps.slice(0, visibleSteps).map((step, i) => {
          const isCurrent = i === visibleSteps - 1 && stage === 'navigating'
          const isLast = i === scenario.steps.length - 1
          return (
            <div
              key={`${step.instruction}-${i}`}
              className={[
                'gps-step',
                isCurrent ? 'gps-step-current' : 'gps-step-done',
                isLast && stage === 'revealed' ? 'gps-step-arrived' : '',
              ].join(' ')}
            >
              <div className="gps-step-icon">
                {isCurrent ? <span>→</span> : isLast ? <span>📍</span> : <span>✓</span>}
              </div>
              <div className="gps-step-body">
                <p className="gps-step-instruction">{step.instruction}</p>
                {step.distance && <span className="gps-step-dist">{step.distance}</span>}
              </div>
            </div>
          )
        })}

        {visibleSteps < scenario.steps.length && (
          <div className="gps-calculating">
            <span className="gps-dot" /><span className="gps-dot" /><span className="gps-dot" />
            <span>Recalculating... because someone hesitated.</span>
          </div>
        )}
      </div>

      {stage === 'revealed' && (
        <div className="gps-arrival-card">
          <div className="gps-arrival-body">
            <p className="eyebrow">destination unlocked</p>
            <h2>{scenario.destination.name}</h2>
            <span className="restaurant-category-tag">{scenario.destination.category}</span>
            <p className="restaurant-pitch">Reason this is wrong: {scenario.destination.conflictReason}</p>
            <div className="users-summary-list">
              {scenario.users.map((u) => (
                <p key={u.name}>
                  {u.name} → {u.dest} | {u.cartoon} | {u.vibe}
                </p>
              ))}
            </div>
          </div>
          <div className="gps-reveal-actions">
            <button type="button" className="pill" disabled>
              record reaction (soon)
            </button>
            <button type="button" className="primary-action" onClick={onNext}>
              open betrayal wrapped →
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
