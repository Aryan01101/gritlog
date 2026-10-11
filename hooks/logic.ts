import type { Stats } from '../types'

export const EMPTY: Stats = { total: 0, commits: 0, tests: 0, streak: 0, best: 0, lastDay: null, todayDay: null, today: 0 }

const COMMIT = /\bgit\s+commit\b(?!.*--dry-run)/
const TEST = /\b((npm|pnpm|yarn|bun)\s+(run\s+)?test|pytest|vitest|jest|go\s+test|cargo\s+test)\b/

export const repKind = (command: string): 'commits' | 'tests' | null =>
  COMMIT.test(command) ? 'commits' : TEST.test(command) ? 'tests' : null

// ponytail: local-calendar day of the sandbox clock; add a timezone option if days land wrong
export const dayOf = (ms: number) => new Date(ms).toISOString().slice(0, 10)
const prevDay = (day: string) => dayOf(Date.parse(day) - 86_400_000)

/** Streak as it honestly stands today: broken if you skipped yesterday. */
export const liveStreak = (s: Stats, today: string) =>
  s.lastDay === today || (s.lastDay !== null && s.lastDay === prevDay(today)) ? s.streak : 0

export const addRep = (s: Stats, kind: 'commits' | 'tests', today: string): Stats => {
  const streak = s.lastDay === today ? s.streak : liveStreak(s, today) + 1
  return {
    ...s,
    total: s.total + 1,
    [kind]: s[kind] + 1,
    streak,
    best: Math.max(s.best, streak),
    lastDay: today,
    todayDay: today,
    today: s.todayDay === today ? s.today + 1 : 1,
  }
}
