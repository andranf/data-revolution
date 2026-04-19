/* global React */
// Library + Staff detail views

const { useState } = React;

function Library({ onOpen }) {
  const [q, setQ] = useState('');
  const filtered = SWP_LIBRARY.filter(s => !q || (s.title + s.code + s.category).toLowerCase().includes(q.toLowerCase()));
  const grouped = {};
  filtered.forEach(s => { (grouped[s.category] ||= []).push(s); });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--paper)' }}>
      <div style={{ padding: '20px 28px 16px', borderBottom: '1px solid var(--rule)', background: 'var(--cream)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="caps">SWP Library · 14 procedures · v-controlled</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 400, margin: '4px 0 0', lineHeight: 1 }}>
              Safe Work Procedures
            </h1>
          </div>
          <button className="btn"><Icon name="plus" size={14} /> New SWP</button>
        </div>
        <div style={{ marginTop: 16, position: 'relative', maxWidth: 420 }}>
          <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-faint)' }}>
            <Icon name="search" size={15} />
          </div>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search SWPs, equipment, categories…"
            style={{ width: '100%', padding: '10px 12px 10px 34px', background: 'var(--cream)', border: '1px solid var(--rule)', borderRadius: 'var(--r-2)', fontFamily: 'inherit', fontSize: 14, outline: 'none' }} />
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px 40px' }}>
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} style={{ marginBottom: 28 }}>
            <div className="caps" style={{ marginBottom: 10 }}>{cat} · {items.length}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
              {items.map(s => (
                <div key={s.id} onClick={() => onOpen(s)} className="card" style={{
                  padding: 16, cursor: 'pointer', transition: 'all 0.15s',
                }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--ink)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--rule)'; e.currentTarget.style.transform = 'none'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-faint)' }}>
                      {s.code} · v{s.version}
                    </div>
                    <RiskChip risk={s.risk} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, lineHeight: 1.15, marginBottom: 8 }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                    Renew every {s.renewMonths} months · updated {s.updated}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StaffDetail({ staffId, onBack }) {
  const person = STAFF.find(p => p.id === staffId);
  const rows = COMPLIANCE.filter(r => r.staffId === staffId).map(r => ({ ...r, swp: SWP_LIBRARY.find(s => s.id === r.swpId) }));
  const stats = { current: 0, expiring: 0, overdue: 0, pending: 0 };
  rows.forEach(r => stats[r.status]++);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--paper)' }}>
      <div style={{ padding: '16px 28px', borderBottom: '1px solid var(--rule)', background: 'var(--cream)', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button className="btn btn-ghost" onClick={onBack}><Icon name="back" size={14} /> Back to register</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
          <Avatar initials={person.avatar} size={44} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, lineHeight: 1 }}>{person.name}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
              {person.role} · {person.slack} · {person.type}
            </div>
          </div>
        </div>
        <button className="btn"><Icon name="slack" size={14} /> DM via Slack</button>
        <button className="btn"><Icon name="bell" size={14} /> Nudge all due</button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '20px 28px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          <MiniKpi label="Current" value={stats.current} tone="ok" />
          <MiniKpi label="Expiring" value={stats.expiring} tone="warn" />
          <MiniKpi label="Overdue" value={stats.overdue} tone="overdue" />
          <MiniKpi label="Not signed" value={stats.pending} tone="muted" />
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 110px 110px 110px', padding: '10px 16px', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)', letterSpacing: '0.08em', background: 'var(--paper-2)', borderBottom: '1px solid var(--rule)' }}>
            <div>CODE</div><div>SWP</div><div>STATUS</div><div>EXPIRES</div><div style={{ textAlign: 'right' }}>VERSION</div>
          </div>
          {rows.map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 110px 110px 110px', padding: '12px 16px', fontSize: 13, borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--rule-soft)', alignItems: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-soft)' }}>{r.swp.code}</div>
              <div>
                <div style={{ fontWeight: 500 }}>{r.swp.title}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-soft)' }}><RiskChip risk={r.swp.risk}/> · {r.swp.category}</div>
              </div>
              <div><StatusChip status={r.status} /></div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: r.status === 'overdue' ? 'var(--overdue)' : r.status === 'expiring' ? 'var(--warn)' : 'var(--ink)' }}>
                {formatDaysToExpiry(r.daysToExpiry)}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textAlign: 'right', color: 'var(--ink-soft)' }}>v{r.swp.version}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniKpi({ label, value, tone }) {
  const colors = { ok: 'var(--ok)', warn: 'var(--warn)', overdue: 'var(--overdue)', muted: 'var(--ink)' };
  return (
    <div className="card" style={{ padding: 14 }}>
      <div className="caps">{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: colors[tone], lineHeight: 1, marginTop: 4 }}>
        {value}
      </div>
    </div>
  );
}

window.Library = Library;
window.StaffDetail = StaffDetail;
