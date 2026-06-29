import * as vscode from 'vscode'
import { DiagnosticProvider } from './diagnosticProvider'
import { SpeexrayTreeDataProvider } from './speexrayProvider'
import { runSpeexrayScan } from './scanner'

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
