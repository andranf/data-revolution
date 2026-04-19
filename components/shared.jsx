/* global React, ReactDOM */
// Ranfurlie SWP — shared components & data

// ─── DATA ────────────────────────────────────────────────────────────────
const SWP_LIBRARY = [
  { id: 'KOB-EX',  code: 'SWP-001', title: 'Kobelco SK55 Excavator',      risk: 'high', renewMonths: 6,  category: 'Heavy equipment',  version: '2.1', updated: '2026-02-14' },
  { id: 'CHAIN',   code: 'SWP-002', title: 'Chainsaw — Stihl MS 261',     risk: 'high', renewMonths: 6,  category: 'Powered tools',    version: '3.0', updated: '2026-03-02' },
  { id: 'VERTI',   code: 'SWP-003', title: 'Redexim Verti-Drain 7316',    risk: 'high', renewMonths: 6,  category: 'Turf machinery',   version: '1.4', updated: '2026-01-20' },
  { id: 'SPRAY',   code: 'SWP-004', title: 'Boom Spray — Toro Multi Pro', risk: 'high', renewMonths: 6,  category: 'Chemical',         version: '2.2', updated: '2026-02-28' },
  { id: 'FAIRW',   code: 'SWP-005', title: 'Fairway Mower — Toro 5510',   risk: 'med',  renewMonths: 12, category: 'Turf machinery',   version: '1.1', updated: '2025-11-09' },
  { id: 'GREEN',   code: 'SWP-006', title: 'Greens Mower — Toro 3250-D',  risk: 'med',  renewMonths: 12, category: 'Turf machinery',   version: '1.3', updated: '2025-12-15' },
  { id: 'BUNKER',  code: 'SWP-007', title: 'Bunker Rake — Toro Sand Pro', risk: 'med',  renewMonths: 12, category: 'Turf machinery',   version: '1.0', updated: '2025-10-04' },
  { id: 'BLOWER',  code: 'SWP-008', title: 'Backpack Blower — Stihl BR',  risk: 'med',  renewMonths: 12, category: 'Powered tools',    version: '1.2', updated: '2026-01-11' },
  { id: 'TRIM',    code: 'SWP-009', title: 'Line Trimmer — Stihl FS',     risk: 'med',  renewMonths: 12, category: 'Powered tools',    version: '1.1', updated: '2025-09-22' },
  { id: 'HEDGE',   code: 'SWP-010', title: 'Hedge Trimmer',               risk: 'med',  renewMonths: 12, category: 'Powered tools',    version: '1.0', updated: '2025-08-18' },
  { id: 'UTE',     code: 'SWP-011', title: 'Utility Vehicle — Workman',   risk: 'low',  renewMonths: 24, category: 'Vehicles',         version: '1.0', updated: '2025-06-02' },
  { id: 'LAD',     code: 'SWP-012', title: 'Portable Ladders & Steps',    risk: 'low',  renewMonths: 24, category: 'General',          version: '1.1', updated: '2025-07-14' },
  { id: 'MAN',     code: 'SWP-013', title: 'Manual Handling — Turf',      risk: 'low',  renewMonths: 24, category: 'General',          version: '1.0', updated: '2025-05-30' },
  { id: 'HAND',    code: 'SWP-014', title: 'Hand Tools (Rakes, Forks)',   risk: 'low',  renewMonths: 24, category: 'General',          version: '1.0', updated: '2025-04-19' },
];

