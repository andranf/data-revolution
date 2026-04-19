/* global React */
// Main app shell — view switcher, Tweaks panel, phone frame wrapper

const { useState, useEffect } = React;

function PhoneFrame({ children, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 390, height: 780,
        borderRadius: 48,
        background: '#0a0a0a',
        padding: 12,
        boxShadow: '0 30px 60px rgba(26,31,26,0.25), 0 0 0 1px rgba(0,0,0,0.4)',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
          width: 110, height: 30, background: '#000', borderRadius: 20, zIndex: 10,
        }} />
        <div style={{
          width: '100%', height: '100%', borderRadius: 38, overflow: 'hidden',
          background: 'var(--paper)',
        }}>
          {children}
        </div>
      </div>
      {label && <div className="caps">{label}</div>}
    </div>
  );
}

function DesktopFrame({ children, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minWidth: 0 }}>
      <div style={{
        flex: 1, minHeight: 0,
        background: 'var(--cream)',
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid var(--rule)',
        boxShadow: 'var(--shadow-2)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Browser chrome */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderBottom: '1px solid var(--rule)', background: 'var(--paper-2)' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 11, height: 11, borderRadius: 11, background: '#e07563' }} />
            <div style={{ width: 11, height: 11, borderRadius: 11, background: '#e4b83a' }} />
            <div style={{ width: 11, height: 11, borderRadius: 11, background: '#7bb26a' }} />
          </div>
          <div style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-soft)' }}>
            swp.ranfurliegolf.com.au
          </div>
          <div style={{ width: 40 }} />
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {children}
        </div>
      </div>
      {label && <div className="caps">{label}</div>}
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────
function App() {
  const [view, setView] = useState('staffflow'); // staffflow | supervisor | library | onboarding
  const [staffStep, setStaffStep] = useState('slack'); // slack | doc
  const [selectedSwp, setSelectedSwp] = useState(null);
  const [openStaffId, setOpenStaffId] = useState(null);
  const [tweaksOpen, setTweaksOpen] = useState(false);

  // Tweakable state
  const [tweaks, setTweaks] = useState(
    /*EDITMODE-BEGIN*/{
      "role": "staff",
      "complianceState": "mixed",
      "reminderDays": 7,
      "signoffMethod": "typed"
    }/*EDITMODE-END*/
  );
  const setKey = (k, v) => {
    const next = { ...tweaks, [k]: v };
    setTweaks(next);
    try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*'); } catch(e){}
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', handler);
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch(e){}
    return () => window.removeEventListener('message', handler);
  }, []);

  // Role → view mapping
  useEffect(() => {
    if (tweaks.role === 'supervisor') setView('supervisor');
    else if (tweaks.role === 'staff') setView('staffflow');
    else if (tweaks.role === 'admin') setView('library');
    else if (tweaks.role === 'onboarding') setView('onboarding');
  }, [tweaks.role]);

  const chainsawSwp = getSwpContent(SWP_LIBRARY.find(s => s.id === 'CHAIN'));
  const currentSwp = selectedSwp ? getSwpContent(selectedSwp) : chainsawSwp;

  const openFromLibrary = (swp) => {
    setSelectedSwp(swp);
    setStaffStep('doc');
    setKey('role', 'staff');
  };

  const resetFlow = () => {
    setStaffStep('slack');
    setSelectedSwp(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
      {/* Top nav */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--cream)', borderBottom: '1px solid var(--rule)',
        padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, background: 'var(--fairway)', color: 'var(--cream)', borderRadius: 6, display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontSize: 18 }}>R</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, lineHeight: 1 }}>Ranfurlie SWP</div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)', letterSpacing: '0.05em' }}>Compliance & training</div>
          </div>
        </div>
        <nav style={{ display: 'flex', gap: 4, padding: 3, background: 'var(--paper-2)', border: '1px solid var(--rule)', borderRadius: 'var(--r-2)' }}>
          {[
            ['staffflow', 'Staff flow', 'user'],
            ['supervisor', 'Supervisor', 'shield'],
            ['library', 'Library', 'book'],
            ['onboarding', 'Onboarding', 'plus'],
          ].map(([k, label, icon]) => (
            <button key={k} onClick={() => { setView(k); if (k === 'staffflow') resetFlow(); if (k === 'supervisor') setOpenStaffId(null); }}
              style={{
                padding: '6px 12px', fontSize: 12.5, fontFamily: 'inherit', fontWeight: 500,
                background: view === k ? 'var(--cream)' : 'transparent',
                border: view === k ? '1px solid var(--rule)' : '1px solid transparent',
                borderRadius: 6, cursor: 'pointer',
                color: view === k ? 'var(--ink)' : 'var(--ink-soft)',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                boxShadow: view === k ? 'var(--shadow-1)' : 'none',
              }}>
              <Icon name={icon} size={13} /> {label}
            </button>
          ))}
        </nav>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)' }}>
          Signed in as <strong style={{ color: 'var(--ink)' }}>
            {tweaks.role === 'supervisor' ? 'Andrew (Superintendent)' : tweaks.role === 'admin' ? 'Admin' : tweaks.role === 'onboarding' ? 'New hire' : 'Nathan Drew'}
          </strong>
        </div>
      </header>

      {/* Body */}
      <main style={{ padding: 24 }}>
        {view === 'staffflow' && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 32, minHeight: 'calc(100vh - 120px)' }}>
            <PhoneFrame label={staffStep === 'slack' ? 'Step 1 — Slack reminder (phone)' : 'Step 2 — SWP sign-off (phone)'}>
              {staffStep === 'slack'
                ? <SlackReminder reminderDays={tweaks.reminderDays} onOpenSWP={() => setStaffStep('doc')} />
                : <SWPDocument
                    swp={currentSwp}
                    userName="Nathan Drew"
                    onBack={() => setStaffStep('slack')}
                    onComplete={() => setTimeout(resetFlow, 2500)}
                  />
              }
            </PhoneFrame>

            <div style={{ maxWidth: 320, marginTop: 40 }}>
              <div className="caps">Staff flow</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 400, margin: '6px 0 12px', lineHeight: 1.05 }}>
                {staffStep === 'slack' ? 'Reminder arrives in Slack.' : 'Read, confirm, sign — in under 5 minutes.'}
              </h2>
              <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.55 }}>
                {staffStep === 'slack'
                  ? 'Day 0 DM. Clear deadline, one-tap entry into the SWP. No email, no Notion hunt. Day 3 overdue CCs the supervisor. Day 7 locks the equipment booking.'
                  : 'Pre-start checks, interactive hazard confirmations, a 3-question hazard check, and typed-signature sign-off. Every step is captured for the audit trail.'}
              </p>
              <div style={{ marginTop: 20, padding: 14, background: 'var(--cream)', border: '1px solid var(--rule)', borderRadius: 'var(--r-2)', fontSize: 12.5 }}>
                <div className="caps" style={{ marginBottom: 6 }}>What the audit captures</div>
                <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                  <li>Signatory name + SSO identity</li>
                  <li>SWP code and version hash</li>
                  <li>Timestamp (AEST) + IP + device</li>
                  <li>Each hazard ack individually logged</li>
                  <li>Quiz answers (correct on signing)</li>
                </ul>
              </div>
              <button
                onClick={() => staffStep === 'slack' ? setStaffStep('doc') : resetFlow()}
                className="btn"
                style={{ marginTop: 16 }}
              >
                {staffStep === 'slack' ? 'Skip to sign-off →' : 'Back to Slack'}
              </button>
            </div>
          </div>
        )}

        {view === 'supervisor' && !openStaffId && (
          <DesktopFrame label="Supervisor dashboard — desktop primary">
            <SupervisorDashboard
              complianceState={tweaks.complianceState}
              onOpenStaff={(id) => setOpenStaffId(id)}
            />
          </DesktopFrame>
        )}

        {view === 'supervisor' && openStaffId && (
          <DesktopFrame label="Staff detail — compliance breakdown">
            <StaffDetail staffId={openStaffId} onBack={() => setOpenStaffId(null)} />
          </DesktopFrame>
        )}

        {view === 'library' && (
          <DesktopFrame label="SWP Library — central source of truth">
            <Library onOpen={openFromLibrary} />
          </DesktopFrame>
        )}

        {view === 'onboarding' && (
          <DesktopFrame label="New-hire induction — guided first-week setup">
            <OnboardingFlow onComplete={() => setKey('role', 'staff')} />
          </DesktopFrame>
        )}
      </main>

      {/* Tweaks panel */}
      {tweaksOpen && (
        <TweaksPanel tweaks={tweaks} setKey={setKey} onClose={() => setTweaksOpen(false)} />
      )}
    </div>
  );
}

