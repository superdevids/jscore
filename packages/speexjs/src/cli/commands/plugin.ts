import { PluginRegistry } from '../../server/plugin/registry.js'
import { colors } from '../../native/colors.js'

export async function pluginInstall(name: string, options: Record<string, any>): Promise<void> {
  const source = (options.source as string) || (options.from as string) || undefined
  const registry = new PluginRegistry()

  console.log(`  ${colors.cyan('→')} Installing plugin: ${colors.white(name)}`)

  try {
    const plugin = await registry.install(name, source)
    console.log(`  ${colors.green('✓')} Plugin '${plugin.manifest.name}' v${plugin.manifest.version} installed`)
    console.log(`  ${colors.dim('  Path:')} ${plugin.path}`)
    if (plugin.manifest.hooks?.length) {
      console.log(`  ${colors.dim('  Hooks:')} ${plugin.manifest.hooks.join(', ')}`)
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`  ${colors.red('✗')} Failed to install plugin: ${message}`)
    process.exit(1)
  }
}

export async function pluginList(): Promise<void> {
  const registry = new PluginRegistry()
  const plugins = registry.list()

  if (plugins.length === 0) {
    console.log(`  ${colors.yellow('!')} No plugins found. Install one with: ${colors.cyan('speexjs plugin:install <name>')}`)
    console.log(`  ${colors.dim('  Plugins directory:')} ${registry.getPluginDir()}`)
    return
  }

  console.log(`\n  ${colors.bold('Installed Plugins')}`)
  console.log(`  ${colors.dim('─'.repeat(50))}`)

  for (const plugin of plugins) {
    const status = plugin.loaded ? colors.green('loaded') : colors.yellow('scanned')
    console.log(`  ${colors.green('●')} ${colors.white(plugin.manifest.name)} ${colors.dim(`v${plugin.manifest.version}`)} ${status}`)
    if (plugin.manifest.description) {
      console.log(`    ${colors.dim(plugin.manifest.description)}`)
    }
    if (plugin.manifest.hooks?.length) {
      console.log(`    ${colors.dim('Hooks:')} ${plugin.manifest.hooks.join(', ')}`)
    }
    if (plugin.manifest.dependencies) {
      const deps = Object.keys(plugin.manifest.dependencies)
      console.log(`    ${colors.dim('Dependencies:')} ${deps.join(', ')}`)
    }
    console.log()
  }

  console.log(`  ${colors.dim('Total:')} ${plugins.length} plugin(s)\n`)
}
