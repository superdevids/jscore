import * as vscode from 'vscode'
import type { ScanResult } from './scanner'

export class SpeexrayItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly description: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    iconId?: string,
    command?: vscode.Command,
  ) {
    super(label, collapsibleState)
    this.description = description
    this.tooltip = description
    this.iconPath = iconId ? new vscode.ThemeIcon(iconId) : undefined
    this.command = command
  }
}

export class SpeexrayTreeDataProvider implements vscode.TreeDataProvider<SpeexrayItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<SpeexrayItem | undefined>()
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event

  private scanResult: ScanResult | null = null

  update(result: ScanResult) {
    this.scanResult = result
    this._onDidChangeTreeData.fire(undefined)
  }

  getTreeItem(element: SpeexrayItem): vscode.TreeItem {
    return element
  }

  getChildren(element?: SpeexrayItem): Thenable<SpeexrayItem[]> {
    if (!this.scanResult) {
      return Promise.resolve([
        new SpeexrayItem(
          'Run scan to see results',
          'Click speexray: Scan Dependencies in command palette',
          vscode.TreeItemCollapsibleState.None,
          'search',
        ),
      ])
    }

    if (!element) {
      const items: SpeexrayItem[] = []

      items.push(
        new SpeexrayItem(
          this.scanResult.projectName,
          `${this.scanResult.directDeps} direct + ${this.scanResult.transitiveDeps} transitive | ${this.scanResult.totalEstimatedSize}`,
          vscode.TreeItemCollapsibleState.None,
          'package',
        ),
      )

      if (this.scanResult.highImpactReplacements.length > 0) {
        items.push(
          new SpeexrayItem(
            `High Impact Replacements (${this.scanResult.highImpactReplacements.length})`,
            '',
            vscode.TreeItemCollapsibleState.Expanded,
            'lightbulb',
          ),
        )
      }

      if (this.scanResult.mediumImpactReplacements.length > 0) {
        items.push(
          new SpeexrayItem(
            `Medium Impact (${this.scanResult.mediumImpactReplacements.length})`,
            '',
            vscode.TreeItemCollapsibleState.Collapsed,
            'info',
          ),
        )
      }

      if (this.scanResult.securityIssues.length > 0) {
        items.push(
          new SpeexrayItem(
            `Security Issues (${this.scanResult.securityIssues.length})`,
            '',
            vscode.TreeItemCollapsibleState.Expanded,
            'error',
          ),
        )
      }

      return Promise.resolve(items)
    }

    if (element.label?.toString().includes('High Impact')) {
      return Promise.resolve(
        this.scanResult!.highImpactReplacements.map(
          (r) =>
            new SpeexrayItem(
              `${r.packageName} \u2192 ${r.replacement}`,
              r.estimatedSizeReduction,
              vscode.TreeItemCollapsibleState.None,
              'replace',
              {
                command: 'speexray.applyReplacement',
                title: 'Apply Replacement',
                arguments: [r.packageName, r.replacement],
              },
            ),
        ),
      )
    }

    if (element.label?.toString().includes('Medium Impact')) {
      return Promise.resolve(
        this.scanResult!.mediumImpactReplacements.map(
          (r) =>
            new SpeexrayItem(
              `${r.packageName} \u2192 ${r.replacement}`,
              r.estimatedSizeReduction,
              vscode.TreeItemCollapsibleState.None,
              'info',
            ),
        ),
      )
    }

    if (element.label?.toString().includes('Security Issues')) {
      return Promise.resolve(
        this.scanResult!.securityIssues.map(
          (s) => new SpeexrayItem(`${s.cveId} (${s.severity})`, s.fix, vscode.TreeItemCollapsibleState.None, 'error'),
        ),
      )
    }

    return Promise.resolve([])
  }
}
