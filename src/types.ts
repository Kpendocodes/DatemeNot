export type CartoonName =
  | 'Barbie'
  | 'Ben 10'
  | 'Family Guy'
  | 'The Simpsons'
  | 'South Park'
  | 'Avatar: The Last Airbender'
  | 'SpongeBob'
  | 'Rick and Morty'

export type VibeName =
  | 'main character'
  | 'hero energy'
  | 'chaotic'
  | 'npc energy'
  | 'unhinged'
  | 'spiritual'
  | 'delusional optimism'
  | 'existential crisis'

export type InputUser = {
  name: string
  dest: string
  cartoon: CartoonName
  vibe?: VibeName | 'auto'
}

export type UserProfile = {
  name: string
  dest: string
  cartoon: CartoonName
  vibe: VibeName
}

export type VibeBreakdown = {
  vibe: VibeName
  percentage: number
}

export type GroupAnalysis = {
  dominantVibe: VibeName
  breakdown: VibeBreakdown[]
}

export type GPSStep = {
  instruction: string
  distance: string
  redacted: boolean
}

export type CursedDestination = {
  name: string
  category: string
  conflictReason: string
}

export type BetrayalResult = {
  culprit: string
  level: number
  blameLine: string
}

export type Scenario = {
  users: UserProfile[]
  analysis: GroupAnalysis
  destination: CursedDestination
  totalDistance: string
  steps: GPSStep[]
  betrayal: BetrayalResult
  fakeLoadingMessages: string[]
}

/* Legacy model types retained so older components still type-check if referenced. */
export type SwipeProfile = {
  id: string
  name: string
  age: number
  job: string
  bio: string
  hobby: string
  appealType: 'appealing' | 'reject-bait'
}

export type RestaurantResult = {
  name: string
  category: string
  pitch: string
  whyItsWrong: string
  totalDistance: string
  steps: GPSStep[]
}

export type MenuItem = {
  name: string
  description: string
  price: string
}

export type MenuSection = {
  name: string
  items: MenuItem[]
}

export type ActualDish = MenuItem & {
  narration: string
}

export type MealResult = {
  sections: MenuSection[]
  actualDish: ActualDish
}

export type WrappedTemplate = {
  roast: string
  closingLine: string
}
