/* global React */
// SWP data — full content for chainsaw (hero example) + short stubs for others

const SWP_CONTENT = {
  'CHAIN': {
    purpose: 'Safe operation of the Stihl MS 261 chainsaw for cross-cutting, limbing and felling of small-to-medium diameter timber on Ranfurlie grounds.',
    ppe: ['Chainsaw chaps', 'Safety helmet w/ visor + muffs', 'Cut-resistant gloves', 'Steel-cap boots', 'Hi-vis'],
    preStart: [
      'Visual inspection — no cracks in bar, chain tension 1-2mm lift at mid-bar, chain catcher intact',
      'Chain brake engages freely and locks the chain solid',
      'Throttle trigger springs back to idle, no sticky linkage',
      'Fuel mix 50:1 fresh (< 4 weeks), chain oil reservoir topped up',
      'Anti-vibration mounts intact, muffler and spark arrestor clean',
      'Surrounding area clear of bystanders within 2 tree-lengths',
    ],
    hazards: [
      { hazard: 'Kickback — chain pinches or bar tip strikes unseen object',
        control: 'Keep upper quadrant of bar tip out of the cut; both hands on saw at all times; left thumb wrapped; chain brake engaged whenever moving.',
        severity: 'H' },
      { hazard: 'Struck-by falling limb / hung-up tree',
        control: 'Identify escape route at 45° from fall direction before cutting; never cut directly overhead; call "stand clear" before felling; abort if tree hangs up — tag and call supervisor.',
        severity: 'H' },
      { hazard: 'Cuts from saw contact with body',
        control: 'Chaps worn for every cut, zero exceptions; never carry saw running; engage chain brake between cuts; no bystanders within 2m.',
        severity: 'H' },
      { hazard: 'Hearing damage from prolonged exposure',
        control: 'Class 5 earmuffs fitted before start-up; limit continuous sawing to 30 min blocks; rotate with another team member on long jobs.',
        severity: 'M' },
      { hazard: 'Fuel fire / burn during refuelling',
        control: 'Refuel on bare ground 3m from cutting area; engine off and cool; no smoking; mop spills before restart; use the bunded jerry only.',
        severity: 'M' },
      { hazard: 'Fatigue / vibration-induced injury (HAVS)',
        control: 'Log total saw time in daily log; max 2hrs continuous operation; warm up hands in cold weather; report any numbness to supervisor.',
        severity: 'M' },
    ],
    procedure: [
      'Brief the job with a second person present — agree fell direction, escape route, and no-go zone.',
      'Clear the work area of debris, low branches, and trip hazards. Flag the 2m exclusion zone with bunting.',
      'Start the saw on the ground with chain brake engaged and left foot through the rear handle. Never drop-start.',
      'Make the face cut on the fell side: 45° top cut, horizontal bottom cut meeting at a clean apex, depth ~1/4 of trunk diameter.',
      'Back cut from the opposite side, 3-5cm above the apex of the face cut, leaving a hinge ~10% of diameter.',
      'Drive wedges as needed. Retreat along your pre-planned escape route as the tree commits.',
      'After felling, engage chain brake and assess. Limb from the far side of the trunk, working butt to tip.',
      'Refuel and sharpen at the end of each tank. Log saw hours in the maintenance register.',
    ],
    emergency: 'Major cut: apply direct pressure, call 000, activate first-aid at Maintenance Shed (kit #2), notify Andrew (+61 412 908 XXX). For bushfire ignition: drop saw, retreat upwind, activate "RED CODE" in Slack #ops channel.',
    quiz: [
      { q: 'What is the maximum depth of the face cut as a fraction of trunk diameter?',
        options: ['1/8', '1/4', '1/3', '1/2'], answer: 1 },
      { q: 'When must the chain brake be engaged?',
        options: ['Only when the tree is falling', 'When walking or carrying the saw between cuts', 'Only when refuelling', 'When sharpening the chain'], answer: 1 },
      { q: 'If a tree hangs up in an adjacent tree, you should…',
        options: ['Cut the supporting tree to free it', 'Push it down with the ute', 'Tag the area and call the supervisor', 'Wait for wind to bring it down'], answer: 2 },
    ],
  },
  // Minimal stub for others — enough to feel real in Library
  default: {
    purpose: 'Safe operation of this equipment on Ranfurlie grounds.',
    ppe: ['Hi-vis', 'Steel-cap boots', 'Eye protection', 'Gloves'],
    preStart: ['Visual inspection', 'Fluid levels', 'Controls check', 'PPE confirmed'],
    hazards: [
      { hazard: 'Operator injury', control: 'Follow procedure; PPE compulsory.', severity: 'H' },
      { hazard: 'Bystander strike', control: 'Maintain 5m exclusion zone.', severity: 'M' },
      { hazard: 'Slips, trips, falls', control: 'Clear work area; good housekeeping.', severity: 'L' },
    ],
    procedure: ['Pre-start checks', 'Begin operation', 'Post-use clean-down', 'Log in maintenance register'],
    emergency: 'Call 000, activate first-aid at Maintenance Shed, notify supervisor.',
    quiz: [
      { q: 'Before starting, you must…', options: ['Text a mate', 'Complete pre-start checks', 'Pour fuel', 'Skip PPE'], answer: 1 },
      { q: 'Exclusion zone is…', options: ['Optional', '1m', '5m', 'Only in rain'], answer: 2 },
      { q: 'First call in emergency is…', options: ['Your mum', '000', 'Supervisor', 'HR'], answer: 1 },
    ],
  },
};

function getSwpContent(swp) {
  return { ...swp, ...(SWP_CONTENT[swp.id] || SWP_CONTENT.default) };
}

window.SWP_CONTENT = SWP_CONTENT;
window.getSwpContent = getSwpContent;
