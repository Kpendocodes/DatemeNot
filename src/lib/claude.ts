import type {
  CartoonName,
  CursedDestination,
  GPSStep,
  InputUser,
  Scenario,
  UserProfile,
  VibeBreakdown,
  VibeName,
} from '../types'

export const cartoonVibes: Record<CartoonName, VibeName> = {
  Barbie: 'main character',
  'Ben 10': 'hero energy',
  'Family Guy': 'chaotic',
  'The Simpsons': 'npc energy',
  'South Park': 'unhinged',
  'Avatar: The Last Airbender': 'spiritual',
  SpongeBob: 'delusional optimism',
  'Rick and Morty': 'existential crisis',
}

const vibeConflictMap: Record<VibeName, CursedDestination[]> = {
  'main character': [
    {
      name: 'North River Industrial Safety Museum',
      category: 'Low-energy compliance exhibit',
      conflictReason: 'You gave main-character energy, so we picked a location with aggressively no plot.',
    },
    {
      name: 'South Bay Concrete Supplier Showroom',
      category: 'Warehouse-adjacent field trip',
      conflictReason: 'Cinematic expectations were detected and immediately neutralized.',
    },
  ],
  'hero energy': [
    {
      name: 'Quiet Oaks Crossword Club Basement',
      category: 'Silent puzzle meetup',
      conflictReason: 'Hero energy requested action, so we sent you somewhere that applauds whispering.',
    },
    {
      name: 'Historic Tax Records Archive',
      category: 'Municipal paperwork sanctuary',
      conflictReason: 'You wanted adventure. We heard "binders".',
    },
  ],
  chaotic: [
    {
      name: 'West End Absolute Silence Library',
      category: 'No-fun reading zone',
      conflictReason: 'Chaos was trending, so we prescribed stillness and fluorescent lighting.',
    },
    {
      name: 'Monkstone Meditation Hall',
      category: 'Mindfulness retreat room',
      conflictReason: 'You brought chaos; we brought mandatory deep breathing.',
    },
  ],
  'npc energy': [
    {
      name: 'Inflatable Kayak Liquidation Tent',
      category: 'Pop-up parking lot chaos',
      conflictReason: 'NPC energy got rerouted to somewhere with side-quest levels of randomness.',
    },
    {
      name: '24-Hour Ceramic Rooster Outlet',
      category: 'Questionable roadside retail',
      conflictReason: 'To interrupt autopilot, we selected maximum nonsense.',
    },
  ],
  unhinged: [
    {
      name: 'Wholesome Candle Labeling Workshop',
      category: 'Gentle crafting room',
      conflictReason: 'Unhinged was detected, so we countered with scented calm and tiny stickers.',
    },
    {
      name: 'Municipal Knitting Circle Annex',
      category: 'Extremely polite hobby room',
      conflictReason: 'Your energy was loud. The destination is aggressively soft.',
    },
  ],
  spiritual: [
    {
      name: 'TurboChomp Drive-Thru Arena',
      category: 'Loud fast-food chaos dome',
      conflictReason: 'Spiritual vibes were met with deep-fried bass drops and neon menu panic.',
    },
    {
      name: 'Mega Nugget Food Court Stage',
      category: 'High-volume combo meal district',
      conflictReason: 'Inner peace met outer speakers.',
    },
  ],
  'delusional optimism': [
    {
      name: 'Department of Parking Appeals Lobby',
      category: 'Administrative waiting room',
      conflictReason: 'Optimism was strong, so we balanced it with ticket-number despair.',
    },
    {
      name: 'Rainy Bus Transfer Tunnel',
      category: 'Transit morale challenge',
      conflictReason: 'Sunshine energy encountered damp concrete realism.',
    },
  ],
  'existential crisis': [
    {
      name: 'Happy Clown Karaoke Brunch',
      category: 'Forced joy amphitheater',
      conflictReason: 'Existential crisis got counterprogrammed with synthetic happiness and confetti.',
    },
    {
      name: 'Cheerful Aerobics Pavilion',
      category: 'Upbeat cardio dome',
      conflictReason: 'Philosophical dread was assigned a soundtrack with too much tambourine.',
    },
  ],
}

const directionTemplates = [
  'Turn left... do not fumble this.',
  'Keep going. No, seriously, keep going.',
  'Recalculating... because you hesitated.',
  'This is where it gets questionable.',
  'Continue for 32 minutes. Trust.',
  'Straight ahead. NPC energy is not helping.',
  'Slide right at the light, no cap.',
  'Stay on this road like your group chat depends on it.',
] as const

