import { useState } from 'react'
import type { MealResult, MenuItem } from '../types'

type Props = {
  meal: MealResult
  onNext: (menuChoice: string) => void
}

type Stage = 'ordering' | 'confirmed' | 'arriving' | 'arrived'

export default function MealPhase({ meal, onNext }: Props) {
  const [selected, setSelected] = useState<MenuItem | null>(null)
  const [stage, setStage] = useState<Stage>('ordering')

  const handlePlaceOrder = () => {
    if (!selected) return
    setStage('confirmed')
    setTimeout(() => setStage('arriving'), 1800)
    setTimeout(() => setStage('arrived'), 3600)
  }

  return (
    <main className="menu-shell">
      <div className="menu-topbar">
        <span className="brand-badge">DatemeNot</span>
        <div className="phase-steps">
          <span className="step step-done">Match ✓</span>
          <span className="step-sep">·</span>
          <span className="step step-done">Restaurant ✓</span>
          <span className="step-sep">·</span>
          <span className="step step-active">Meal</span>
          <span className="step-sep">·</span>
          <span className="step">Wrapped</span>
        </div>
      </div>

      <div className="menu-masthead">
        <div className="menu-ornament">— ✦ —</div>
        <h1 className="menu-title">This Evening's Menu</h1>
        <p className="menu-subtitle">
          {stage === 'ordering' && 'your order will be prepared exactly as requested'}
          {stage === 'confirmed' && 'great choice. very you. (extremely concerning.)'}
          {stage === 'arriving' && 'your order is on its way…'}
          {stage === 'arrived' && 'your food has arrived'}
        </p>
        <div className="menu-ornament">— ✦ —</div>
      </div>

      <div className="menu-body">
        {meal.sections.map(section => (
          <div key={section.name} className="menu-section">
            <h3 className="menu-section-title">{section.name}</h3>
            <div className="menu-items">
              {section.items.map(item => {
                const isSelected = selected?.name === item.name
                const isOrdering = stage === 'ordering'
                return (
                  <div
                    key={item.name}
                    className={[
                      'menu-item',
                      isOrdering ? 'menu-item-selectable' : '',
                      isSelected ? 'menu-item-selected' : '',
                    ].join(' ')}
                    onClick={isOrdering ? () => setSelected(item) : undefined}
                  >
                    <div className="menu-item-header">
                      <span className="menu-item-name">{item.name}</span>
                      <span className="menu-item-rule" />
                      <span className="menu-item-price">{item.price}</span>
                    </div>
                    <p className="menu-item-desc">{item.description}</p>
                    {isSelected && stage === 'ordering' && (
                      <span className="menu-item-badge">selected</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Order tray */}
      {stage === 'ordering' && selected && (
        <div className="order-tray order-tray-open">
          <div className="order-reveal">
            <div className="order-reveal-text">
              <p className="eyebrow">ready to order</p>
              <h3>{selected.name} — {selected.price}</h3>
              <p>{selected.description}</p>
            </div>
            <button type="button" className="primary-action" onClick={handlePlaceOrder}>
              lock it in →
            </button>
          </div>
        </div>
      )}

      {stage === 'ordering' && !selected && (
        <div className="order-tray">
          <div className="order-thinking">
            <span>tap something. it won't matter.</span>
          </div>
        </div>
      )}

      {stage === 'confirmed' && (
        <div className="order-tray order-tray-open">
          <div className="order-confirmed-msg">
            <span className="order-confirmed-icon">✓</span>
            <div>
              <p className="eyebrow">order confirmed</p>
              <p className="order-confirmed-text">great choice. very you. (extremely concerning.) the kitchen has received your request.</p>
            </div>
          </div>
        </div>
      )}

      {stage === 'arriving' && (
        <div className="order-tray order-tray-open">
          <div className="order-thinking">
            <span className="gps-dot" /><span className="gps-dot" /><span className="gps-dot" />
            <span>the kitchen is preparing your order exactly as requested…</span>
          </div>
        </div>
      )}

      {stage === 'arrived' && (
        <div className="order-tray order-tray-open">
          <div className="order-reveal">
            <div className="order-reveal-text">
              <p className="eyebrow">your food has arrived</p>
              <h3>{meal.actualDish.name} — {meal.actualDish.price}</h3>
              <p>{meal.actualDish.description}</p>
              <p className="why-wrong">{meal.actualDish.narration}</p>
            </div>
            <button
              type="button"
              className="primary-action"
              onClick={() => onNext(selected?.name ?? '')}
            >
              see your date wrapped →
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
