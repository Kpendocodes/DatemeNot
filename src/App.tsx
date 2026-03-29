import { useState } from 'react'
import InputPhase from './phases/InputPhase'
import MatchPhase from './phases/MatchPhase'
import RestaurantPhase from './phases/RestaurantPhase'
import WrappedPhase from './phases/WrappedPhase'
import type { Scenario } from './types'

type Phase = 'input' | 'analysis' | 'gps' | 'wrapped'

function App() {
  const [phase, setPhase] = useState<Phase>('input')
  const [exiting, setExiting] = useState(false)
  const [scenario, setScenario] = useState<Scenario | null>(null)

  const advance = (next: Phase) => {
    setExiting(true)
    setTimeout(() => {
      setPhase(next)
      setExiting(false)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }, 320)
  }

  return (
    <div className={`phase-root ${exiting ? 'phase-exiting' : 'phase-entering'}`}>
      {phase === 'input' && (
        <InputPhase
          onComplete={(data: Scenario) => {
            setScenario(data)
            advance('analysis')
          }}
        />
      )}
      {phase === 'analysis' && scenario && (
        <MatchPhase
          scenario={scenario}
          onNext={() => {
            advance('gps')
          }}
        />
      )}
      {phase === 'gps' && scenario && (
        <RestaurantPhase
          scenario={scenario}
          onNext={() => {
            advance('wrapped')
          }}
        />
      )}
      {phase === 'wrapped' && scenario && (
        <WrappedPhase
          scenario={scenario}
          onRestart={() => {
            setScenario(null)
            advance('input')
          }}
        />
      )}
    </div>
  )
}

export default App
