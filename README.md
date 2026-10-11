# Gritlog

Log your reps. A Claude Code mod that counts real output, not prompts or tokens, and keeps an honest streak.

```
💪 3 today · 🔥 4d (best 19)
```

## What counts as a rep

A rep is a Bash command run in Claude Code that **succeeds** and is one of:

| Rep | Commands |
|---|---|
| Commit | `git commit` (not `--dry-run`) |
| Green test run | `npm test`, `pnpm test`, `yarn test`, `bun test` (or `run test`), `pytest`, `vitest`, `jest`, `go test`, `cargo test` |

Failed commands don't count.

## Streaks

- **Current streak** counts consecutive days with at least one rep. Miss a day and it shows `0`.
- **Best streak** is your record. It never goes down.
- **Lifetime totals** never go down.

## Usage

- The status line shows today's reps, your current streak and your best.
- `/gritlog` opens a pane with today, streak, best and lifetime totals.
- A toast appears only on a new best streak and every 25 lifetime reps.

## Install

```
/plugin marketplace add Aryan01101/gritlog
/plugin install gritlog@gritlog
```

Or load it from a clone for one session:

```
claude --plugin-dir /path/to/gritlog
```

### Requirements

Claude Code **2.1.289 or newer**. Gritlog uses Claude Code's function-hooks mod API, which is in early access and may change between releases.

## Privacy

Everything stays on your machine. Stats are kept in the mod's local store under your Claude Code config directory. Nothing is sent anywhere.

## Known limitations

- Days are counted in UTC, so a rep late in your evening may land on the next day.

## Development

```
claude plugin validate .
claude plugin test .
```

## License

[MIT](LICENSE)
