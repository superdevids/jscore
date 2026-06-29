export class SimpleSearch {
  private docs = new Map<string, string[]>()

  index(id: string, content: string): void {
    const words = content.toLowerCase().split(/\W+/).filter(Boolean)
    this.docs.set(id, [...new Set(words)])
  }

  remove(id: string): void { this.docs.delete(id) }

  search(query: string): string[] {
    const terms = query.toLowerCase().split(/\W+/).filter(Boolean)
    if (terms.length === 0) return []
    const results: { id: string; score: number }[] = []
    for (const [id, words] of this.docs) {
      let score = 0
      for (const term of terms) { if (words.includes(term)) score++ }
      if (score > 0) results.push({ id, score })
    }
    return results.sort((a, b) => b.score - a.score).map(r => r.id)
  }

  clear(): void { this.docs.clear() }
}
