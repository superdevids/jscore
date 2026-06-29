import { execSync } from 'node:child_process'
import { colors } from '../../native/colors.js'

export async function build(): Promise<void> {
  console.log(`  ${colors.cyan('→')} Building...`)
  try {
    execSync('tsc', { stdio: 'inherit', cwd: process.cwd() })
    console.log(`  ${colors.green('✓')} Build complete`)
  } catch {
    console.error(`  ${colors.red('✗')} Build failed`)
    process.exit(1)
  }
}
