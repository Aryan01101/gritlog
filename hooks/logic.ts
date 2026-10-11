import type { Stats } from '../types'

export const EMPTY: Stats = { total: 0, commits: 0, tests: 0, streak: 0, best: 0, lastDay: null, todayDay: null, today: 0 }

const COMMIT = /\bgit\s+commit\b(?!.*--dry-run)/
const TEST = /\b((npm|pnpm|yarn|bun)\s+(run\s+)?test|pytest|vitest|jest|go\s+test|cargo\s+test)\b/

export const repKind = (command: string): 'commits' | 'tests' | null =>
  COMMIT.test(command) ? 'commits' : TEST.test(command) ? 'tests' : null

const fmt = (timeZone?: string) =>
  new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' })

/** Calendar day (YYYY-MM-DD) in `timeZone`, or the computer's own zone when it is empty or invalid. */
export const dayOf = (ms: number, timeZone?: string) => {
  try {
    return fmt(timeZone || undefined).format(ms)
  } catch {
    return fmt().format(ms)
  }
}

const prevDay = (day: string) => new Date(Date.parse(day) - 86_400_000).toISOString().slice(0, 10)

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
