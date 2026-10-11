import { test, expect } from 'claude-code/testing'
import { EMPTY, addRep, liveStreak, repKind } from './logic'

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
