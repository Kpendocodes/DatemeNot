import { useMemo, useState } from 'react'
import type { CartoonName, InputUser, Scenario, VibeName } from '../types'
import { cartoonOptions, cartoonVibes, generateScenario, vibeOptions } from '../lib/claude'

type Props = {
  onComplete: (scenario: Scenario) => void
}

type DraftUser = {
  name: string
  dest: string
  cartoon: CartoonName
  vibe: VibeName | 'auto'
}

const loadingMessages = [
  'Calculating maximum regret...',
  'Cross-referencing bad decisions...',
  'Locking in disappointment...',
  'Checking group chat delusion levels...',
  'Assembling cursed route no one asked for...',
]

const defaultUser = (idx: number): DraftUser => ({
  name: idx === 0 ? 'Mario' : '',
  dest: idx === 0 ? 'Sushi' : '',
  cartoon: idx % 2 === 0 ? 'Ben 10' : 'Barbie',
  vibe: 'auto',
})

export default function InputPhase({ onComplete }: Props) {
  const [users, setUsers] = useState<DraftUser[]>([defaultUser(0), defaultUser(1)])
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = useMemo(
    () => users.every((u) => u.name.trim().length > 0 && u.dest.trim().length > 0),
    [users],
  )

  const updateUser = <K extends keyof DraftUser>(index: number, key: K, value: DraftUser[K]) => {
    setUsers((current) => current.map((user, i) => (i === index ? { ...user, [key]: value } : user)))
  }

  const addUser = () => {
    setUsers((current) => [...current, defaultUser(current.length)])
  }

  const removeUser = (index: number) => {
    setUsers((current) => {
      if (current.length <= 1) return current
      return current.filter((_, i) => i !== index)
    })
  }

  const handleGenerate = async () => {
    if (!canSubmit) {
      setError('Add a name and destination for everyone first.')
      return
    }

    setError(null)
    setLoading(true)

    const interval = setInterval(() => {
      setLoadingMsg((i) => (i + 1) % loadingMessages.length)
    }, 700)

    try {
      const payload: InputUser[] = users.map((u) => ({
        name: u.name,
        dest: u.dest,
        cartoon: u.cartoon,
        vibe: u.vibe,
      }))

      const scenario = await generateScenario(payload)

      setTimeout(() => {
        clearInterval(interval)
        onComplete(scenario)
      }, 1200)
    } catch (e) {
      clearInterval(interval)
      setLoading(false)
      setError(e instanceof Error ? e.message : 'Failed to generate cursed route.')
    }
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-orb" />
        <p className="loading-msg">{loadingMessages[loadingMsg]}</p>
        <p className="loading-sub">No AI was consulted. this is all local sabotage.</p>
      </div>
    )
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="brand-row">
          <span className="brand-badge">Cursed GPS</span>
          <span className="brand-caption">Fake AI. Real betrayal.</span>
        </div>
        <div className="hero-copy">
          <p className="eyebrow">group decision support, but evil</p>
          <h1>Tell us your vibe and we will confidently send your group to the worst possible destination.</h1>
        </div>
      </section>

      <section className="phone-frame">
        <div className="phone-topbar">
          <span>v2.0 sabotage build</span>
          <span>local-only logic</span>
          <span>{users.length} users</span>
        </div>

        <div className="control-panel input-list-panel">
          <div className="panel-heading">
            <p className="panel-label">group setup</p>
            <span>cartoon identity required</span>
          </div>

          <div className="input-user-list">
            {users.map((user, index) => (
              <article className="input-user-card" key={`${index}-${user.cartoon}`}>
                <div className="input-user-head">
                  <p className="panel-label">user {index + 1}</p>
                  <button
                    type="button"
                    className="pill chip-danger"
                    onClick={() => removeUser(index)}
                    disabled={users.length <= 1}
                  >
                    remove
                  </button>
                </div>

                <label className="input-field">
                  <span>Name</span>
                  <input
                    value={user.name}
                    onChange={(e) => updateUser(index, 'name', e.target.value)}
                    placeholder="e.g. Sarah"
                  />
                </label>

                <label className="input-field">
                  <span>Favorite destination</span>
                  <input
                    value={user.dest}
                    onChange={(e) => updateUser(index, 'dest', e.target.value)}
                    placeholder="e.g. Cocktails"
                  />
                </label>

                <label className="input-field">
                  <span>Cartoon identity</span>
                  <select
                    value={user.cartoon}
                    onChange={(e) => updateUser(index, 'cartoon', e.target.value as CartoonName)}
                  >
                    {cartoonOptions.map((cartoon) => (
                      <option key={cartoon} value={cartoon}>
                        {cartoon}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="input-field">
                  <span>Vibe (optional override)</span>
                  <select
                    value={user.vibe}
                    onChange={(e) => updateUser(index, 'vibe', e.target.value as VibeName | 'auto')}
                  >
                    <option value="auto">Auto from cartoon ({cartoonVibes[user.cartoon]})</option>
                    {vibeOptions.map((vibe) => (
                      <option key={vibe} value={vibe}>
                        {vibe}
                      </option>
                    ))}
                  </select>
                </label>
              </article>
            ))}
          </div>

          <div className="swipe-actions">
            <button type="button" className="pill" onClick={addUser}>
              + add another friend
            </button>
            <button type="button" className="generate-btn" onClick={handleGenerate} disabled={!canSubmit}>
              analyze vibe + sabotage route →
            </button>
          </div>

          {error && <p className="error-msg">{error}</p>}
        </div>
      </section>
    </main>
  )
}
