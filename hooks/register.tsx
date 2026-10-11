import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Stats } from '../types'
import { EMPTY, addRep, dayOf, liveStreak, repKind } from './logic'

const PANE = 'gritlog'
const stats = atom({ plugin: 'gritlog', key: 'stats' } as const, EMPTY)

async function today($: EngineInterface) {
  return dayOf(await $.clock.now())
}

async function showStatus($: EngineInterface, s: Stats) {
  const day = await today($)
  const reps = s.todayDay === day ? s.today : 0
  $.ui.status(`💪 ${reps} today · 🔥 ${liveStreak(s, day)}d (best ${s.best})`)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const saved = ((await $.store.get('stats')) as Stats | undefined) ?? EMPTY
    await update($, stats, () => saved)
    await $.command.register({ name: 'gritlog', description: 'Show your reps, streak and records' })
    await showStatus($, saved)
    return next(e)
  })

  on('command.run', { command: 'gritlog' }, async $ => {
    await $.ui.open({ id: PANE, title: 'Gritlog' })
    return { text: 'Gritlog opened.' }
  })

  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    const ran = await next(e)
    const kind = repKind(e.command)
    if (!kind || ran.deny !== undefined || ran.isError) return ran

    const before = await read($, stats)
    const after = addRep(before, kind, await today($))
    await update($, stats, () => after)
    await $.store.set('stats', after)
    await showStatus($, after)

    if (after.best > before.best && after.best > 1) $.ui.toast(`🏆 New best streak: ${after.best} days`)
    else if (after.total % 25 === 0) $.ui.toast(`💪 ${after.total} lifetime reps`)
    return ran
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text } = $.ui.resolve(e)
    const s = await read($, stats)
    const day = await today($)
    const streak = liveStreak(s, day)
    const gap = s.best - streak

    return (
      <Box flexDirection="column">
        <Text bold>Today: {s.todayDay === day ? s.today : 0} reps</Text>
        <Text>🔥 Streak: {streak}d   🏆 Best: {s.best}d</Text>
        <Text dimColor>{streak === 0 ? 'Streak at zero. Get a rep in.' : gap > 0 ? `${gap} days off your best.` : 'You are at your best. Keep going.'}</Text>
        <Text> </Text>
        <Text>Lifetime: {s.total} reps  ({s.commits} commits · {s.tests} green test runs)</Text>
      </Box>
    )
  })
}