const fakeLoadingMessages = [
  'Calculating maximum regret...',
  'Cross-referencing bad decisions...',
  'Locking in disappointment...',
  'Reading group aura (against its will)...',
  'Aligning sabotage trajectory...',
]

const distanceSegments = ['0.4 mi', '0.9 mi', '1.1 mi', '2.0 mi', '0.7 mi', '1.6 mi'] as const

function hashString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) % 2147483647
  }
  return hash
}

function normalizedUsers(users: InputUser[]): UserProfile[] {
  return users.map((user) => {
    const cartoon = user.cartoon
    const mappedVibe = cartoonVibes[cartoon]
    const vibe = user.vibe && user.vibe !== 'auto' ? user.vibe : mappedVibe
    return {
      name: user.name.trim(),
      dest: user.dest.trim(),
      cartoon,
      vibe,
    }
  })
}

function dominantVibe(users: UserProfile[]): VibeName {
  const counts = new Map<VibeName, number>()
  users.forEach((u) => {
    counts.set(u.vibe, (counts.get(u.vibe) ?? 0) + 1)
  })

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] ?? 'chaotic'
}

function buildBreakdown(users: UserProfile[]): VibeBreakdown[] {
  const counts = new Map<VibeName, number>()
  users.forEach((u) => counts.set(u.vibe, (counts.get(u.vibe) ?? 0) + 1))

  const allVibes = Object.values(cartoonVibes)
  const seed = hashString(users.map((u) => `${u.name}${u.vibe}`).join('|'))

  const base = allVibes.map((vibe, idx) => {
    const count = counts.get(vibe) ?? 0
    const jitter = ((seed + idx * 17) % 9) - 4
    return {
      vibe,
      score: Math.max(0, count * 24 + jitter + (count > 0 ? 8 : 0)),
    }
  })

  const top = base
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)

  const total = top.reduce((sum, item) => sum + item.score, 0) || 1
  let running = 0
  const result = top.map((item, idx) => {
    if (idx === top.length - 1) {
      return { vibe: item.vibe, percentage: 100 - running }
    }
    const pct = Math.max(1, Math.round((item.score / total) * 100))
    running += pct
    return { vibe: item.vibe, percentage: pct }
  })

  return result.sort((a, b) => b.percentage - a.percentage)
}

function pickDestination(vibe: VibeName, seed: number): CursedDestination {
  const options = vibeConflictMap[vibe]
  return options[seed % options.length]
}

function buildSteps(seed: number): GPSStep[] {
  const steps: GPSStep[] = []
  for (let i = 0; i < 5; i += 1) {
    const line = directionTemplates[(seed + i * 3) % directionTemplates.length]
    steps.push({
      instruction: i === 4 ? 'You have arrived at ██████████' : line,
      distance: i === 4 ? '' : distanceSegments[(seed + i) % distanceSegments.length],
      redacted: i === 4,
    })
  }
  return steps
}

function totalDistance(steps: GPSStep[]): string {
  const numeric = steps
    .map((step) => Number.parseFloat(step.distance))
    .filter((n) => !Number.isNaN(n))
    .reduce((sum, n) => sum + n, 0)

  return `${numeric.toFixed(1)} mi`
}

function buildBetrayal(users: UserProfile[], seed: number) {
  const culprit = users[seed % users.length]?.name ?? 'Someone'
  const level = 78 + (seed % 20)
  return {
    culprit,
    level,
    blameLine: `${culprit} said "trust me" btw.`,
  }
}

export async function generateScenario(inputUsers: InputUser[]): Promise<Scenario> {
  const users = normalizedUsers(inputUsers)
  const signature = users.map((u) => `${u.name}:${u.dest}:${u.cartoon}:${u.vibe}`).join('|')
  const seed = hashString(signature)

  const vibe = dominantVibe(users)
  const destination = pickDestination(vibe, seed)
  const steps = buildSteps(seed)

  return {
    users,
    analysis: {
      dominantVibe: vibe,
      breakdown: buildBreakdown(users),
    },
    destination,
    totalDistance: totalDistance(steps),
    steps,
    betrayal: buildBetrayal(users, seed),
    fakeLoadingMessages,
  }
}

export const cartoonOptions = Object.keys(cartoonVibes) as CartoonName[]
export const vibeOptions = [...new Set(Object.values(cartoonVibes))] as VibeName[]