const STAFF = [
  { id: 'aa', name: 'Andrew',              role: 'Superintendent',           slack: '@andrew',             avatar: 'A',  type: 'full-time' },
  { id: 'bh', name: 'Ben Hartley',         role: 'Assistant Superintendent', slack: '@benjamin.hartley411',avatar: 'BH', type: 'full-time' },
  { id: 'nh', name: 'Neil Harper',         role: 'Foreman',                  slack: '@neilharper21',       avatar: 'NH', type: 'full-time' },
  { id: 'mm', name: 'Mitch Mahoney',       role: 'Greenkeeper',              slack: '@mitchmahoney5',      avatar: 'MM', type: 'full-time' },
  { id: 'jh', name: 'Jacqueline Hayes',    role: 'Casual Greenkeeper',       slack: '@jax',                avatar: 'JH', type: 'casual' },
  { id: 'tg', name: 'Tremayne Gallagher',  role: 'Greenkeeper',              slack: '@tregallagher',       avatar: 'TG', type: 'full-time' },
  { id: 'nd', name: 'Nathan Drew',         role: 'Apprentice',               slack: '@nathandrew619',      avatar: 'ND', type: 'full-time' },
  { id: 'kc', name: 'Kyle Craig',          role: 'Apprentice',               slack: '@kylecraig5441',      avatar: 'KC', type: 'full-time' },
  { id: 'nf', name: 'Nathan Ferguson',     role: 'Apprentice',               slack: '@nathanferguson2999', avatar: 'NF', type: 'full-time' },
  { id: 'bm', name: 'Brodie Macdonald',    role: 'Apprentice',               slack: '@bigmac2211',         avatar: 'BM', type: 'full-time' },
  { id: 'jk', name: 'James King',          role: 'Apprentice',               slack: '@jamesking03',        avatar: 'JK', type: 'full-time' },
  { id: 'es', name: 'Eli Sherrin',         role: 'Casual Greenkeeper',       slack: '@elisherrin15',       avatar: 'ES', type: 'casual' },
  { id: 'mk', name: 'Michael K',           role: 'Casual Greenkeeper',       slack: '@michael',            avatar: 'MK', type: 'casual' },
  { id: 'nb', name: 'Nicholas Debrincat',  role: 'Casual Greenkeeper',       slack: '@n.debrincat',        avatar: 'ND', type: 'casual' },
  { id: 'fs', name: 'Flynn Sinclair',      role: 'Casual Greenkeeper',       slack: '@flynnsinclair05',    avatar: 'FS', type: 'casual' },
  { id: 'jc', name: 'Joshua Cope',         role: 'Greenkeeper',              slack: '@joshuarlc-2001',     avatar: 'JC', type: 'full-time' },
  { id: 'sc', name: 'Samuel Cope',         role: 'Casual Greenkeeper',       slack: '@copesam000',         avatar: 'SC', type: 'casual' },
];

// Build a plausible compliance matrix (staff × SWP)
function buildCompliance() {
  const today = new Date('2026-04-19');
  const rows = [];
  STAFF.forEach((p) => {
    SWP_LIBRARY.forEach((swp) => {
      // Contractors only need relevant SWPs
      if (p.type === 'contractor' && !['CHAIN','KOB-EX','MAN','HAND','LAD'].includes(swp.id)) return;
      // Casuals skip excavator unless specifically trained
      if (p.type === 'casual' && swp.id === 'KOB-EX') return;

      // Seed randomness off names for stable layout
      const seed = (p.id.charCodeAt(0) + swp.id.charCodeAt(0) + swp.id.length) % 100;
      let status = 'current';
      let daysToExpiry = 120 + (seed % 200);
      let signedDaysAgo = (swp.renewMonths * 30) - daysToExpiry;

      if (seed < 8) { status = 'overdue'; daysToExpiry = -(seed + 2); }
      else if (seed < 22) { status = 'expiring'; daysToExpiry = (seed % 20) + 1; }
      else if (seed < 30) { status = 'pending'; daysToExpiry = null; signedDaysAgo = null; }

      rows.push({
        staffId: p.id,
        swpId: swp.id,
        status,
        daysToExpiry,
        signedDaysAgo,
        version: swp.version,
      });
    });
  });
  return rows;
}

const COMPLIANCE = buildCompliance();

// ─── UTILITIES ───────────────────────────────────────────────────────────
const riskLabel = { high: 'High risk', med: 'Medium risk', low: 'Low risk' };
const statusLabel = {
  current: 'Current',
  expiring: 'Expiring',
  overdue: 'Overdue',
  pending: 'Not signed',
};

function formatDaysToExpiry(d) {
  if (d == null) return '—';
  if (d < 0) return `${Math.abs(d)}d overdue`;
  if (d === 0) return 'Today';
  if (d < 30) return `${d}d`;
  const m = Math.round(d / 30);
  return `${m}mo`;
}

