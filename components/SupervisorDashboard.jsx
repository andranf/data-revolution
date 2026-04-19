/* global React */
// Supervisor compliance dashboard

const { useState, useMemo } = React;

function SupervisorDashboard({ onOpenStaff, complianceState = 'mixed' }) {
  const [filter, setFilter] = useState('all'); // all | overdue | expiring | pending
  const [search, setSearch] = useState('');

  // Apply compliance-state tweak
  const rows = useMemo(() => {
    if (complianceState === 'allgreen') {
      return COMPLIANCE.map(r => ({ ...r, status: 'current', daysToExpiry: 120 }));
    }
    if (complianceState === 'overdueheavy') {
      return COMPLIANCE.map(r => {
        const h = (r.staffId.charCodeAt(0) + r.swpId.charCodeAt(0)) % 10;
        if (h < 5) return { ...r, status: 'overdue', daysToExpiry: -(h + 3) };
        if (h < 8) return { ...r, status: 'expiring', daysToExpiry: h };
        return r;
      });
    }
    return COMPLIANCE;
  }, [complianceState]);

  const stats = useMemo(() => {
    const s = { current: 0, expiring: 0, overdue: 0, pending: 0, total: rows.length };
    rows.forEach(r => s[r.status]++);
    return s;
  }, [rows]);

  const complianceRate = Math.round(((stats.current) / stats.total) * 100);

  // Per-staff rollup
  const byStaff = useMemo(() => {
    const map = {};
    STAFF.forEach(p => { map[p.id] = { ...p, rows: [], stats: { current: 0, expiring: 0, overdue: 0, pending: 0 } }; });
    rows.forEach(r => {
      if (!map[r.staffId]) return;
      map[r.staffId].rows.push(r);
      map[r.staffId].stats[r.status]++;
    });
    return Object.values(map).filter(p => p.rows.length);
  }, [rows]);

  const filteredStaff = byStaff.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'all') return true;
    return p.stats[filter] > 0;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--paper)' }}>
      {/* Header */}
      <div style={{ padding: '20px 28px 16px', borderBottom: '1px solid var(--rule)', background: 'var(--cream)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <div className="caps">Compliance register · Monday 19 April 2026</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 400, margin: '4px 0 0', lineHeight: 1 }}>
              Supervisor view
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn"><Icon name="download" size={14} /> Export audit CSV</button>
            <button className="btn btn-primary"><Icon name="plus" size={14} /> Toolbox talk</button>
          </div>
        </div>

        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 20 }}>
          <Kpi label="Compliance rate" value={`${complianceRate}%`} tone={complianceRate > 85 ? 'ok' : complianceRate > 70 ? 'warn' : 'overdue'} sub={`${stats.current} of ${stats.total} sign-offs current`} />
          <Kpi label="Overdue" value={stats.overdue} tone={stats.overdue ? 'overdue' : 'muted'} sub="Escalated to supervisor"/>
          <Kpi label="Expiring <30 days" value={stats.expiring} tone={stats.expiring ? 'warn' : 'muted'} sub="Slack DMs scheduled" />
          <Kpi label="Never signed" value={stats.pending} tone="muted" sub="New hires / new SWPs" />
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 28px 40px' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '0 1 260px' }}>
            <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-faint)' }}>
              <Icon name="search" size={14} />
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search staff…"
              style={{
                width: '100%', padding: '8px 10px 8px 30px',
                background: 'var(--cream)', border: '1px solid var(--rule)',
                borderRadius: 'var(--r-2)', fontFamily: 'inherit', fontSize: 13, outline: 'none',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 4, padding: 3, background: 'var(--paper-2)', border: '1px solid var(--rule)', borderRadius: 'var(--r-2)' }}>
            {[
              ['all', `All (${byStaff.length})`],
              ['overdue', `Overdue (${stats.overdue})`],
              ['expiring', `Expiring (${stats.expiring})`],
              ['pending', `Not signed (${stats.pending})`],
            ].map(([k, label]) => (
              <button key={k} onClick={() => setFilter(k)} style={{
                padding: '6px 12px', fontSize: 12, fontFamily: 'inherit', fontWeight: 500,
                background: filter === k ? 'var(--cream)' : 'transparent',
                border: filter === k ? '1px solid var(--rule)' : '1px solid transparent',
                borderRadius: 6, cursor: 'pointer',
                color: filter === k ? 'var(--ink)' : 'var(--ink-soft)',
                boxShadow: filter === k ? 'var(--shadow-1)' : 'none',
              }}>{label}</button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ fontSize: 12, color: 'var(--ink-soft)', fontFamily: 'var(--font-mono)' }}>
            Last sync: just now · Zapier OK
          </div>
        </div>

        {/* Matrix */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 120px 80px', alignItems: 'center', padding: '10px 16px', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)', letterSpacing: '0.08em', background: 'var(--paper-2)', borderBottom: '1px solid var(--rule)' }}>
            <div>STAFF</div>
            <div>SWP COVERAGE (HOVER A CELL)</div>
            <div>NEXT EXPIRY</div>
            <div style={{ textAlign: 'right' }}></div>
          </div>

          {filteredStaff.map((p, i) => <StaffRow key={p.id} person={p} onOpen={() => onOpenStaff(p.id)} last={i === filteredStaff.length - 1} />)}
          {filteredStaff.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-soft)' }}>
              No staff match these filters.
            </div>
          )}
        </div>

        {/* Activity feed + upcoming */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
          <ActivityFeed />
          <UpcomingExpiries rows={rows} />
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, tone = 'muted' }) {
  const colors = {
    ok: 'var(--ok)', warn: 'var(--warn)', overdue: 'var(--overdue)', muted: 'var(--ink)',
  };
  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="caps">{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 400, lineHeight: 1, margin: '6px 0 4px', color: colors[tone] }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{sub}</div>
    </div>
  );
}

