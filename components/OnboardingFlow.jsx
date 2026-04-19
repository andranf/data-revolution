/* global React */
// Onboarding flow — bulk induction for new hires

const { useState } = React;

function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(
    SWP_LIBRARY.filter(s => ['CHAIN','GREEN','FAIRW','TRIM','BLOWER','UTE','MAN','HAND','LAD'].includes(s.id)).map(s => s.id)
  );
  const [started, setStarted] = useState({});

  const steps = ['Welcome', 'Assign SWPs', 'Training sprint', 'Done'];
  const selectedSwps = SWP_LIBRARY.filter(s => selected.includes(s.id));
  const highCount = selectedSwps.filter(s => s.risk === 'high').length;
  const estHours = Math.ceil(selectedSwps.length * 0.4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--paper)' }}>
      {/* Stepper */}
      <div style={{ padding: '14px 28px', borderBottom: '1px solid var(--rule)', background: 'var(--cream)', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div className="caps">New-hire induction</div>
        <div style={{ flex: 1, display: 'flex', gap: 8 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: i <= step ? 'var(--ink)' : 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>
              <div style={{ width: 20, height: 20, borderRadius: 20, background: i < step ? 'var(--fairway)' : i === step ? 'var(--ink)' : 'var(--rule)', color: 'white', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 600 }}>
                {i < step ? '✓' : i + 1}
              </div>
              {s}
              {i < steps.length - 1 && <div style={{ width: 20, height: 1, background: 'var(--rule)' }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '32px 28px' }}>
        {step === 0 && <WelcomeStep onNext={() => setStep(1)} />}
        {step === 1 && (
          <AssignStep
            selected={selected} setSelected={setSelected}
            onBack={() => setStep(0)} onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <SprintStep
            selectedSwps={selectedSwps}
            started={started} setStarted={setStarted}
            estHours={estHours} highCount={highCount}
            onBack={() => setStep(1)} onNext={() => setStep(3)}
          />
        )}
        {step === 3 && <DoneStep onClose={onComplete} count={selectedSwps.length} />}
      </div>
    </div>
  );
}

function WelcomeStep({ onNext }) {
  return (
    <div style={{ maxWidth: 680, margin: '40px auto' }}>
      <div className="caps">Welcome to Ranfurlie</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 64, fontWeight: 400, margin: '8px 0 8px', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
        Let's get you<br />safe on site.
      </h1>
      <p style={{ fontSize: 17, color: 'var(--ink-soft)', maxWidth: 520, lineHeight: 1.5 }}>
        This induction covers every Safe Work Procedure you'll need for your role.
        You can pause and pick up anywhere — everything saves automatically.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 32 }}>
        {[
          ['01', 'Pick your kit', 'Your supervisor has pre-selected the procedures relevant to your role. Tweak the list if you like.'],
          ['02', 'Read & confirm', 'Each SWP has a short hazard check. Takes about 4 minutes. Do them in any order, across multiple days.'],
          ['03', 'Sign off', 'Typed signature + timestamp. Auto-flows into the compliance register. Slack will remind you before renewal.'],
        ].map(([n, title, body]) => (
          <div key={n} className="card" style={{ padding: 18 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)', marginBottom: 8 }}>STEP {n}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.15, marginBottom: 6 }}>{title}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{body}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, display: 'flex', gap: 12, alignItems: 'center' }}>
        <button className="btn btn-primary" onClick={onNext} style={{ padding: '12px 20px', fontSize: 15 }}>
          <Icon name="play" size={14} /> Start induction
        </button>
        <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Approx. 45 min total · pause anytime</div>
      </div>
    </div>
  );
}

function AssignStep({ selected, setSelected, onBack, onNext }) {
  const toggle = (id) => {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };

  const grouped = {};
  SWP_LIBRARY.forEach(s => { (grouped[s.category] ||= []).push(s); });

  return (
    <div style={{ maxWidth: 820, margin: '0 auto' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 400, margin: '0 0 8px', lineHeight: 1.05 }}>
        Assigned SWPs <span style={{ color: 'var(--ink-faint)' }}>· {selected.length}</span>
      </h2>
      <p style={{ color: 'var(--ink-soft)', marginBottom: 24 }}>
        Pre-filled from your role (Apprentice, Y1). Uncheck anything irrelevant — the Head Greenkeeper will review before sign-off starts.
      </p>

      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} style={{ marginBottom: 24 }}>
          <div className="caps" style={{ marginBottom: 8 }}>{cat}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {items.map(s => {
              const on = selected.includes(s.id);
              return (
                <label key={s.id} style={{
                  display: 'grid', gridTemplateColumns: '20px 1fr auto', gap: 10, alignItems: 'center',
                  padding: '12px 14px',
                  background: on ? 'var(--cream)' : 'var(--paper-2)',
                  border: `1px solid ${on ? 'var(--ink)' : 'var(--rule)'}`,
                  borderRadius: 'var(--r-2)',
                  cursor: 'pointer', transition: 'all 0.12s',
                }}>
                  <input type="checkbox" checked={on} onChange={() => toggle(s.id)}
                    style={{ accentColor: 'var(--fairway)', margin: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontFamily: 'var(--font-mono)' }}>{s.code} · v{s.version}</div>
                  </div>
                  <RiskChip risk={s.risk} />
                </label>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, padding: '16px 0', borderTop: '1px solid var(--rule)' }}>
        <button className="btn" onClick={onBack}><Icon name="back" size={14} /> Back</button>
        <button className="btn btn-primary" onClick={onNext}>
          Assign {selected.length} SWPs <Icon name="arrow" size={14} />
        </button>
      </div>
    </div>
  );
}

function SprintStep({ selectedSwps, started, setStarted, estHours, highCount, onBack, onNext }) {
  const done = Object.values(started).filter(v => v === 'done').length;
  const progress = done / selectedSwps.length;

  const markDone = (id) => setStarted({ ...started, [id]: 'done' });

  return (
    <div style={{ maxWidth: 820, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 400, margin: '0 0 4px', lineHeight: 1 }}>Training sprint</h2>
          <p style={{ color: 'var(--ink-soft)', margin: 0 }}>
            {highCount} high-risk · ~{estHours} hours total · pick them off in any order
          </p>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-soft)' }}>
          {done} / {selectedSwps.length} complete
        </div>
      </div>

      <div style={{ height: 6, background: 'var(--paper-2)', borderRadius: 6, overflow: 'hidden', margin: '16px 0 24px' }}>
        <div style={{ width: `${progress * 100}%`, height: '100%', background: 'var(--fairway)', transition: 'width 400ms ease' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {selectedSwps.map(s => {
          const state = started[s.id] || 'todo';
          return (
            <div key={s.id} style={{
              display: 'grid', gridTemplateColumns: '32px 1fr auto', gap: 12, alignItems: 'center',
              padding: '12px 14px',
              background: state === 'done' ? 'var(--ok-bg)' : 'var(--cream)',
              border: `1px solid ${state === 'done' ? 'var(--ok)' : 'var(--rule)'}`,
              borderRadius: 'var(--r-2)',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 28,
                background: state === 'done' ? 'var(--ok)' : 'var(--paper-2)',
                color: state === 'done' ? 'white' : 'var(--ink-soft)',
                display: 'grid', placeItems: 'center',
                fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
              }}>
                {state === 'done' ? <Icon name="check" size={14} /> : s.code.split('-')[1]}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}><RiskChip risk={s.risk} /></div>
              </div>
              {state === 'done'
                ? <Chip tone="ok" icon="check">Signed</Chip>
                : <button className="btn" onClick={() => markDone(s.id)} style={{ padding: '6px 12px' }}>
                    Start <Icon name="arrow" size={12} />
                  </button>
              }
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, padding: '16px 0', borderTop: '1px solid var(--rule)' }}>
        <button className="btn" onClick={onBack}><Icon name="back" size={14} /> Back</button>
        <button className="btn btn-primary" onClick={onNext} disabled={done === 0}>
          {done === selectedSwps.length ? 'Finish induction' : 'Save & pause'} <Icon name="arrow" size={14} />
        </button>
      </div>
    </div>
  );
}

function DoneStep({ onClose, count }) {
  return (
    <div style={{ maxWidth: 520, margin: '60px auto', textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 72, color: 'var(--fairway)', lineHeight: 1 }}>✓</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 400, margin: '12px 0', lineHeight: 1.05 }}>
        You're inducted.
      </h2>
      <p style={{ color: 'var(--ink-soft)', fontSize: 16, marginBottom: 24 }}>
        {count} SWPs signed off. You'll get Slack reminders about a week before each expires.
      </p>
      <button className="btn btn-primary" onClick={onClose}>Back to library</button>
    </div>
  );
}

window.OnboardingFlow = OnboardingFlow;