// ─── ICONS (hand-picked, minimal, stroke only) ──────────────────────────
const Icon = ({ name, size = 16 }) => {
  const paths = {
    check: <path d="M3 8l3 3 7-8" />,
    close: <><path d="M4 4l8 8" /><path d="M12 4l-8 8" /></>,
    arrow: <><path d="M3 8h10" /><path d="M9 4l4 4-4 4" /></>,
    back: <><path d="M13 8H3" /><path d="M7 4l-4 4 4 4" /></>,
    chevron: <path d="M5 3l4 5-4 5" />,
    chevronDown: <path d="M3 5l5 4 5-4" />,
    search: <><circle cx="7" cy="7" r="4" /><path d="M10 10l3 3" /></>,
    filter: <><path d="M2 4h12" /><path d="M4 8h8" /><path d="M6 12h4" /></>,
    alert: <><path d="M8 2l7 12H1z" /><path d="M8 6v4" /><circle cx="8" cy="12" r="0.5" fill="currentColor" /></>,
    clock: <><circle cx="8" cy="8" r="6" /><path d="M8 4v4l3 2" /></>,
    shield: <path d="M8 1l6 2v5c0 4-3 6-6 7-3-1-6-3-6-7V3z" />,
    slack: <><rect x="2" y="7" width="4" height="2" rx="1" /><rect x="10" y="7" width="4" height="2" rx="1" /><rect x="7" y="2" width="2" height="4" rx="1" /><rect x="7" y="10" width="2" height="4" rx="1" /></>,
    bell: <><path d="M4 11V7a4 4 0 018 0v4l1 2H3z" /><path d="M7 14a1 1 0 002 0" /></>,
    doc: <><path d="M3 1h7l3 3v11H3z" /><path d="M10 1v3h3" /></>,
    sign: <><path d="M1 13h14" /><path d="M3 11l4-8 2 5 3-3 3 6" /></>,
    user: <><circle cx="8" cy="5" r="3" /><path d="M2 14c1-3 3-4 6-4s5 1 6 4" /></>,
    users: <><circle cx="6" cy="5" r="2.5" /><circle cx="11" cy="6" r="2" /><path d="M1 13c1-2 3-3 5-3s4 1 5 3" /><path d="M9 13c0-1 2-2 4-2s2 1 2 1" /></>,
    plus: <><path d="M8 3v10" /><path d="M3 8h10" /></>,
    download: <><path d="M8 2v8" /><path d="M4 7l4 4 4-4" /><path d="M2 13h12" /></>,
    menu: <><path d="M2 4h12" /><path d="M2 8h12" /><path d="M2 12h12" /></>,
    lock: <><rect x="3" y="7" width="10" height="7" rx="1" /><path d="M5 7V5a3 3 0 016 0v2" /></>,
    play: <path d="M4 3l9 5-9 5z" />,
    book: <><path d="M2 3h5a2 2 0 012 2v9H4a2 2 0 01-2-2z" /><path d="M14 3H9a2 2 0 00-2 2v9h5a2 2 0 002-2z" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor"
         strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name] || null}
    </svg>
  );
};

// ─── ATOMS ───────────────────────────────────────────────────────────────
const Chip = ({ tone = 'muted', children, icon }) => (
  <span className={`chip chip-${tone}`}>
    {icon && <Icon name={icon} size={10} />}
    {children}
  </span>
);

const RiskChip = ({ risk }) => (
  <Chip tone={risk === 'high' ? 'high' : risk === 'med' ? 'med' : 'low'}>
    {riskLabel[risk]}
  </Chip>
);

const StatusChip = ({ status }) => {
  const tone = status === 'current' ? 'ok' : status === 'expiring' ? 'warn' : status === 'overdue' ? 'overdue' : 'muted';
  return <Chip tone={tone}>{statusLabel[status]}</Chip>;
};

const Avatar = ({ initials, size = 32, tone = 'fairway' }) => (
  <div style={{
    width: size, height: size, borderRadius: size,
    background: tone === 'fairway' ? 'var(--fairway)' : 'var(--green)',
    color: 'var(--cream)',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--font-mono)', fontSize: size * 0.38, fontWeight: 500,
    letterSpacing: '0.02em',
    flexShrink: 0,
  }}>{initials}</div>
);

Object.assign(window, {
  SWP_LIBRARY, STAFF, COMPLIANCE,
  riskLabel, statusLabel, formatDaysToExpiry,
  Icon, Chip, RiskChip, StatusChip, Avatar,
});