function StaffRow({ person, onOpen, last }) {
  // Limit SWP coverage cells to first 14
  const cells = person.rows.slice(0, 14);
  const nextExpiry = person.rows
    .filter(r => r.daysToExpiry != null && r.status !== 'current')
    .sort((a, b) => (a.daysToExpiry || 0) - (b.daysToExpiry || 0))[0];

  return (
    <div
      onClick={onOpen}
      style={{
        display: 'grid', gridTemplateColumns: '240px 1fr 120px 80px',
        alignItems: 'center', padding: '12px 16px',
        borderBottom: last ? 'none' : '1px solid var(--rule-soft)',
        cursor: 'pointer',
      }}
      onMouseOver={e => e.currentTarget.style.background = 'var(--paper-2)'}
      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <Avatar initials={person.avatar} size={32} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 500, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{person.name}</div>
          <div style={{ fontSize: 11, color: 'var(--ink-soft)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{person.role} · {person.slack}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {cells.map((r, i) => {
          const swp = SWP_LIBRARY.find(s => s.id === r.swpId);
          const bg = r.status === 'current' ? 'var(--ok)'
                   : r.status === 'expiring' ? 'var(--warn)'
                   : r.status === 'overdue' ? 'var(--overdue)'
                   : 'var(--rule)';
          return (
            <div key={i} title={`${swp.code} ${swp.title} · ${statusLabel[r.status]}${r.daysToExpiry != null ? ' · ' + formatDaysToExpiry(r.daysToExpiry) : ''}`}
                 style={{
                   width: 20, height: 20, borderRadius: 4, background: bg,
                   display: 'grid', placeItems: 'center',
                   color: 'white', fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 600,
                 }}>
              {swp.code.split('-')[1]?.slice(-2) || ''}
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)' }}>
        {nextExpiry ? (
          <span style={{ color: nextExpiry.status === 'overdue' ? 'var(--overdue)' : nextExpiry.status === 'expiring' ? 'var(--warn)' : 'var(--ink-soft)' }}>
            {formatDaysToExpiry(nextExpiry.daysToExpiry)}
          </span>
        ) : <span style={{ color: 'var(--ok)' }}>All current</span>}
      </div>

      <div style={{ textAlign: 'right', color: 'var(--ink-faint)' }}>
        <Icon name="chevron" size={14} />
      </div>
    </div>
  );
}

function ActivityFeed() {
  const items = [
    { who: 'Mitch Mahoney',    what: 'signed',    swp: 'SWP-006 Greens Mower v1.3',    when: '14 min ago', tone: 'ok' },
    { who: 'SWP Bot',          what: 'DM sent to',swp: 'Nathan Drew · Chainsaw expiring', when: '1h ago', tone: 'warn' },
    { who: 'Andrew',           what: 'updated',   swp: 'SWP-001 Kobelco Excavator v2.1 → v2.2', when: '3h ago', tone: 'muted' },
    { who: 'Joshua Cope',      what: 'signed',    swp: 'SWP-008 Backpack Blower v1.2',  when: 'Yesterday', tone: 'ok' },
    { who: 'System',           what: 'escalated to Andrew:', swp: 'Brodie Macdonald · Manual Handling overdue 3d', when: 'Yesterday', tone: 'overdue' },
    { who: 'Tremayne Gallagher', what: 'signed',  swp: 'SWP-009 Line Trimmer v1.1',     when: '2d ago', tone: 'ok' },
  ];
  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <div className="caps">Activity</div>
        <a style={{ fontSize: 11, color: 'var(--fairway)', fontFamily: 'var(--font-mono)' }}>See all →</a>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13 }}>
            <div style={{ width: 6, height: 6, borderRadius: 6, marginTop: 7,
              background: it.tone === 'ok' ? 'var(--ok)' : it.tone === 'warn' ? 'var(--warn)' : it.tone === 'overdue' ? 'var(--overdue)' : 'var(--ink-faint)',
              flexShrink: 0,
            }} />
            <div style={{ flex: 1 }}>
              <div><strong style={{ fontWeight: 600 }}>{it.who}</strong> {it.what} <span style={{ color: 'var(--ink-soft)' }}>{it.swp}</span></div>
              <div style={{ fontSize: 11, color: 'var(--ink-faint)', fontFamily: 'var(--font-mono)' }}>{it.when}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UpcomingExpiries({ rows }) {
  const upcoming = rows
    .filter(r => r.status === 'expiring' || r.status === 'overdue')
    .sort((a, b) => (a.daysToExpiry ?? 999) - (b.daysToExpiry ?? 999))
    .slice(0, 6);

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <div className="caps">Upcoming renewals</div>
        <a style={{ fontSize: 11, color: 'var(--fairway)', fontFamily: 'var(--font-mono)' }}>Schedule toolbox →</a>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {upcoming.map((r, i) => {
          const swp = SWP_LIBRARY.find(s => s.id === r.swpId);
          const person = STAFF.find(p => p.id === r.staffId);
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 70px', gap: 10, alignItems: 'center', padding: '6px 8px', background: r.status === 'overdue' ? 'var(--overdue-bg)' : 'var(--paper-2)', borderRadius: 6 }}>
              <Avatar initials={person.avatar} size={22} />
              <div style={{ fontSize: 13, minWidth: 0 }}>
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <strong style={{ fontWeight: 500 }}>{person.name}</strong> · {swp.code}
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-soft)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {swp.title}
                </div>
              </div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', textAlign: 'right', color: r.status === 'overdue' ? 'var(--overdue)' : 'var(--warn)', fontWeight: 600 }}>
                {formatDaysToExpiry(r.daysToExpiry)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

window.SupervisorDashboard = SupervisorDashboard;