function TweaksPanel({ tweaks, setKey, onClose }) {
  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 100,
      width: 280, background: 'var(--cream)',
      border: '1px solid var(--ink)',
      borderRadius: 'var(--r-3)',
      boxShadow: 'var(--shadow-lift)',
      padding: 16,
      fontSize: 12,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>Tweaks</div>
        <button onClick={onClose} className="btn btn-ghost" style={{ padding: 4 }}><Icon name="close" size={14} /></button>
      </div>

      <TweakSelect label="View as" value={tweaks.role} onChange={v => setKey('role', v)}
        options={[['staff', 'Nathan (Apprentice)'], ['supervisor', 'Andrew (Super)'], ['admin', 'Admin — library'], ['onboarding', 'New hire']]} />

      <TweakSelect label="Compliance state" value={tweaks.complianceState} onChange={v => setKey('complianceState', v)}
        options={[['mixed', 'Realistic mixed'], ['allgreen', 'All current'], ['overdueheavy', 'Audit-day nightmare']]} />

      <TweakSlider label="Reminder lead time" value={tweaks.reminderDays} min={1} max={30} step={1}
        onChange={v => setKey('reminderDays', v)} suffix="days before expiry" />

      <TweakSelect label="Sign-off method" value={tweaks.signoffMethod} onChange={v => setKey('signoffMethod', v)}
        options={[['typed', 'Typed name (current)'], ['slack', 'Slack-auth click'], ['drawn', 'Drawn signature']]} />

      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--rule)', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--ink-faint)', lineHeight: 1.5 }}>
        Changes persist across reload. Sign-off method variants are indicative; typed is the recommended MVP.
      </div>
    </div>
  );
}

function TweakSelect({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div className="caps" style={{ fontSize: 10, marginBottom: 5 }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {options.map(([k, label]) => (
          <button key={k} onClick={() => onChange(k)} style={{
            padding: '7px 10px', fontSize: 12, fontFamily: 'inherit', textAlign: 'left',
            background: value === k ? 'var(--ink)' : 'var(--paper-2)',
            color: value === k ? 'var(--cream)' : 'var(--ink)',
            border: '1px solid ' + (value === k ? 'var(--ink)' : 'var(--rule)'),
            borderRadius: 6, cursor: 'pointer',
          }}>{label}</button>
        ))}
      </div>
    </div>
  );
}

function TweakSlider({ label, value, min, max, step, onChange, suffix }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div className="caps" style={{ fontSize: 10, marginBottom: 5, display: 'flex', justifyContent: 'space-between' }}>
        <span>{label}</span>
        <span style={{ color: 'var(--ink)' }}>{value} {suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        style={{ width: '100%', accentColor: 'var(--fairway)' }} />
    </div>
  );
}

window.App = App;
