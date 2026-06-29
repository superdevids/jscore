import * as vscode from 'vscode'
import { DiagnosticProvider } from './diagnosticProvider'
import { SpeexrayTreeDataProvider } from './speexrayProvider'
import { runSpeexrayScan } from './scanner'

function getConfigSchemaCompletions(): vscode.CompletionItem[] {
  const keys: Record<string, vscode.CompletionItemKind> = {
    app: vscode.CompletionItemKind.Module,
    database: vscode.CompletionItemKind.Module,
    auth: vscode.CompletionItemKind.Module,
    server: vscode.CompletionItemKind.Module,
    paths: vscode.CompletionItemKind.Module,
    plugins: vscode.CompletionItemKind.Module,
    cache: vscode.CompletionItemKind.Module,
    queue: vscode.CompletionItemKind.Module,
    mail: vscode.CompletionItemKind.Module,
    storage: vscode.CompletionItemKind.Module,
  }

  return Object.entries(keys).map(([key, kind]) => {
    const item = new vscode.CompletionItem(key, kind)
    item.detail = 'speexjs config key'
    ;(item.insertText = `${key}: `), (item.commitCharacters = [':'])
    return item
  })
}

function getConfigPropertyCompletions(): vscode.CompletionItem[] {
  const props: Record<string, string> = {
    'app.name': 'Application name',
    'app.port': 'Server port (default: 3000)',
    'app.host': 'Server host (default: localhost)',
    'app.env': 'Environment (development/production)',
    'app.key': 'Application encryption key',
    'app.debug': 'Enable debug mode',
    'database.default': 'Default database connection name',
    'database.connections': 'Database connections configuration',
    'auth.defaults.guard': 'Default auth guard',
    'auth.guards': 'Auth guard configurations',
    'server.cors.origin': 'CORS origin(s)',
    'server.cors.credentials': 'Allow credentials',
    'server.session.driver': 'Session driver (memory/file/redis)',
    'server.session.ttl': 'Session TTL in minutes',
    'server.rateLimit.max': 'Max requests per window',
    'server.rateLimit.window': 'Rate limit window in ms',
    'paths.root': 'Root directory of the project',
    'paths.src': 'Source directory',
    'paths.routes': 'Routes directory',
    'paths.views': 'Views directory',
    'paths.migrations': 'Migrations directory',
    'paths.public': 'Public directory',
  }

  return Object.entries(props).map(([key, detail]) => {
    const item = new vscode.CompletionItem(key, vscode.CompletionItemKind.Property)
    item.detail = detail
    item.insertText = key
    return item
  })
}

async function scaffoldFile(type: string, name?: string) {
  if (!name) {
    name = await vscode.window.showInputBox({
      prompt: `Enter ${type} name`,
      placeHolder: `e.g. ${type === 'Controller' ? 'UserController' : type === 'Model' ? 'User' : 'auth'}`,
    })
    if (!name) return
  }

  const workspaceFolders = vscode.workspace.workspaceFolders
  if (!workspaceFolders) {
    vscode.window.showErrorMessage('No workspace folder open')
    return
  }

  const rootPath = workspaceFolders[0].uri.fsPath
  const targetDir = vscode.Uri.file(`${rootPath}/src/${type.toLowerCase()}s`)
  const fileName = name.endsWith(`.${type.toLowerCase()}.ts`) ? name : `${name}.${type.toLowerCase()}.ts`
  const filePath = vscode.Uri.joinPath(targetDir, fileName)

  try {
    await vscode.workspace.fs.stat(targetDir)
  } catch {
    await vscode.workspace.fs.createDirectory(targetDir)
  }

  try {
    await vscode.workspace.fs.stat(filePath)
    vscode.window.showWarningMessage(`${type} '${name}' already exists`)
    return
  } catch {
    // file doesn't exist, proceed
  }

  const templates: Record<string, string> = {
    Controller: `import { Controller, get } from 'speexjs/server'

export class ${name} extends Controller {
  @get('/${name.toLowerCase().replace(/controller$/i, '')}')
  async index({ response }) {
    return response.json({ data: [] })
  }
}
`,
    Model: `import { Model } from 'speexjs/server'

export class ${name} extends Model {
  static tableName = '${name.toLowerCase()}s'
}
`,
    Middleware: `import type { RouteContext } from 'speexjs/server/router'

export function ${name.replace(/middleware$/i, '')}() {
  return async (ctx: RouteContext, next: () => Promise<void>) => {
    await next()
  }
}
`,
    Route: `import { Router } from 'speexjs/server'

const router = new Router()

router.get('/', async ({ response }) => {
  return response.json({ message: 'Hello from ${name} routes' })
})

export { router }
`,
  }

  const content = templates[type]
  if (!content) {
    vscode.window.showErrorMessage(`Unknown scaffold type: ${type}`)
    return
  }

  await vscode.workspace.fs.writeFile(filePath, Buffer.from(content, 'utf-8'))
  const doc = await vscode.workspace.openTextDocument(filePath)
  await vscode.window.showTextDocument(doc)
  vscode.window.showInformationMessage(`${type} '${name}' created`)
}

