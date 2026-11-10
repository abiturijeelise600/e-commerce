import { useMemo, useState } from 'react'

const actions = [
  { id: 'walk', icon: '↗', title: 'Choose a lower-carbon trip', text: 'Walk, cycle, share a ride, or use public transport when it works for you.' },
  { id: 'food', icon: '✳', title: 'Make food choices count', text: 'Try a plant-rich meal and plan portions to reduce food waste.' },
  { id: 'energy', icon: '⌁', title: 'Use energy thoughtfully', text: 'Switch off unused lights and choose efficient appliances when replacing them.' },
  { id: 'nature', icon: '❋', title: 'Care for local nature', text: 'Support healthy trees, wetlands, and green spaces in your community.' },
]

export default function App() {
  const [distance, setDistance] = useState('')
  const [transport, setTransport] = useState('car')
  const [meals, setMeals] = useState('')
  const [pledged, setPledged] = useState(() => {
    try { return JSON.parse(localStorage.getItem('climate-forward-actions')) || [] } catch { return [] }
  })

  const estimate = useMemo(() => {
    const km = Math.max(0, Number(distance) || 0)
    const mealCount = Math.max(0, Number(meals) || 0)
    const transportFactor = { car: 0.192, bus: 0.105, walking: 0, cycling: 0 }[transport]
    return Math.round((km * transportFactor * 10 + mealCount * 8) * 10) / 10
  }, [distance, transport, meals])

  function toggleAction(id) {
    const next = pledged.includes(id) ? pledged.filter((item) => item !== id) : [...pledged, id]
    setPledged(next)
    localStorage.setItem('climate-forward-actions', JSON.stringify(next))
  }

  return (
    <main>
      <header className="nav wrap">
        <a className="brand" href="#home" aria-label="Climate Forward home">
          <span className="brand-mark">C</span>
          <span>CLIMATE<span className="brand-light">FORWARD</span></span>
        </a>

        <nav aria-label="Main navigation">
          <a href="#learn">Learn</a>
          <a href="#calculator">Explore your footprint</a>
          <a href="#actions">Take action</a>
        </nav>

        <a className="nav-cta" href="#actions">Start with one step <span>↗</span></a>
      </header>

      <section id="home" className="hero wrap">
        <div className="hero-copy">
          <span className="eyebrow"><i /> A practical guide to climate action</span>
          <h1>A better future<br />is <em>built together.</em></h1>
          <p>Understand the changing climate, discover everyday choices that can help, and find a first step that feels possible.</p>

          <div className="hero-buttons">
            <a className="button button-lime" href="#learn">Explore the guide <span>↓</span></a>
            <a className="text-link" href="#calculator">Try the simple estimator <span>↗</span></a>
          </div>

          <div className="hero-note">
            <span className="avatar-stack"><b>●</b><b>●</b><b>●</b></span>
            <span>Knowledge, community, and action matter.</span>
          </div>
        </div>

        <div className="hero-art" aria-label="Illustration of a green landscape">
          <div className="sun" />
          <div className="art-label"><span className="pulse"/> OUR SHARED HOME</div>
          <div className="hill hill-back" />
          <div className="hill hill-front" />
          <div className="tree tree-one"><i /><b /></div>
          <div className="tree tree-two"><i /><b /></div>
          <div className="art-caption">Small steps.<br /><strong>Lasting change.</strong></div>
          <span className="art-coordinate">01 — 04 / CLIMATE</span>
        </div>
      </section>

      <section className="ticker" aria-label="Climate action message">
        <div className="ticker-inner">ACT LOCALLY <span>✳</span> THINK LONG TERM <span>✳</span> MAKE ROOM FOR EVERY VOICE <span>✳</span> ACT LOCALLY <span>✳</span> THINK LONG TERM <span>✳</span></div>
      </section>

      <section id="learn" className="learn wrap section-pad">
        <div className="section-intro">
          <span className="eyebrow dark">01 / Understand</span>
          <h2>Climate change,<br /><em>made clearer.</em></h2>
        </div>

        <div className="learn-copy">
          <p className="lead">Earth’s climate is changing, largely because human activities release heat-trapping greenhouse gases. The impacts are felt differently in different places and communities.</p>
          <p>There is no single solution. Cutting pollution, preparing for local risks, protecting nature, and making fair choices all contribute to a more resilient future.</p>
          <a className="inline-link" href="https://www.ipcc.ch/" target="_blank" rel="noreferrer">Explore climate science from the IPCC <span>↗</span></a>
        </div>
      </section>

      <section className="fact-band">
        <div className="wrap fact-grid">
          <div>
            <span className="eyebrow">A useful reminder</span>
            <h2>Climate action is<br /><em>many things.</em></h2>
          </div>

          <article>
            <span className="fact-number">01</span>
            <h3>Reduce emissions</h3>
            <p>Cleaner energy, efficient buildings, and thoughtful transport choices can reduce greenhouse gas pollution.</p>
          </article>

          <article>
            <span className="fact-number">02</span>
            <h3>Prepare together</h3>
            <p>Communities can plan for heat, heavy rain, drought, and other local climate risks.</p>
          </article>

          <article>
            <span className="fact-number">03</span>
            <h3>Protect nature</h3>
            <p>Healthy ecosystems support people and wildlife. Local knowledge helps guide good decisions.</p>
          </article>
        </div>
      </section>

      <section id="calculator" className="calculator-section wrap section-pad">
        <div className="calc-heading">
          <div>
            <span className="eyebrow dark">02 / Explore</span>
            <h2>A small snapshot<br /><em>of everyday choices.</em></h2>
          </div>
          <p>This simple estimate uses broad illustrative factors for the inputs below. It is not a full personal carbon footprint and should not be used for comparisons or official reporting.</p>
        </div>

        <div className="calculator-card">
          <div className="calc-form">
            <label>
              Weekly travel distance <span>kilometres</span>
              <input type="number" min="0" inputMode="decimal" placeholder="e.g. 40" value={distance} onChange={(e) => setDistance(e.target.value)} />
            </label>

            <label>
              Usual travel mode
              <select value={transport} onChange={(e) => setTransport(e.target.value)}>
                <option value="car">Car (illustrative average)</option>
                <option value="bus">Bus (illustrative average)</option>
                <option value="walking">Walking</option>
                <option value="cycling">Cycling</option>
              </select>
            </label>

            <label>
              Plant-rich meals you might try this week <span>meals</span>
              <input type="number" min="0" inputMode="numeric" placeholder="e.g. 3" value={meals} onChange={(e) => setMeals(e.target.value)} />
            </label>
          </div>

          <div className="calc-result">
            <span className="result-label">Illustrative weekly estimate</span>
            <strong>{estimate.toFixed(1)} <small>kg CO₂e</small></strong>
            <p>Based only on the travel and meal inputs above. Real-world impacts vary by location, vehicle, energy mix, and food choices.</p>
            <a href="https://www.un.org/en/climatechange" target="_blank" rel="noreferrer">Learn more about climate change <span>↗</span></a>
          </div>
        </div>
      </section>

      <section id="actions" className="actions-section">
        <div className="wrap section-pad">
          <div className="actions-heading">
            <div>
              <span className="eyebrow">03 / Take action</span>
              <h2>Pick a step.<br /><em>Make it yours.</em></h2>
            </div>
            <p>Progress is personal and collective. Choose actions that fit your circumstances, and invite others when you can.</p>
          </div>

          <div className="action-grid">
            {actions.map((action, index) => (
              <article className="action-card" key={action.id}>
                <div className="action-top">
                  <span className="action-icon">{action.icon}</span>
                  <span className="action-count">0{index + 1}</span>
                </div>
                <h3>{action.title}</h3>
                <p>{action.text}</p>
                <button className={pledged.includes(action.id) ? 'pledge selected' : 'pledge'} type="button" onClick={() => toggleAction(action.id)}>
                  {pledged.includes(action.id) ? 'Added to my steps ✓' : 'I’ll try this'} <span>↗</span>
                </button>
              </article>
            ))}
          </div>

          <div className="pledge-summary">
            <span className="summary-dot" />
            <span>{pledged.length ? `You chose ${pledged.length} ${pledged.length === 1 ? 'step' : 'steps'} — a thoughtful place to begin.` : 'Your selected steps are saved on this device only.'}</span>
            <button type="button" onClick={() => { setPledged([]); localStorage.removeItem('climate-forward-actions') }} disabled={!pledged.length}>Clear selections</button>
          </div>
        </div>
      </section>

      <section className="closing wrap">
        <div>
          <span className="eyebrow dark">Keep learning</span>
          <h2>Hope is a practice.<br /><em>So is action.</em></h2>
        </div>

        <div>
          <p>Start with curiosity. Learn from trusted climate science and people in your community. Then choose a practical next step.</p>
          <a className="button button-dark" href="https://www.un.org/en/climatechange" target="_blank" rel="noreferrer">Visit the UN climate guide <span>↗</span></a>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap footer-inner">
          <a className="brand" href="#home">
            <span className="brand-mark">C</span>
            <span>CLIMATE<span className="brand-light">FORWARD</span></span>
          </a>
          <p>An educational climate awareness demo. Estimates are illustrative, not professional advice.</p>
          <a href="#home">Back to top ↑</a>
        </div>
      </footer>
    </main>
  )
}
