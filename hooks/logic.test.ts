import { test, expect } from 'claude-code/testing'
import { EMPTY, addRep, dayOf, liveStreak, repKind } from './logic'

test('detects reps', () => {
  expect(repKind('git commit -m "x"')).toBe('commits')
  expect(repKind('npm run test')).toBe('tests')
  expect(repKind('pytest -q')).toBe('tests')
  expect(repKind('git status')).toBe(null)
})

test('streak grows, breaks honestly, best is kept', () => {
  let s = addRep(EMPTY, 'commits', '2026-10-01')
  s = addRep(s, 'tests', '2026-10-01')
  s = addRep(s, 'tests', '2026-10-02')
  expect(s.streak).toBe(2)
  expect(s.today).toBe(1)
  expect(liveStreak(s, '2026-10-04')).toBe(0)
  s = addRep(s, 'commits', '2026-10-05')
  expect(s.streak).toBe(1)
  expect(s.best).toBe(2)
  expect(s.total).toBe(4)
})

test('days follow the chosen timezone', () => {
  const lateEvening = Date.UTC(2026, 9, 11, 20, 0) // 01:30 on the 12th in India
  expect(dayOf(lateEvening, 'UTC')).toBe('2026-10-11')
  expect(dayOf(lateEvening, 'Asia/Kolkata')).toBe('2026-10-12')
  expect(dayOf(lateEvening, 'Not/AZone')).toMatch(/^\d{4}-\d{2}-\d{2}$/)
})

test('previous day crosses month boundaries', () => {
  const s = addRep(EMPTY, 'commits', '2026-09-30')
  expect(liveStreak(s, '2026-10-01')).toBe(1)
  expect(liveStreak(s, '2026-10-02')).toBe(0)
})