async function showRoutesTree() {
  const workspaceFolders = vscode.workspace.workspaceFolders
  if (!workspaceFolders) {
    vscode.window.showErrorMessage('No workspace folder open')
    return
  }

  const rootPath = workspaceFolders[0].uri.fsPath

  const controllerDir = vscode.Uri.file(`${rootPath}/src/controllers`)
  const routesDir = vscode.Uri.file(`${rootPath}/src/routes`)

  const allRoutes: { method: string; path: string; source: string }[] = []

  try {
    const controllers = await vscode.workspace.fs.readDirectory(controllerDir)
    for (const [file] of controllers) {
      if (file.endsWith('.ts') || file.endsWith('.js')) {
        const content = await vscode.workspace.fs.readFile(vscode.Uri.joinPath(controllerDir, file))
        const text = Buffer.from(content).toString('utf-8')
        const routeMatches = text.matchAll(/@(get|post|put|del|patch)\s*\(\s*['"]([^'"]+)['"]\s*\)/g)
        for (const match of routeMatches) {
          allRoutes.push({ method: match[1].toUpperCase(), path: match[2], source: `controllers/${file}` })
        }
      }
    }
  } catch {
    // no controllers dir
  }

  try {
    const routes = await vscode.workspace.fs.readDirectory(routesDir)
    for (const [file] of routes) {
      if (file.endsWith('.ts') || file.endsWith('.js')) {
        const content = await vscode.workspace.fs.readFile(vscode.Uri.joinPath(routesDir, file))
        const text = Buffer.from(content).toString('utf-8')
        const routeMatches = text.matchAll(/\.(get|post|put|del|patch|delete)\(['"]([^'"]+)['"]/g)
        for (const match of routeMatches) {
          const method = match[1].toUpperCase() === 'DEL' ? 'DELETE' : match[1].toUpperCase()
          allRoutes.push({ method, path: match[2], source: `routes/${file}` })
        }
      }
    }
  } catch {
    // no routes dir
  }

  if (allRoutes.length === 0) {
    vscode.window.showInformationMessage('No routes found')
    return
  }

  const panel = vscode.window.createWebviewPanel('speexjsRoutes', 'SpeexJS Routes', vscode.ViewColumn.One, {})

  const methodColors: Record<string, string> = {
    GET: '#3b82f6',
    POST: '#22c55e',
    PUT: '#eab308',
    PATCH: '#f97316',
    DELETE: '#ef4444',
    DEL: '#ef4444',
  }

  panel.webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SpeexJS Routes</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 1rem; background: #1e1e1e; color: #d4d4d4; }
    h1 { font-size: 1.25rem; margin-bottom: 1rem; color: #569cd6; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 0.5rem; border-bottom: 2px solid #333; color: #888; font-size: 0.75rem; text-transform: uppercase; }
    td { padding: 0.5rem; border-bottom: 1px solid #2d2d2d; font-size: 0.875rem; }
    .method { display: inline-block; padding: 2px 8px; border-radius: 3px; color: #fff; font-size: 0.75rem; font-weight: 600; }
    .path { font-family: 'Cascadia Code', 'Fira Code', monospace; color: #ce9178; }
    .source { color: #6a9955; font-size: 0.75rem; }
  </style>
</head>
<body>
  <h1>Routes (${allRoutes.length})</h1>
  <table>
    <tr><th>Method</th><th>Path</th><th>Source</th></tr>
    ${allRoutes
      .map(
        (r) => `<tr>
      <td><span class="method" style="background:${methodColors[r.method] || '#888'}">${r.method}</span></td>
      <td class="path">${r.path}</td>
      <td class="source">${r.source}</td>
    </tr>`,
      )
      .join('')}
  </table>
</body>
</html>`
}

async function runMigrationsUI() {
  const workspaceFolders = vscode.workspace.workspaceFolders
  if (!workspaceFolders) {
    vscode.window.showErrorMessage('No workspace folder open')
    return
  }

  const rootPath = workspaceFolders[0].uri.fsPath
  const migrationDir = vscode.Uri.file(`${rootPath}/src/database/migrations`)

  let migrations: string[] = []
  try {
    const entries = await vscode.workspace.fs.readDirectory(migrationDir)
    migrations = entries
      .filter(([name]) => name.endsWith('.ts'))
      .map(([name]) => name)
      .sort()
  } catch {
    // no migrations dir
  }

  const panel = vscode.window.createWebviewPanel('speexjsMigrations', 'SpeexJS Migrations', vscode.ViewColumn.One, {})

  panel.webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SpeexJS Migrations</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 1rem; background: #1e1e1e; color: #d4d4d4; }
    h1 { font-size: 1.25rem; margin-bottom: 1rem; color: #569cd6; }
    .migration { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border-bottom: 1px solid #2d2d2d; }
    .migration:last-child { border-bottom: none; }
    .name { font-family: 'Cascadia Code', 'Fira Code', monospace; font-size: 0.875rem; }
    .badge { padding: 2px 8px; border-radius: 3px; font-size: 0.75rem; }
    .badge.pending { background: #eab308; color: #000; }
    .badge.done { background: #22c55e; color: #000; }
    p { color: #888; }
    button { background: #0e639c; color: #fff; border: none; padding: 0.5rem 1rem; border-radius: 3px; cursor: pointer; margin-top: 1rem; }
    button:hover { background: #1177bb; }
  </style>
</head>
<body>
  <h1>Migrations</h1>
  <p>${migrations.length} migration file(s) found</p>
  ${
    migrations.length > 0
      ? migrations
          .map(
            (m) => `
    <div class="migration">
      <span class="name">${m}</span>
      <span class="badge pending">pending</span>
    </div>
  `,
          )
          .join('')
      : '<p>No migration files found. Create one with: speexjs make:migration</p>'
  }
  <div style="margin-top: 2rem">
    <p style="font-size: 0.8rem; color: #888">
      Use <code>speexjs migrate</code> in the terminal to run migrations.
    </p>
  </div>
</body>
</html>`
}

export function activate(context: vscode.ExtensionContext) {
  console.log('speexray extension activated')

  const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)
  statusBar.text = '$(search) speexray'
  statusBar.tooltip = 'Click to scan dependencies'
  statusBar.command = 'speexray.scan'
  statusBar.show()
  context.subscriptions.push(statusBar)

  const diagnosticProvider = new DiagnosticProvider()
  context.subscriptions.push(diagnosticProvider)

  if (vscode.window.activeTextEditor) {
    diagnosticProvider.updateDiagnostics(vscode.window.activeTextEditor.document)
  }

  const treeDataProvider = new SpeexrayTreeDataProvider()
  vscode.window.registerTreeDataProvider('speexrayResults', treeDataProvider)

  const treeView = vscode.window.createTreeView('speexrayResults', {
    treeDataProvider,
    showCollapseAll: true,
  })
  context.subscriptions.push(treeView)

  context.subscriptions.push(
    vscode.commands.registerCommand('speexray.scan', async () => {
      const editor = vscode.window.activeTextEditor
      if (!editor) {
        vscode.window.showInformationMessage('No active editor')
        return
      }

      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'speexray: Scanning dependencies...',
          cancellable: false,
        },
        async (progress) => {
          const result = await runSpeexrayScan(editor.document.uri.fsPath)
          diagnosticProvider.updateDiagnostics(editor.document, result)
          treeDataProvider.update(result)

          if (result.highImpactReplacements.length > 0 || result.securityIssues.length > 0) {
            vscode.window
              .showWarningMessage(
                `speexray found ${result.highImpactReplacements.length} optimizations and ${result.securityIssues.length} security issues`,
                'View Details',
              )
              .then((selection) => {
                if (selection === 'View Details') {
                  vscode.commands.executeCommand('speexrayResults.focus')
                }
              })
          } else {
            vscode.window.showInformationMessage('speexray: No issues found!')
          }
        },
      )
    }),

    vscode.commands.registerCommand('speexray.scanWorkspace', async () => {
      const folders = vscode.workspace.workspaceFolders
      if (!folders) {
        vscode.window.showInformationMessage('No workspace folders open')
        return
      }

      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'speexray: Scanning workspace...',
          cancellable: true,
        },
        async (progress, token) => {
          let totalIssues = 0
          let totalSecurity = 0

          for (const folder of folders) {
            if (token.isCancellationRequested) break

            const pkgPath = vscode.Uri.joinPath(folder.uri, 'package.json').fsPath
            try {
              const result = await runSpeexrayScan(pkgPath)
              totalIssues += result.highImpactReplacements.length + result.mediumImpactReplacements.length
              totalSecurity += result.securityIssues.length
            } catch {
              // skip folders without package.json
            }
          }

          vscode.window.showInformationMessage(`Workspace scan complete: ${totalIssues} optimizations, ${totalSecurity} security issues`)
        },
      )
    }),

    vscode.commands.registerCommand('speexray.applyReplacement', async (packageName: string, replacement: string) => {
      const editor = vscode.window.activeTextEditor
      if (!editor || !editor.document.fileName.endsWith('package.json')) return

      const text = editor.document.getText()
      const pkg = JSON.parse(text)
      const deps = { ...pkg.dependencies, ...pkg.devDependencies }

      if (!(packageName in deps)) {
        vscode.window.showWarningMessage(`${packageName} not found in dependencies`)
        return
      }

      const replaceIn = (section: string) => {
        if (pkg[section]?.[packageName]) {
          const edit = new vscode.WorkspaceEdit()
          const docUri = editor.document.uri
          const fullText = editor.document.getText()
          const lines = fullText.split('\n')
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(`"${packageName}"`)) {
              const startPos = new vscode.Position(i, 0)
              const endPos = new vscode.Position(i, lines[i].length + 1)
              edit.replace(docUri, new vscode.Range(startPos, endPos), '')
            }
          }
          return true
        }
        return false
      }

      const removed = replaceIn('dependencies') || replaceIn('devDependencies')

      if (removed) {
        vscode.window.showInformationMessage(`Removed ${packageName}. Suggested replacement: ${replacement}`)
      }
    }),
  )

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { pattern: '**/speexjs.config.{ts,js,mjs}' },
      {
        provideCompletionItems(document, position) {
          const linePrefix = document.lineAt(position).text.slice(0, position.character)
          const isDotAccess = linePrefix.includes('.')

          if (isDotAccess) {
            return getConfigPropertyCompletions()
          }

          return getConfigSchemaCompletions()
        },
      },
      '.',
      ':',
      '\n',
      ' ',
    ),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('speexjs.createController', async (args: any) => {
      const name = args?.fsPath
        ? args.fsPath
            .split('/')
            .pop()
            ?.replace(/\.ts$/, '')
            .replace(/controller$/i, '') + 'Controller'
        : undefined
      await scaffoldFile('Controller', name)
    }),

    vscode.commands.registerCommand('speexjs.createModel', async (args: any) => {
      const name = args?.fsPath
        ? args.fsPath
            .split('/')
            .pop()
            ?.replace(/\.ts$/, '')
            .replace(/model$/i, '')
        : undefined
      await scaffoldFile('Model', name)
    }),

    vscode.commands.registerCommand('speexjs.createMiddleware', async (args: any) => {
      const name = args?.fsPath
        ? args.fsPath
            .split('/')
            .pop()
            ?.replace(/\.ts$/, '')
            .replace(/middleware$/i, '')
        : undefined
      await scaffoldFile('Middleware', name)
    }),

    vscode.commands.registerCommand('speexjs.createRoute', async (args: any) => {
      const name = args?.fsPath
        ? args.fsPath
            .split('/')
            .pop()
            ?.replace(/\.ts$/, '')
            .replace(/route$/i, '')
        : undefined
      await scaffoldFile('Route', name)
    }),
  )

  context.subscriptions.push(vscode.commands.registerCommand('speexjs.showRoutes', showRoutesTree))

  context.subscriptions.push(vscode.commands.registerCommand('speexjs.runMigrations', runMigrationsUI))

  vscode.workspace.onDidOpenTextDocument(async (document) => {
    if (document.fileName.endsWith('package.json') && vscode.workspace.getConfiguration('speexray').get('scanOnOpen')) {
      const result = await runSpeexrayScan(document.uri.fsPath)
      diagnosticProvider.updateDiagnostics(document, result)
      treeDataProvider.update(result)
    }
  })

  vscode.workspace.onDidSaveTextDocument(async (document) => {
    if (document.fileName.endsWith('package.json')) {
      const result = await runSpeexrayScan(document.uri.fsPath)
      diagnosticProvider.updateDiagnostics(document, result)
      treeDataProvider.update(result)
    }
  })
}

export function deactivate() {}
