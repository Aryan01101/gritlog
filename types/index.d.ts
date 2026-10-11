export type Stats = {
  total: number
  commits: number
  tests: number
  streak: number
  best: number
  lastDay: string | null
  todayDay: string | null
  today: number
}

declare module 'claude-code' {
  interface PluginState {
    gritlog: { stats: Stats }
  }
}
