/* global React */
// SWP document detail + read flow with hazard confirmations + sign-off

const { useState, useRef, useEffect } = React;

function SWPDocument({ swp, onBack, onComplete, userName = 'Nathan Drew' }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [checkedHazards, setCheckedHazards] = useState({});
  const [quiz, setQuiz] = useState({});
  const [stage, setStage] = useState('read'); // read | quiz | sign | done
  const [typedName, setTypedName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const scrollRef = useRef(null);

  const hazards = swp.hazards || [];
  const quizQuestions = swp.quiz || [];
  const allHazardsConfirmed = hazards.every((_, i) => checkedHazards[i]);
  const allQuizCorrect = quizQuestions.every((q, i) => quiz[i] === q.answer);
  const canSign = allHazardsConfirmed && allQuizCorrect && typedName.trim().toLowerCase() === userName.toLowerCase() && agreed;

  const onScroll = (e) => {
    const el = e.target;
    const max = el.scrollHeight - el.clientHeight;
    const p = max > 0 ? Math.min(1, el.scrollTop / max) : 1;
    setScrollProgress(p);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--paper)' }}>
      {/* Top bar */}
      <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--cream)' }}>
        <button onClick={onBack} className="btn btn-ghost" style={{ padding: '6px 10px' }}>
          <Icon name="back" size={14} /> Back
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)', letterSpacing: '0.08em' }}>
            {swp.code} · VERSION {swp.version} · UPDATED {swp.updated}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, lineHeight: 1.1, marginTop: 1 }}>{swp.title}</div>
        </div>
        <RiskChip risk={swp.risk} />
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: 'var(--paper-2)', position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: 0, right: 'auto',
          width: `${stage === 'read' ? scrollProgress * 60 : stage === 'quiz' ? 60 + (Object.keys(quiz).length / Math.max(1, quizQuestions.length)) * 20 : stage === 'sign' ? 85 : 100}%`,
          background: 'var(--fairway)',
          transition: 'width 300ms ease',
        }} />
      </div>

      {/* Stage: READ */}
      {stage === 'read' && (
        <>
          <div ref={scrollRef} onScroll={onScroll} style={{ flex: 1, overflow: 'auto', padding: '20px 24px 40px' }}>
            <SWPBody swp={swp} checkedHazards={checkedHazards} setCheckedHazards={setCheckedHazards} />
          </div>
          <div style={{ padding: 14, borderTop: '1px solid var(--rule)', background: 'var(--cream)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, fontSize: 12, color: 'var(--ink-soft)' }}>
              {allHazardsConfirmed
                ? <span style={{ color: 'var(--ok)', fontWeight: 500 }}><Icon name="check" size={12}/> All {hazards.length} hazards confirmed</span>
                : <>Confirm each hazard as you read · {Object.keys(checkedHazards).filter(k => checkedHazards[k]).length}/{hazards.length}</>
              }
            </div>
            <button
              className="btn btn-primary"
              disabled={!allHazardsConfirmed}
              onClick={() => setStage(quizQuestions.length ? 'quiz' : 'sign')}
            >
              Continue <Icon name="arrow" size={14} />
            </button>
          </div>
        </>
      )}

      {/* Stage: QUIZ */}
      {stage === 'quiz' && (
        <QuizStage
          questions={quizQuestions}
          quiz={quiz}
          setQuiz={setQuiz}
          onBack={() => setStage('read')}
          onContinue={() => setStage('sign')}
          canContinue={allQuizCorrect}
        />
      )}

      {/* Stage: SIGN */}
      {stage === 'sign' && (
        <SignStage
          swp={swp}
          userName={userName}
          typedName={typedName}
          setTypedName={setTypedName}
          agreed={agreed}
          setAgreed={setAgreed}
          canSign={canSign}
          onBack={() => setStage(quizQuestions.length ? 'quiz' : 'read')}
          onSign={() => { setStage('done'); setTimeout(onComplete, 1400); }}
        />
      )}

      {/* Stage: DONE */}
      {stage === 'done' && <SignedStage swp={swp} userName={userName} />}
    </div>
  );
}

