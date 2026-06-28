export interface CursorPaginatedResult<T> {
  data: T[]
  cursors: {
    next: string | null
    previous: string | null
  }
  hasMore: boolean
}
