/* global React */
// Slack DM reminder — phone frame style

const { useState } = React;

function SlackReminder({ onOpenSWP, reminderDays = 7 }) {
  const [typing, setTyping] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#1a1d21', color: '#e8e8e8', fontSize: 13, fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif' }}>
      {/* Slack header */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid #2e3136', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 28, height: 28, background: '#4a154b', borderRadius: 6, display: 'grid', placeItems: 'center', color: 'white', fontWeight: 800, fontSize: 15 }}>R</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Ranfurlie Golf Club</div>
          <div style={{ fontSize: 11, color: '#9a9fa6' }}>ranfurlie.slack.com</div>
        </div>
      </div>

      {/* Channel header */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid #2e3136', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 22, height: 22, borderRadius: 4, background: 'linear-gradient(135deg, #3a5e36, #6b8e4e)', display: 'grid', placeItems: 'center', color: 'white', fontSize: 11, fontWeight: 700 }}>S</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>SWP Compliance</div>
          <div style={{ fontSize: 10, color: '#9a9fa6' }}>App · Ranfurlie</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Day divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#9a9fa6', fontSize: 11 }}>
          <div style={{ flex: 1, height: 1, background: '#2e3136' }} />
          <span style={{ padding: '2px 10px', border: '1px solid #2e3136', borderRadius: 999 }}>Monday 19 April</span>
          <div style={{ flex: 1, height: 1, background: '#2e3136' }} />
        </div>

        {/* Bot message */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ width: 36, height: 36, flexShrink: 0, borderRadius: 6, background: 'linear-gradient(135deg, #3a5e36, #6b8e4e)', display: 'grid', placeItems: 'center', color: 'white', fontWeight: 800, fontSize: 16 }}>S</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>SWP Compliance</span>
              <span style={{ fontSize: 10, padding: '1px 4px', background: '#2e3136', borderRadius: 3, color: '#9a9fa6', fontWeight: 600 }}>APP</span>
              <span style={{ fontSize: 11, color: '#9a9fa6' }}>7:04 AM</span>
            </div>

            {/* The card */}
            <div style={{
              background: '#222529',
              border: '1px solid #2e3136',
              borderLeft: '3px solid #f4a623',
              borderRadius: 4,
              padding: '10px 12px',
              marginTop: 4,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#f4a623', fontWeight: 600, marginBottom: 6 }}>
                <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l7 14H1z" /></svg>
                TRAINING EXPIRES IN {reminderDays} DAYS
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 2 }}>
                Chainsaw — Stihl MS 261
              </div>
              <div style={{ fontSize: 12, color: '#b4b7bc', marginBottom: 10 }}>
                SWP-002 · v3.0 · High-risk, 6-month renewal
              </div>
              <div style={{ fontSize: 13, color: '#d1d2d3', lineHeight: 1.45, marginBottom: 12 }}>
                Hey Nathan — your chainsaw training expires on <strong style={{ color: 'white' }}>Mon 26 April</strong>.
                Takes about 4 minutes to refresh. Skip it and we'll need to escalate to Andrew on day 3.
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button onClick={onOpenSWP} style={{
                  background: '#2d4a2b', color: 'white', border: 0, borderRadius: 4,
                  padding: '8px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'inherit',
                }}>Open SWP →</button>
                <button style={{
                  background: 'transparent', color: '#d1d2d3', border: '1px solid #4a4e54',
                  borderRadius: 4, padding: '8px 12px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  fontFamily: 'inherit',
                }}>Remind me tomorrow</button>
              </div>

              <div style={{ fontSize: 11, color: '#7c8084', marginTop: 10, fontFamily: 'ui-monospace, monospace' }}>
                Last signed 5 Oct 2025 · Kyle C. · Brodie M. are also due
              </div>
            </div>

            {/* Secondary line */}
            <div style={{ fontSize: 12, color: '#9a9fa6', marginTop: 8 }}>
              One of 3 reminders this month · <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>see all due</span>
            </div>
          </div>
        </div>
      </div>

      {/* Composer */}
      <div style={{ padding: 10, borderTop: '1px solid #2e3136' }}>
        <div style={{ background: '#222529', border: '1px solid #2e3136', borderRadius: 6, padding: '8px 10px', fontSize: 13, color: '#7c8084' }}>
          Message SWP Compliance…
        </div>
      </div>
    </div>
  );
}

window.SlackReminder = SlackReminder;