// ─── SWP BODY ─────────────────────────────────────────────────────────────
function SWPBody({ swp, checkedHazards, setCheckedHazards }) {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', fontSize: 14, lineHeight: 1.6 }}>
      {/* Purpose box */}
      <div style={{ border: '1px solid var(--rule)', background: 'var(--cream)', borderRadius: 'var(--r-3)', padding: 16, marginBottom: 20 }}>
        <div className="caps" style={{ marginBottom: 4 }}>Purpose</div>
        <div>{swp.purpose}</div>
      </div>

      {/* Metadata */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--rule)', border: '1px solid var(--rule)', borderRadius: 'var(--r-2)', overflow: 'hidden', marginBottom: 24, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
        {[
          ['AUTHOR',      'Andrew, Superintendent'],
          ['APPROVED BY', 'Club Manager · 14 Feb 2026'],
          ['REVIEW EVERY', `${swp.renewMonths} months`],
          ['PPE',         swp.ppe.join(', ')],
        ].map(([k, v]) => (
          <div key={k} style={{ background: 'var(--cream)', padding: '10px 14px' }}>
            <div style={{ color: 'var(--ink-faint)', fontSize: 10, letterSpacing: '0.08em', marginBottom: 2 }}>{k}</div>
            <div style={{ color: 'var(--ink)' }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Pre-start checks */}
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, margin: '28px 0 10px' }}>Pre-start checks</h3>
      <ol style={{ paddingLeft: 20, margin: 0 }}>
        {swp.preStart.map((item, i) => (
          <li key={i} style={{ marginBottom: 6 }}>{item}</li>
        ))}
      </ol>

      {/* Hazards — interactive */}
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, margin: '28px 0 4px' }}>Hazards & controls</h3>
      <p style={{ color: 'var(--ink-soft)', fontSize: 13, margin: '0 0 14px' }}>
        Tap each hazard to confirm you understand the control. All must be confirmed before signing.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {swp.hazards.map((h, i) => {
          const checked = !!checkedHazards[i];
          return (
            <button
              key={i}
              onClick={() => setCheckedHazards({ ...checkedHazards, [i]: !checked })}
              style={{
                textAlign: 'left',
                display: 'grid',
                gridTemplateColumns: '24px 1fr auto',
                gap: 12,
                padding: '12px 14px',
                background: checked ? 'var(--ok-bg)' : 'var(--cream)',
                border: `1px solid ${checked ? 'var(--ok)' : 'var(--rule)'}`,
                borderRadius: 'var(--r-2)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 14,
                transition: 'all 0.15s',
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                border: `1.5px solid ${checked ? 'var(--ok)' : 'var(--rule)'}`,
                background: checked ? 'var(--ok)' : 'transparent',
                color: 'white',
                display: 'grid', placeItems: 'center',
              }}>
                {checked && <Icon name="check" size={12} />}
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>{h.hazard}</div>
                <div style={{ color: 'var(--ink-soft)', fontSize: 13 }}><strong style={{ color: 'var(--ink)' }}>Control:</strong> {h.control}</div>
              </div>
              <div style={{ alignSelf: 'start' }}>
                <Chip tone={h.severity === 'H' ? 'high' : h.severity === 'M' ? 'med' : 'low'}>{h.severity}</Chip>
              </div>
            </button>
          );
        })}
      </div>

      {/* Operating procedure */}
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, margin: '28px 0 10px' }}>Operating procedure</h3>
      <ol style={{ paddingLeft: 20, margin: 0 }}>
        {swp.procedure.map((item, i) => <li key={i} style={{ marginBottom: 8 }}>{item}</li>)}
      </ol>

      {/* Emergency */}
      <div style={{ marginTop: 28, background: 'var(--risk-high-bg)', border: '1px solid var(--risk-high)', borderRadius: 'var(--r-3)', padding: 16 }}>
        <div className="caps" style={{ color: 'var(--risk-high)', marginBottom: 6 }}>Emergency</div>
        <div style={{ fontSize: 13 }}>{swp.emergency}</div>
      </div>

      <div style={{ marginTop: 24, textAlign: 'center', color: 'var(--ink-faint)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
        — END OF DOCUMENT —
      </div>
    </div>
  );
}

// ─── QUIZ ─────────────────────────────────────────────────────────────────
function QuizStage({ questions, quiz, setQuiz, onBack, onContinue, canContinue }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 24px 0', overflow: 'auto' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', width: '100%' }}>
        <div className="caps">Confirmation check · 3 questions</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 400, margin: '8px 0 6px', lineHeight: 1.1 }}>
          Quick hazard check
        </h2>
        <p style={{ color: 'var(--ink-soft)', marginBottom: 24 }}>
          Answer all three correctly to continue. No time limit.
        </p>

        {questions.map((q, qi) => (
          <div key={qi} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-faint)', marginBottom: 6 }}>Q{qi + 1} / {questions.length}</div>
            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 12 }}>{q.q}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {q.options.map((opt, oi) => {
                const selected = quiz[qi] === oi;
                const isCorrect = oi === q.answer;
                const show = quiz[qi] != null;
                const tone = !show ? 'default' : selected ? (isCorrect ? 'ok' : 'bad') : isCorrect ? 'hint' : 'default';
                const styles = {
                  default: { background: 'var(--cream)', border: '1px solid var(--rule)' },
                  ok: { background: 'var(--ok-bg)', border: '1px solid var(--ok)', color: 'var(--ok)' },
                  bad: { background: 'var(--risk-high-bg)', border: '1px solid var(--risk-high)', color: 'var(--risk-high)' },
                  hint: { background: 'var(--cream)', border: '1px dashed var(--ok)' },
                }[tone];
                return (
                  <button
                    key={oi}
                    onClick={() => setQuiz({ ...quiz, [qi]: oi })}
                    disabled={show && isCorrect && selected}
                    style={{
                      ...styles,
                      padding: '12px 14px', borderRadius: 'var(--r-2)',
                      textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                      fontSize: 14, display: 'flex', alignItems: 'center', gap: 10,
                    }}
                  >
                    <div style={{ width: 18, height: 18, borderRadius: 18, border: '1.5px solid currentColor', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      {selected && <div style={{ width: 8, height: 8, borderRadius: 8, background: 'currentColor' }} />}
                    </div>
                    <span style={{ color: tone === 'default' || tone === 'hint' ? 'var(--ink)' : 'inherit' }}>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: 'sticky', bottom: 0, padding: '14px 0', borderTop: '1px solid var(--rule)', background: 'var(--cream)', marginTop: 'auto', display: 'flex', gap: 12, justifyContent: 'space-between', marginInline: -24, paddingInline: 24 }}>
        <button className="btn" onClick={onBack}><Icon name="back" size={14} /> Back to SWP</button>
        <button className="btn btn-primary" disabled={!canContinue} onClick={onContinue}>
          Continue to sign-off <Icon name="arrow" size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── SIGN ─────────────────────────────────────────────────────────────────
function SignStage({ swp, userName, typedName, setTypedName, agreed, setAgreed, canSign, onBack, onSign }) {
  const now = new Date('2026-04-19T14:32:00');
  const timestamp = now.toISOString();

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '32px 24px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div className="caps">Digital sign-off</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 400, margin: '8px 0 8px', lineHeight: 1.05 }}>
          Sign to confirm.
        </h2>
        <p style={{ color: 'var(--ink-soft)', marginBottom: 28, fontSize: 15 }}>
          Your typed name is your signature. This goes into the compliance register and is audit-defensible under Victorian OHS Act 2004.
        </p>

        {/* Receipt */}
        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
          <div className="caps" style={{ marginBottom: 10 }}>Record to be signed</div>
          <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', rowGap: 6, fontSize: 13, fontFamily: 'var(--font-mono)' }}>
            <div style={{ color: 'var(--ink-soft)' }}>SWP</div><div>{swp.code} — {swp.title}</div>
            <div style={{ color: 'var(--ink-soft)' }}>Version</div><div>v{swp.version} ({swp.updated})</div>
            <div style={{ color: 'var(--ink-soft)' }}>Signatory</div><div>{userName}</div>
            <div style={{ color: 'var(--ink-soft)' }}>Timestamp</div><div>{timestamp}</div>
            <div style={{ color: 'var(--ink-soft)' }}>IP</div><div>10.4.22.18 (Ranfurlie Maint. WiFi)</div>
            <div style={{ color: 'var(--ink-soft)' }}>Expires</div><div>19 Oct 2026 ({swp.renewMonths} months)</div>
          </div>
        </div>

        {/* Typed signature */}
        <label style={{ display: 'block', marginBottom: 16 }}>
          <div className="caps" style={{ marginBottom: 6 }}>Type your full name</div>
          <input
            autoFocus
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            placeholder={userName}
            style={{
              width: '100%', padding: '14px 16px',
              fontFamily: 'var(--font-display)', fontSize: 26,
              background: 'var(--cream)', border: '1px solid var(--rule)',
              borderRadius: 'var(--r-2)', color: 'var(--ink)',
              outline: 'none',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--fairway)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--rule)'}
          />
          <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
            Must match <strong>{userName}</strong> exactly · captured verbatim in audit log
          </div>
        </label>

        {/* Agreement */}
        <label style={{ display: 'flex', gap: 10, padding: 14, background: 'var(--cream)', border: '1px solid var(--rule)', borderRadius: 'var(--r-2)', marginBottom: 24, cursor: 'pointer' }}>
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                 style={{ marginTop: 2, accentColor: 'var(--fairway)' }} />
          <span style={{ fontSize: 13, lineHeight: 1.5 }}>
            I have read and understood SWP {swp.code} v{swp.version}, I can identify the hazards and controls,
            and I will follow this procedure when carrying out this task. I understand false declaration may
            result in disciplinary action.
          </span>
        </label>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
          <button className="btn" onClick={onBack}><Icon name="back" size={14} /> Back</button>
          <button className="btn btn-primary" disabled={!canSign} onClick={onSign}>
            <Icon name="sign" size={14} /> Sign & record
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DONE ─────────────────────────────────────────────────────────────────
function SignedStage({ swp, userName }) {
  return (
    <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: 24, background: 'var(--paper-2)' }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{
          width: 80, height: 80, borderRadius: 80, background: 'var(--fairway)',
          color: 'var(--cream)', margin: '0 auto 20px',
          display: 'grid', placeItems: 'center',
          animation: 'pop 400ms cubic-bezier(.2,.9,.3,1.3)',
        }}>
          <Icon name="check" size={40} />
        </div>
        <div className="caps" style={{ color: 'var(--fairway)' }}>Signed & recorded</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 400, margin: '6px 0 12px', lineHeight: 1.1 }}>
          You're current until<br />19 October 2026.
        </h2>
        <div style={{ fontSize: 13, color: 'var(--ink-soft)', fontFamily: 'var(--font-mono)' }}>
          {swp.code} · {userName} · 19 Apr 2026 14:32 AEST
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>
          Audit hash: a7f2c91e · Written to compliance register
        </div>
      </div>
      <style>{`@keyframes pop { from { transform: scale(0.4); opacity: 0 } to { transform: scale(1); opacity: 1 } }`}</style>
    </div>
  );
}

window.SWPDocument = SWPDocument;
