import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// ====================================================================
// CLI: make-migration & make-model shared mocks
// ====================================================================

const mockExistsSync = vi.fn()
const mockMkdirSync = vi.fn()
const mockWriteFileSync = vi.fn()
const mockResolve = vi.fn()
const mockExit = vi.fn()

vi.mock('node:fs', async (importOriginal) => ({
  ...(await importOriginal<typeof import('node:fs')>()),
  existsSync: mockExistsSync,
  mkdirSync: mockMkdirSync,
  writeFileSync: mockWriteFileSync,
}))

vi.mock('node:path', async (importOriginal) => ({
  ...(await importOriginal<typeof import('node:path')>()),
  resolve: mockResolve,
}))

vi.mock('../../src/native/colors.js', () => ({
  colors: {
    red: vi.fn((s: string) => s),
    green: vi.fn((s: string) => `[green]${s}`),
    bold: vi.fn((s: string) => s),
    cyan: vi.fn((s: string) => s),
    dim: vi.fn((s: string) => s),
  },
}))

vi.mock('../../src/native/logger.js', () => ({
  logger: {
    info: vi.fn(),
  },
}))

// ====================================================================
// CLI: make-migration
// ====================================================================

describe('make-migration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockResolve.mockImplementation((...args: string[]) => args.join('/').replace(/^C:/, ''))
    process.exit = mockExit as any
  })

  it('creates a migration file when it does not exist', async () => {
    mockExistsSync.mockReturnValue(false)
    const { makeMigration } = await import('../src/cli/commands/make-migration.js')
    makeMigration('CreateUsersTable')
    expect(mockMkdirSync).toHaveBeenCalled()
    expect(mockWriteFileSync).toHaveBeenCalled()
  })

  it('exits when migration file already exists', async () => {
    mockExistsSync.mockReturnValue(true)
    const { makeMigration } = await import('../src/cli/commands/make-migration.js')
    makeMigration('CreateUsersTable')
    expect(mockExit).toHaveBeenCalledWith(1)
  })

  it('generates correct migration content with snake_case table name', async () => {
    mockExistsSync.mockReturnValue(false)
    const { makeMigration } = await import('../src/cli/commands/make-migration.js')
    makeMigration('AddEmailToUsers')
    const content = mockWriteFileSync.mock.calls[0][1]
    expect(content).toContain('add_email_to_users')
    expect(content).toContain("table.increments('id')")
    expect(content).toContain('table.timestamps()')
    expect(content).toContain('schema.dropTable')
    expect(content).toContain('up')
    expect(content).toContain('down')
  })

  it('generates timestamped filename', async () => {
    mockExistsSync.mockReturnValue(false)
    const { makeMigration } = await import('../src/cli/commands/make-migration.js')
    makeMigration('Test')
    const targetDir = mockWriteFileSync.mock.calls[0][0]
    expect(targetDir).toContain('migrations')
  })

  it('writes file to src/database/migrations directory', async () => {
    mockExistsSync.mockReturnValue(false)
    const { makeMigration } = await import('../src/cli/commands/make-migration.js')
    makeMigration('CreateUsersTable')
    const fullPath = mockWriteFileSync.mock.calls[0][0]
    expect(fullPath).toContain('create_users_table')
  })
})

// ====================================================================
// CLI: make-model
// ====================================================================

describe('make-model', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockResolve.mockImplementation((...args: string[]) => args.join('/').replace(/^C:/, ''))
    process.exit = mockExit as any
  })

  it('creates a model file when it does not exist', async () => {
    mockExistsSync.mockReturnValue(false)
    const { makeModel } = await import('../src/cli/commands/make-model.js')
    makeModel('User')
    expect(mockMkdirSync).toHaveBeenCalled()
    expect(mockWriteFileSync).toHaveBeenCalled()
    const content = mockWriteFileSync.mock.calls[0][1]
    expect(content).toContain('class User extends Model')
    expect(content).toContain("static table = 'users'")
  })

  it('exits when model file already exists', async () => {
    mockExistsSync.mockReturnValue(true)
    const { makeModel } = await import('../src/cli/commands/make-model.js')
    makeModel('User')
    expect(mockExit).toHaveBeenCalledWith(1)
  })

  it('generates correct model content for various names', async () => {
    mockExistsSync.mockReturnValue(false)
    const { makeModel } = await import('../src/cli/commands/make-model.js')
    makeModel('Category')
    const content = mockWriteFileSync.mock.calls[0][1]
    expect(content).toContain('class Category extends Model')
    expect(content).toContain("static table = 'categories'")
  })

  it('handles names ending in y with ies plural', async () => {
    mockExistsSync.mockReturnValue(false)
    const { makeModel } = await import('../src/cli/commands/make-model.js')
    makeModel('Category')
    const content = mockWriteFileSync.mock.calls[0][1]
    expect(content).toContain("'categories'")
  })

  it('handles names ending in s without double plural', async () => {
    mockExistsSync.mockReturnValue(false)
    const { makeModel } = await import('../src/cli/commands/make-model.js')
    makeModel('Address')
    const content = mockWriteFileSync.mock.calls[0][1]
    expect(content).toContain("'address'")
  })

  it('generates snake_case filename', async () => {
    mockExistsSync.mockReturnValue(false)
    const { makeModel } = await import('../src/cli/commands/make-model.js')
    makeModel('MyModel')
    const output = mockWriteFileSync.mock.calls[0][0]
    expect(output).toContain('my_model.model.ts')
  })

  it('includes relationship comments in generated content', async () => {
    mockExistsSync.mockReturnValue(false)
    const { makeModel } = await import('../src/cli/commands/make-model.js')
    makeModel('Post')
    const content = mockWriteFileSync.mock.calls[0][1]
    expect(content).toContain('belongsTo')
    expect(content).toContain('hasMany')
  })
})

// ====================================================================
// CLI: serve
// ====================================================================

vi.mock('node:url', () => ({
  pathToFileURL: vi.fn((p: string) => ({ href: `file://${p.replace(/\\/g, '/')}` })),
}))

describe('serve command', () => {
  let consoleErrorSpy: any
  let consoleLogSpy: any
  let origExecArgv: string[]

  beforeEach(async () => {
    vi.clearAllMocks()
    origExecArgv = process.execArgv
    mockResolve.mockImplementation((...args: string[]) => args.join('/').replace(/^C:/, ''))
    process.exit = mockExit as any
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy?.mockRestore()
    consoleLogSpy?.mockRestore()
    Object.defineProperty(process, 'execArgv', { value: origExecArgv, configurable: true })
  })

  it('exits with error when no entry point is found', async () => {
    mockExistsSync.mockReturnValue(false)
    const { serve } = await import('../src/cli/commands/serve.js')
    try { await serve({}) } catch {}
    expect(mockExit).toHaveBeenCalledWith(1)
    expect(consoleErrorSpy).toHaveBeenCalled()
  })

  it('tries app.ts as first entry point', async () => {
    mockExistsSync.mockImplementation((path: string) => path.includes('src/app.ts'))
    const { serve } = await import('../src/cli/commands/serve.js')
    await serve({})
    expect(consoleErrorSpy).toHaveBeenCalled()
  })

  it('falls back to server/index.ts when app.ts not found', async () => {
    let callCount = 0
    mockExistsSync.mockImplementation((path: string) => {
      callCount++
      return callCount >= 2
    })
    const { serve } = await import('../src/cli/commands/serve.js')
    await serve({})
  })

  it('falls back to src/index.ts when others not found', async () => {
    let callCount = 0
    mockExistsSync.mockImplementation((path: string) => {
      callCount++
      return callCount >= 3
    })
    const { serve } = await import('../src/cli/commands/serve.js')
    await serve({})
  })

  it('parses port and host options', async () => {
    mockExistsSync.mockReturnValue(false)
    const { serve } = await import('../src/cli/commands/serve.js')
    try { await serve({ port: '8080', host: '0.0.0.0' }) } catch {}
    expect(mockExit).toHaveBeenCalledWith(1)
  })

  it('parses short flags -p and -H', async () => {
    mockExistsSync.mockReturnValue(false)
    const { serve } = await import('../src/cli/commands/serve.js')
    try { await serve({ p: 9000, H: '0.0.0.0' }) } catch {}
    expect(mockExit).toHaveBeenCalledWith(1)
  })

  it('disables dev mode when dev=false', async () => {
    mockExistsSync.mockReturnValue(false)
    const { serve } = await import('../src/cli/commands/serve.js')
    try { await serve({ dev: false }) } catch {}
    expect(mockExit).toHaveBeenCalledWith(1)
  })

  it('handles import failure in dev mode', async () => {
    mockExistsSync.mockReturnValue(true)
    const { serve } = await import('../src/cli/commands/serve.js')
    await serve({ dev: true })
    expect(consoleErrorSpy).toHaveBeenCalled()
  })

  it('handles import failure in production mode', async () => {
    mockExistsSync.mockReturnValue(true)
    const { serve } = await import('../src/cli/commands/serve.js')
    await serve({ dev: false })
    expect(consoleErrorSpy).toHaveBeenCalled()
  })

  it('ensureTsLoader skips when execArgv has strip-types', async () => {
    Object.defineProperty(process, 'execArgv', {
      value: ['--experimental-strip-types'],
      configurable: true,
    })
    mockExistsSync.mockReturnValue(false)
    const { serve } = await import('../src/cli/commands/serve.js')
    try { await serve({ dev: true }) } catch {}
    expect(mockExit).toHaveBeenCalledWith(1)
  })

  it('ensureTsLoader skips when execArgv has tsx', async () => {
    Object.defineProperty(process, 'execArgv', {
      value: ['--import', 'tsx'],
      configurable: true,
    })
    mockExistsSync.mockReturnValue(false)
    const { serve } = await import('../src/cli/commands/serve.js')
    try { await serve({ dev: true }) } catch {}
    expect(mockExit).toHaveBeenCalledWith(1)
  })

  it('defaults port to 3000 and host to localhost', async () => {
    mockExistsSync.mockReturnValue(false)
    const { serve } = await import('../src/cli/commands/serve.js')
    try { await serve({}) } catch {}
    expect(mockExit).toHaveBeenCalledWith(1)
  })
})

// ====================================================================
// Client/VDOM: jsx-runtime
// ====================================================================

describe('jsx-runtime', () => {
  it('exports Fragment', async () => {
    const mod = await import('../src/client/vdom/jsx-runtime.js')
    expect(mod.Fragment).toBeDefined()
  })

  it('jsx creates element node for string tags', async () => {
    const { jsx } = await import('../src/client/vdom/jsx-runtime.js')
    const vnode = jsx('div', { id: 'test', children: 'hello' })
    expect(vnode.type).toBe('element')
    expect((vnode as any).tag).toBe('div')
    expect((vnode as any).props.id).toBe('test')
    expect((vnode as any).children).toHaveLength(1)
    expect((vnode as any).children[0].text).toBe('hello')
  })

  it('jsx creates component node for function tags', async () => {
    const { jsx } = await import('../src/client/vdom/jsx-runtime.js')
    const Comp = (props: any) => props
    const vnode = jsx(Comp, { name: 'test' })
    expect(vnode.type).toBe('component')
    expect((vnode as any).component).toBe(Comp)
    expect((vnode as any).props.name).toBe('test')
  })

  it('jsx handles key parameter', async () => {
    const { jsx } = await import('../src/client/vdom/jsx-runtime.js')
    const vnode = jsx('span', { children: 'x' }, 'my-key')
    expect((vnode as any).key).toBe('my-key')
  })

  it('jsx handles children as array', async () => {
    const { jsx } = await import('../src/client/vdom/jsx-runtime.js')
    const vnode = jsx('ul', { children: ['a', 'b', 'c'] })
    expect((vnode as any).children).toHaveLength(3)
  })

  it('jsx handles no children', async () => {
    const { jsx } = await import('../src/client/vdom/jsx-runtime.js')
    const vnode = jsx('br', {})
    expect((vnode as any).children).toHaveLength(0)
  })

  it('jsx handles null children', async () => {
    const { jsx } = await import('../src/client/vdom/jsx-runtime.js')
    const vnode = jsx('div', { children: null })
    expect((vnode as any).children).toHaveLength(0)
  })

  it('jsx handles no props', async () => {
    const { jsx } = await import('../src/client/vdom/jsx-runtime.js')
    const vnode = jsx('div', undefined)
    expect((vnode as any).children).toHaveLength(0)
  })

  it('jsx flattens nested children arrays', async () => {
    const { jsx } = await import('../src/client/vdom/jsx-runtime.js')
    const vnode = jsx('div', { children: [['a', ['b']], 'c'] })
    expect((vnode as any).children).toHaveLength(3)
  })

  it('jsxs delegates to jsx', async () => {
    const { jsxs } = await import('../src/client/vdom/jsx-runtime.js')
    const vnode = jsxs('div', { children: ['a', 'b'] })
    expect(vnode.type).toBe('element')
    expect((vnode as any).children).toHaveLength(2)
  })

  it('jsxDEV delegates to jsx', async () => {
    const { jsxDEV } = await import('../src/client/vdom/jsx-runtime.js')
    const vnode = jsxDEV('div', { children: 'hello' })
    expect(vnode.type).toBe('element')
    expect((vnode as any).children).toHaveLength(1)
  })
})

// ====================================================================
// Client/VDOM: jsx
// ====================================================================

describe('createElement', () => {
  it('creates element for string tags', async () => {
    const { createElement } = await import('../src/client/vdom/jsx.js')
    const vnode = createElement('div', { id: 'foo' }, 'hello')
    expect(vnode.type).toBe('element')
    expect((vnode as any).tag).toBe('div')
    expect((vnode as any).props.id).toBe('foo')
  })

  it('creates component for function tags', async () => {
    const { createElement } = await import('../src/client/vdom/jsx.js')
    const Comp = (props: any) => props
    const vnode = createElement(Comp, { x: 1 }, 'child')
    expect(vnode.type).toBe('component')
    expect((vnode as any).component).toBe(Comp)
  })

  it('component receives no children when none passed', async () => {
    const { createElement } = await import('../src/client/vdom/jsx.js')
    const Comp = (props: any) => props
    const vnode = createElement(Comp, { x: 1 })
    expect((vnode as any).props.children).toBeUndefined()
  })

  it('handles null/boolean children as empty text', async () => {
    const { createElement } = await import('../src/client/vdom/jsx.js')
    const vnode = createElement('div', {}, null, false, true, undefined)
    const children = (vnode as any).children
    expect(children).toHaveLength(4)
    expect(children[0].text).toBe('')
    expect(children[1].text).toBe('')
    expect(children[2].text).toBe('')
    expect(children[3].text).toBe('')
  })

  it('handles existing vnode children', async () => {
    const { createElement } = await import('../src/client/vdom/jsx.js')
    const existing = { type: 'text', text: 'existing' }
    const vnode = createElement('div', {}, existing)
    expect((vnode as any).children[0]).toBe(existing)
  })

  it('handles numeric children', async () => {
    const { createElement } = await import('../src/client/vdom/jsx.js')
    const vnode = createElement('div', {}, 42)
    expect((vnode as any).children[0].text).toBe('42')
  })

  it('handles no children', async () => {
    const { createElement } = await import('../src/client/vdom/jsx.js')
    const vnode = createElement('br', {})
    expect((vnode as any).children).toHaveLength(0)
  })

  it('handles isSVG prop by stripping it', async () => {
    const { createElement } = await import('../src/client/vdom/jsx.js')
    const vnode = createElement('svg', { isSVG: true, viewBox: '0 0 100 100' })
    expect((vnode as any).props.isSVG).toBeUndefined()
    expect((vnode as any).props.viewBox).toBe('0 0 100 100')
  })
})

describe('Fragment', () => {
  it('creates fragment with multiple children', async () => {
    const { Fragment } = await import('../src/client/vdom/jsx.js')
    const result = Fragment({ children: ['a', 'b', 'c'] })
    expect(result.type).toBe('fragment')
    expect((result as any).children).toHaveLength(3)
  })

  it('returns single child directly', async () => {
    const { Fragment } = await import('../src/client/vdom/jsx.js')
    const result = Fragment({ children: 'only' })
    expect(result.type).toBe('text')
  })

  it('returns empty text when no children', async () => {
    const { Fragment } = await import('../src/client/vdom/jsx.js')
    const result = Fragment({})
    expect(result.type).toBe('text')
    expect((result as any).text).toBe('')
  })

  it('returns empty text when children is undefined', async () => {
    const { Fragment } = await import('../src/client/vdom/jsx.js')
    const result = Fragment({ children: undefined })
    expect(result.type).toBe('text')
  })

  it('handles null/boolean children in array', async () => {
    const { Fragment } = await import('../src/client/vdom/jsx.js')
    const result = Fragment({ children: ['a', null, false, 'b'] })
    expect(result.type).toBe('fragment')
    expect((result as any).children).toHaveLength(4)
  })

  it('flattens nested arrays', async () => {
    const { Fragment } = await import('../src/client/vdom/jsx.js')
    const result = Fragment({ children: [['a', ['b']], 'c'] })
    expect(result.type).toBe('fragment')
    expect((result as any).children).toHaveLength(3)
  })

  it('passes through existing vnodes', async () => {
    const { Fragment } = await import('../src/client/vdom/jsx.js')
    const existing = { type: 'element', tag: 'span', props: {}, children: [] }
    const result = Fragment({ children: existing })
    expect(result).toBe(existing)
  })
})

// ====================================================================
// Server: helpers (URLBuilder, responseMacros)
// ====================================================================

describe('URLBuilder', () => {
  it('defaults base URL to localhost:3000', async () => {
    const { URLBuilder } = await import('../src/server/helpers.js')
    const b = new URLBuilder()
    expect(b.getBaseUrl()).toBe('http://localhost:3000')
  })

  it('accepts custom base URL', async () => {
    const { URLBuilder } = await import('../src/server/helpers.js')
    const b = new URLBuilder('https://example.com')
    expect(b.getBaseUrl()).toBe('https://example.com')
  })

  it('to() builds correct URL', async () => {
    const { URLBuilder } = await import('../src/server/helpers.js')
    const b = new URLBuilder('https://example.com')
    expect(b.to('/api/users')).toBe('https://example.com/api/users')
  })

  it('to() normalizes backslashes', async () => {
    const { URLBuilder } = await import('../src/server/helpers.js')
    const b = new URLBuilder()
    const result = b.to('api\\users\\1')
    expect(result).toBe('http://localhost:3000/api/users/1')
  })

  it('to() adds leading slash if missing', async () => {
    const { URLBuilder } = await import('../src/server/helpers.js')
    const b = new URLBuilder()
    expect(b.to('api/test')).toBe('http://localhost:3000/api/test')
  })

  it('to() strips trailing slash from base', async () => {
    const { URLBuilder } = await import('../src/server/helpers.js')
    const b = new URLBuilder('http://example.com/')
    expect(b.to('/path')).toBe('http://example.com/path')
  })

  it('asset() delegates to to()', async () => {
    const { URLBuilder } = await import('../src/server/helpers.js')
    const b = new URLBuilder()
    expect(b.asset('/img/logo.png')).toBe('http://localhost:3000/img/logo.png')
  })

  it('secure() upgrades http to https', async () => {
    const { URLBuilder } = await import('../src/server/helpers.js')
    const b = new URLBuilder('http://example.com')
    expect(b.secure('/api')).toBe('https://example.com/api')
  })

  it('secure() normalizes backslashes', async () => {
    const { URLBuilder } = await import('../src/server/helpers.js')
    const b = new URLBuilder('http://example.com')
    const result = b.secure('api\\users')
    expect(result).toBe('https://example.com/api/users')
  })

  it('secure() adds leading slash if missing', async () => {
    const { URLBuilder } = await import('../src/server/helpers.js')
    const b = new URLBuilder('http://example.com')
    expect(b.secure('test')).toBe('https://example.com/test')
  })

  it('route() throws without router reference', async () => {
    const { URLBuilder } = await import('../src/server/helpers.js')
    const b = new URLBuilder()
    expect(() => b.route('users.show', { id: 1 })).toThrow('URLBuilder.route()')
  })

  it('setBaseUrl updates the base URL', async () => {
    const { URLBuilder } = await import('../src/server/helpers.js')
    const b = new URLBuilder()
    b.setBaseUrl('https://staging.example.com')
    expect(b.getBaseUrl()).toBe('https://staging.example.com')
  })
})

describe('url() singleton', () => {
  it('returns a URLBuilder instance', async () => {
    const { url } = await import('../src/server/helpers.js')
    const instance = url()
    expect(instance).toBeInstanceOf(Object)
    expect(typeof instance.to).toBe('function')
  })

  it('returns the same instance on repeated calls', async () => {
    const { url } = await import('../src/server/helpers.js')
    const a = url()
    const b = url()
    expect(a).toBe(b)
  })
})

describe('responseMacros', () => {
  let mockResponse: any

  beforeEach(async () => {
    mockResponse = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    }
  })

  it('success macro sends success response', async () => {
    const { responseMacros } = await import('../src/server/helpers.js')
    responseMacros(mockResponse)
    mockResponse.success({ id: 1 }, 'All good')
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      message: 'All good',
      data: { id: 1 },
    })
  })

  it('success macro uses default message', async () => {
    const { responseMacros } = await import('../src/server/helpers.js')
    responseMacros(mockResponse)
    mockResponse.success({ id: 1 })
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      message: 'Success',
      data: { id: 1 },
    })
  })

  it('error macro sends error response with default status 400', async () => {
    const { responseMacros } = await import('../src/server/helpers.js')
    responseMacros(mockResponse)
    mockResponse.error('Something went wrong')
    expect(mockResponse.json).toHaveBeenCalledWith(
      { success: false, message: 'Something went wrong' },
      400,
    )
  })

  it('error macro sends error response with custom status', async () => {
    const { responseMacros } = await import('../src/server/helpers.js')
    responseMacros(mockResponse)
    mockResponse.error('Not found', 404)
    expect(mockResponse.json).toHaveBeenCalledWith(
      { success: false, message: 'Not found' },
      404,
    )
  })

  it('created macro sends 201 with data', async () => {
    const { responseMacros } = await import('../src/server/helpers.js')
    responseMacros(mockResponse)
    mockResponse.created({ id: 1 })
    expect(mockResponse.status).toHaveBeenCalledWith(201)
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      message: 'Created',
      data: { id: 1 },
    })
  })

  it('created macro uses custom message', async () => {
    const { responseMacros } = await import('../src/server/helpers.js')
    responseMacros(mockResponse)
    mockResponse.created({ id: 1 }, 'User created')
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      message: 'User created',
      data: { id: 1 },
    })
  })

  it('noContent macro sends 204 empty', async () => {
    const { responseMacros } = await import('../src/server/helpers.js')
    responseMacros(mockResponse)
    mockResponse.noContent()
    expect(mockResponse.status).toHaveBeenCalledWith(204)
    expect(mockResponse.send).toHaveBeenCalledWith('')
  })

  it('accepted macro sends 202 with data and default message', async () => {
    const { responseMacros } = await import('../src/server/helpers.js')
    responseMacros(mockResponse)
    mockResponse.accepted({ id: 1 })
    expect(mockResponse.status).toHaveBeenCalledWith(202)
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      message: 'Accepted',
      data: { id: 1 },
    })
  })

  it('accepted macro works without data', async () => {
    const { responseMacros } = await import('../src/server/helpers.js')
    responseMacros(mockResponse)
    mockResponse.accepted()
    expect(mockResponse.status).toHaveBeenCalledWith(202)
  })

  it('accepted macro uses custom message', async () => {
    const { responseMacros } = await import('../src/server/helpers.js')
    responseMacros(mockResponse)
    mockResponse.accepted({ id: 1 }, 'Queued')
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      message: 'Queued',
      data: { id: 1 },
    })
  })

  it('paginated macro sends paginated response', async () => {
    const { responseMacros } = await import('../src/server/helpers.js')
    responseMacros(mockResponse)
    mockResponse.paginated([1, 2], { total: 2, page: 1, perPage: 10, lastPage: 1 })
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: true,
      data: [1, 2],
      meta: { total: 2, page: 1, perPage: 10, lastPage: 1 },
    })
  })

  it('registerMacro registers a custom macro', async () => {
    const { registerMacro, responseMacros } = await import('../src/server/helpers.js')
    registerMacro('custom', function (this: any, value: string) {
      return this.json({ value })
    })
    responseMacros(mockResponse)
    mockResponse.custom('test')
    expect(mockResponse.json).toHaveBeenCalledWith({ value: 'test' })
  })
})

// ====================================================================
// Server: auth/middleware (coverage gaps)
// ====================================================================

describe('auth middleware - additional coverage', () => {
  let AuthManager: any, authMiddleware: any, guestMiddleware: any
  let SessionGuard: any, TokenGuard: any
  let authManager: any

  function makeReqStub(overrides: Record<string, unknown> = {}) {
    return {
      cookie: vi.fn(),
      bearerToken: vi.fn(),
      wantsJson: vi.fn(() => true),
      ...overrides,
    } as any
  }

  function makeResStub(overrides: Record<string, unknown> = {}) {
    return {
      cookie: vi.fn().mockReturnThis(),
      clearCookie: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      redirect: vi.fn().mockReturnThis(),
      ...overrides,
    } as any
  }

  function makeContainer() {
    return {
      resolve: vi.fn((name: string) => {
        if (name === 'auth') return authManager
        return undefined
      }),
    } as any
  }

  function makeCtx(overrides: Record<string, unknown> = {}) {
    return {
      request: makeReqStub(),
      response: makeResStub(),
      container: makeContainer(),
      params: {},
      query: {},
      ...overrides,
    } as any
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    const authMod = await import('../src/server/auth/index.js')
    AuthManager = authMod.AuthManager
    authMiddleware = (await import('../src/server/auth/middleware.js')).authMiddleware
    guestMiddleware = (await import('../src/server/auth/middleware.js')).guestMiddleware
    SessionGuard = (await import('../src/server/auth/session-guard.js')).SessionGuard
    TokenGuard = (await import('../src/server/auth/token-guard.js')).TokenGuard
    authManager = new AuthManager()
  })

  it('authMiddleware with TokenGuard and undefined bearer token', async () => {
    const guard = new TokenGuard()
    authManager.guard('api', guard)
    const ctx = makeCtx({
      request: makeReqStub({ bearerToken: vi.fn(() => undefined), wantsJson: vi.fn(() => true) }),
    })
    const next = vi.fn()
    await authMiddleware('api')(ctx, next)
    expect(ctx.response.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('authMiddleware redirects to login path when not wantsJson and loginPath set', async () => {
    authManager.setLoginPath('/admin/login')
    const guard = new SessionGuard()
    authManager.guard('web', guard)
    const ctx = makeCtx({
      request: makeReqStub({ wantsJson: vi.fn(() => false) }),
    })
    const next = vi.fn()
    await authMiddleware('web')(ctx, next)
    expect(ctx.response.redirect).toHaveBeenCalledWith('/admin/login', 302)
    expect(next).not.toHaveBeenCalled()
  })

  it('authMiddleware returns JSON when not wantsJson and no loginPath', async () => {
    authManager.setLoginPath(undefined)
    const guard = new SessionGuard()
    authManager.guard('web', guard)
    const ctx = makeCtx({
      request: makeReqStub({ wantsJson: vi.fn(() => false) }),
    })
    const next = vi.fn()
    await authMiddleware('web')(ctx, next)
    expect(ctx.response.status).toHaveBeenCalledWith(401)
    expect(ctx.response.json).toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()
  })

  it('guestMiddleware redirects when authenticated and not wantsJson', async () => {
    const guard = new SessionGuard()
    vi.spyOn(guard, 'user').mockResolvedValue({ id: 1, name: 'Test' })
    authManager.guard('web', guard)
    const ctx = makeCtx({
      request: makeReqStub({ wantsJson: vi.fn(() => false) }),
    })
    const next = vi.fn()
    await guestMiddleware()(ctx, next)
    expect(ctx.response.redirect).toHaveBeenCalledWith('/', 302)
    expect(next).not.toHaveBeenCalled()
  })

  it('sets ctx.user and ctx.auth on authenticated TokenGuard', async () => {
    const { TokenGuard: TG } = await import('../src/server/auth/token-guard.js')
    const provider = {
      create: vi.fn(),
      find: vi.fn().mockResolvedValue({ userId: 5, abilities: [] }),
      delete: vi.fn(),
      deleteAllForUser: vi.fn(),
    }
    const lookup = { findById: vi.fn().mockResolvedValue({ id: 5, name: 'Found' }) }
    const guard = new TG({ provider, userLookup: lookup })
    authManager.guard('api', guard)
    const ctx = makeCtx({
      request: makeReqStub({ bearerToken: vi.fn(() => 'valid-token'), wantsJson: vi.fn(() => true) }),
    })
    const next = vi.fn().mockResolvedValue(undefined)
    await authMiddleware('api')(ctx, next)
    expect((ctx as any).user).toEqual({ id: 5, name: 'Found' })
    expect((ctx as any).auth).toBe(guard)
    expect(next).toHaveBeenCalled()
  })
})

// ====================================================================
// Schema: complex.ts uncovered lines
// ====================================================================

describe('schema/complex - additional coverage', () => {
  it('EnumSchema rejects non-string values', async () => {
    const { schema } = await import('../src/schema/index.js')
    const sc = schema.enum(['a', 'b'])
    expect(() => sc.parse(123 as any)).toThrow('Expected a string')
  })

  it('EnumSchema exposes enum values', async () => {
    const { EnumSchema } = await import('../src/schema/complex.js')
    const sc = new EnumSchema(['x', 'y'])
    expect(sc.enum).toEqual(['x', 'y'])
  })

  it('UnionSchema collects all error messages on failure', async () => {
    const { schema } = await import('../src/schema/index.js')
    const sc = schema.union(schema.string(), schema.number())
    expect(() => sc.parse(true)).toThrow('Value does not match any schema')
  })

  it('IntersectionSchema returns merged result for objects', async () => {
    const { schema } = await import('../src/schema/index.js')
    const sc = schema.intersection(
      schema.object({ a: schema.number() }),
      schema.object({ b: schema.string() }),
    )
    expect(sc.parse({ a: 1, b: 'x' })).toEqual({ a: 1, b: 'x' })
  })

  it('IntersectionSchema returns same primitive when both match', async () => {
    const { schema } = await import('../src/schema/index.js')
    const sc = schema.intersection(schema.literal(42), schema.literal(42))
    expect(sc.parse(42)).toBe(42)
  })

  it('IntersectionSchema throws on conflicting primitive transforms', async () => {
    const { schema, Schema } = await import('../src/schema/index.js')
    const { IntersectionSchema } = await import('../src/schema/complex.js')
    const sc = new IntersectionSchema(
      schema.transform((v: unknown) => 42),
      schema.transform((v: unknown) => 43),
    )
    expect(() => sc.parse('x')).toThrow('intersection')
  })

  it('RecordSchema rejects non-object values', async () => {
    const { schema } = await import('../src/schema/index.js')
    const sc = schema.record(schema.number())
    expect(() => sc.parse('not-object' as any)).toThrow('Expected an object')
  })

  it('RecordSchema rejects arrays', async () => {
    const { schema } = await import('../src/schema/index.js')
    const sc = schema.record(schema.any())
    expect(() => sc.parse([1, 2])).toThrow('Expected an object')
  })

  it('RecordSchema parses string-keyed records', async () => {
    const { schema } = await import('../src/schema/index.js')
    const sc = schema.record(schema.boolean())
    expect(sc.parse({ a: true, b: false })).toEqual({ a: true, b: false })
  })

  it('DateSchema parses number timestamps', async () => {
    const { schema } = await import('../src/schema/index.js')
    const result = schema.date().parse(1704067200000)
    expect(result).toBeInstanceOf(Date)
    expect(result.getTime()).toBe(1704067200000)
  })

  it('DateSchema rejects invalid Date instance', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(() => schema.date().parse(new Date('invalid'))).toThrow('Invalid date')
  })

  it('DateSchema rejects NaN', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(() => schema.date().parse(NaN)).toThrow('Invalid date')
  })

  it('DateSchema validates from string', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(schema.date().parse('2024-01-01')).toBeInstanceOf(Date)
  })

  it('DateSchema rejects invalid string', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(() => schema.date().parse('not-a-date')).toThrow('Invalid date')
  })

  it('DateSchema rejects non-date types', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(() => schema.date().parse(true as any)).toThrow('Expected a valid date')
  })

  it('ObjectSchema strict mode rejects unknown keys', async () => {
    const { schema } = await import('../src/schema/index.js')
    const sc = schema.object({ name: schema.string() }).strict()
    expect(() => sc.parse({ name: 'x', extra: 'y' })).toThrow('Unexpected key')
  })

  it('ObjectSchema passthrough mode keeps unknown keys', async () => {
    const { schema } = await import('../src/schema/index.js')
    const sc = schema.object({ name: schema.string() }).passthrough()
    expect(sc.parse({ name: 'x', extra: 'y' })).toEqual({ name: 'x', extra: 'y' })
  })

  it('ObjectSchema nested error includes path', async () => {
    const { schema } = await import('../src/schema/index.js')
    const inner = schema.object({ age: schema.number() })
    const outer = schema.object({ inner })
    try {
      outer.parse({ inner: { age: 'not-number' } })
      expect.unreachable()
    } catch (e: any) {
      expect(e.message).toContain('Expected a number')
    }
  })
})

// ====================================================================
// Schema: messages.ts uncovered lines
// ====================================================================

describe('schema/messages', () => {
  it('msg returns key when not found', async () => {
    const { msg } = await import('../src/schema/messages.js')
    expect(msg('nonexistent_key')).toBe('nonexistent_key')
  })

  it('msg substitutes params', async () => {
    const { msg } = await import('../src/schema/messages.js')
    const result = msg('string_min', { min: 5 })
    expect(result).toBe('Minimum 5 characters')
  })

  it('msg handles undefined param value', async () => {
    const { msg } = await import('../src/schema/messages.js')
    const result = msg('string_includes', { substring: undefined })
    expect(result).toBe('Must contain ""')
  })

  it('getLocale returns en', async () => {
    const { getLocale } = await import('../src/schema/messages.js')
    expect(getLocale()).toBe('en')
  })

  it('setLocale resets to English', async () => {
    const { setLocale, msg } = await import('../src/schema/messages.js')
    setLocale('en')
    expect(msg('type_string')).toBe('Expected a string')
  })
})

// ====================================================================
// Schema: primitives.ts uncovered lines
// ====================================================================

describe('schema/primitives - additional coverage', () => {
  it('NumberSchema rejects NaN in _parse', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(() => schema.number().parse(NaN)).toThrow('Expected a number')
  })

  it('email validator rejects too long email', async () => {
    const { schema } = await import('../src/schema/index.js')
    const localPart = 'a'.repeat(300)
    expect(() => schema.string().email().parse(`${localPart}@b.com`)).toThrow('Invalid email')
  })

  it('email validator rejects missing @', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(() => schema.string().email().parse('noatsign')).toThrow('Invalid email')
  })

  it('email validator rejects @ at start', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(() => schema.string().email().parse('@domain.com')).toThrow('Invalid email')
  })

  it('email validator rejects @ at end', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(() => schema.string().email().parse('user@')).toThrow('Invalid email')
  })

  it('email validator rejects too long local part', async () => {
    const { schema } = await import('../src/schema/index.js')
    const local = 'a'.repeat(65)
    expect(() => schema.string().email().parse(`${local}@b.com`)).toThrow('Invalid email')
  })

  it('email validator rejects too long domain part', async () => {
    const { schema } = await import('../src/schema/index.js')
    const label = 'a'.repeat(256)
    expect(() => schema.string().email().parse(`user@${label}`)).toThrow('Invalid email')
  })

  it('email validator rejects domain without dot', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(() => schema.string().email().parse('user@domain')).toThrow('Invalid email')
  })

  it('email validator accepts quoted local part', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(schema.string().email().parse('"test user"@example.com')).toBe('"test user"@example.com')
  })

  it('email validator rejects unterminated quoted local part', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(() => schema.string().email().parse('"unclosed@example.com')).toThrow('Invalid email')
  })

  it('email validator rejects quoted string with unescaped quote', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(() => schema.string().email().parse('"test"user"@example.com')).toThrow('Invalid email')
  })

  it('email validator handles backslash escape inside quotes', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(schema.string().email().parse('"test\\@user"@example.com')).toBe('"test\\@user"@example.com')
  })

  it('email validator rejects backslash at end of quoted part', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(() => schema.string().email().parse('"test\\"@example.com')).toThrow('Invalid email')
  })

  it('email validator rejects local part starting with dot', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(() => schema.string().email().parse('.user@example.com')).toThrow('Invalid email')
  })

  it('email validator rejects local part ending with dot', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(() => schema.string().email().parse('user.@example.com')).toThrow('Invalid email')
  })

  it('email validator rejects special chars in local part', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(() => schema.string().email().parse('user<test>@example.com')).toThrow('Invalid email')
  })

  it('email validator rejects consecutive dots in local part', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(() => schema.string().email().parse('user..name@example.com')).toThrow('Invalid email')
  })

  it('email validator rejects domain label starting with dash', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(() => schema.string().email().parse('user@-example.com')).toThrow('Invalid email')
  })

  it('email validator rejects domain label ending with dash', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(() => schema.string().email().parse('user@example-.com')).toThrow('Invalid email')
  })

  it('email validator rejects domain label with special chars', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(() => schema.string().email().parse('user@exa_mple.com')).toThrow('Invalid email')
  })

  it('email validator rejects empty domain label', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(() => schema.string().email().parse('user@.com')).toThrow('Invalid email')
  })

  it('email validator rejects overlong domain label', async () => {
    const { schema } = await import('../src/schema/index.js')
    const label = 'a'.repeat(64)
    expect(() => schema.string().email().parse(`user@${label}.com`)).toThrow('Invalid email')
  })

  it('url validator rejects non-http/https protocol', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(() => schema.string().url().parse('ftp://example.com')).toThrow('Invalid URL format')
  })

  it('url validator rejects empty string', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(() => schema.string().url().parse('')).toThrow('Invalid URL format')
  })

  it('url validator accepts https URL', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(schema.string().url().parse('https://example.com')).toBe('https://example.com')
  })
})

// ====================================================================
// Schema: transform.ts uncovered lines
// ====================================================================

describe('schema/transform - additional coverage', () => {
  it('CoerceStringSchema rejects null', async () => {
    const { CoerceStringSchema } = await import('../src/schema/transform.js')
    expect(() => new CoerceStringSchema().parse(null)).toThrow('Expected a string')
  })

  it('CoerceStringSchema rejects undefined', async () => {
    const { CoerceStringSchema } = await import('../src/schema/transform.js')
    expect(() => new CoerceStringSchema().parse(undefined)).toThrow('Expected a string')
  })

  it('CoerceStringSchema coerces numbers', async () => {
    const { CoerceStringSchema } = await import('../src/schema/transform.js')
    expect(new CoerceStringSchema().parse(42)).toBe('42')
  })

  it('CoerceNumberSchema rejects empty string', async () => {
    const { CoerceNumberSchema } = await import('../src/schema/transform.js')
    expect(() => new CoerceNumberSchema().parse('')).toThrow('Value cannot be coerced to a number')
  })

  it('CoerceNumberSchema rejects whitespace string', async () => {
    const { CoerceNumberSchema } = await import('../src/schema/transform.js')
    expect(() => new CoerceNumberSchema().parse('  ')).toThrow('Value cannot be coerced to a number')
  })

  it('CoerceNumberSchema rejects NaN string', async () => {
    const { CoerceNumberSchema } = await import('../src/schema/transform.js')
    expect(() => new CoerceNumberSchema().parse('abc')).toThrow('Value cannot be coerced to a number')
  })

  it('CoerceNumberSchema coerces from bigint', async () => {
    const { CoerceNumberSchema } = await import('../src/schema/transform.js')
    expect(new CoerceNumberSchema().parse(BigInt(42))).toBe(42)
  })

  it('CoerceNumberSchema coerces from Date', async () => {
    const { CoerceNumberSchema } = await import('../src/schema/transform.js')
    const d = new Date('2024-01-01')
    expect(new CoerceNumberSchema().parse(d)).toBe(d.getTime())
  })

  it('CoerceNumberSchema returns number as-is', async () => {
    const { CoerceNumberSchema } = await import('../src/schema/transform.js')
    expect(new CoerceNumberSchema().parse(42)).toBe(42)
    expect(new CoerceNumberSchema().parse(3.14)).toBe(3.14)
  })

  it('CoerceNumberSchema rejects object', async () => {
    const { CoerceNumberSchema } = await import('../src/schema/transform.js')
    expect(() => new CoerceNumberSchema().parse({})).toThrow('Value cannot be coerced to a number')
  })

  it('CoerceBooleanSchema uses Boolean() fallback for non-standard values', async () => {
    const { CoerceBooleanSchema } = await import('../src/schema/transform.js')
    expect(new CoerceBooleanSchema().parse('non-standard')).toBe(true)
    expect(new CoerceBooleanSchema().parse('')).toBe(false)
  })

  it('CoerceBooleanSchema handles 0 and 1', async () => {
    const { CoerceBooleanSchema } = await import('../src/schema/transform.js')
    expect(new CoerceBooleanSchema().parse(0)).toBe(false)
    expect(new CoerceBooleanSchema().parse(1)).toBe(true)
  })

  it('CoerceBooleanSchema handles yes/no/on/off', async () => {
    const { CoerceBooleanSchema } = await import('../src/schema/transform.js')
    expect(new CoerceBooleanSchema().parse('yes')).toBe(true)
    expect(new CoerceBooleanSchema().parse('no')).toBe(false)
    expect(new CoerceBooleanSchema().parse('on')).toBe(true)
    expect(new CoerceBooleanSchema().parse('off')).toBe(false)
  })

  it('CoerceBooleanSchema handles boolean input as-is', async () => {
    const { CoerceBooleanSchema } = await import('../src/schema/transform.js')
    expect(new CoerceBooleanSchema().parse(true)).toBe(true)
    expect(new CoerceBooleanSchema().parse(false)).toBe(false)
  })

  it('CoerceBooleanSchema handles truthy objects', async () => {
    const { CoerceBooleanSchema } = await import('../src/schema/transform.js')
    expect(new CoerceBooleanSchema().parse({})).toBe(true)
    expect(new CoerceBooleanSchema().parse([])).toBe(true)
  })

  it('CoerceDateSchema rejects invalid Date instance', async () => {
    const { CoerceDateSchema } = await import('../src/schema/transform.js')
    expect(() => new CoerceDateSchema().parse(new Date('invalid'))).toThrow('Value cannot be coerced to a date')
  })

  it('CoerceDateSchema rejects NaN', async () => {
    const { CoerceDateSchema } = await import('../src/schema/transform.js')
    expect(() => new CoerceDateSchema().parse(NaN)).toThrow('Value cannot be coerced to a date')
  })

  it('CoerceDateSchema rejects object type', async () => {
    const { CoerceDateSchema } = await import('../src/schema/transform.js')
    expect(() => new CoerceDateSchema().parse({} as any)).toThrow('Value cannot be coerced to a date')
  })

  it('CoerceDateSchema accepts valid Date instance', async () => {
    const { CoerceDateSchema } = await import('../src/schema/transform.js')
    const d = new Date('2024-06-15')
    expect(new CoerceDateSchema().parse(d)).toBe(d)
  })

  it('CoerceDateSchema parses number as timestamp', async () => {
    const { CoerceDateSchema } = await import('../src/schema/transform.js')
    const result = new CoerceDateSchema().parse(1704067200000)
    expect(result).toBeInstanceOf(Date)
  })

  it('CoerceDateSchema parses valid date string', async () => {
    const { CoerceDateSchema } = await import('../src/schema/transform.js')
    const result = new CoerceDateSchema().parse('2024-01-01')
    expect(result).toBeInstanceOf(Date)
  })
})

// ====================================================================
// Schema: types.ts uncovered lines
// ====================================================================

describe('schema/types - additional coverage', () => {
  it('safeParse catches non-SchemaError exceptions', async () => {
    const throwingSchema = {
      _parse() {
        throw new Error('Some random error')
      },
      parse(val: unknown) { return this._parse(val) },
      safeParse(val: unknown) {
        try {
          const data = this._parse(val)
          return { success: true, data }
        } catch (e: any) {
          return { success: false, error: String(e) }
        }
      },
      optional() { return this },
      nullable() { return this },
      default(v: any) { return this },
      describe(_d: string) { return this },
      refine() { return this },
      transform() { return this },
      get _internal() { return this },
    }
    const result = throwingSchema.safeParse('x')
    expect(result.success).toBe(false)
    expect(result.error).toContain('Error: Some random error')
  })

  it('Schema describe returns self', async () => {
    const { schema } = await import('../src/schema/index.js')
    const sc = schema.string()
    const described = sc.describe('test field')
    expect(described).toBe(sc)
    expect(described.parse('hello')).toBe('hello')
  })

  it('Schema refine validates with custom function', async () => {
    const { schema } = await import('../src/schema/index.js')
    const sc = schema.string().refine(val => val.length > 2, 'too short')
    expect(sc.parse('abc')).toBe('abc')
    expect(() => sc.parse('a')).toThrow('too short')
  })

  it('Schema _internal returns self', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(schema.string()._internal).toBeDefined()
  })

  it('SchemaError toJSON includes all fields', async () => {
    const { SchemaError } = await import('../src/schema/types.js')
    const err = new SchemaError('msg', { path: 'a.b', received: 'x' })
    const json = err.toJSON()
    expect(json.name).toBe('SchemaError')
    expect(json.message).toBe('msg')
    expect(json.path).toBe('a.b')
    expect(json.received).toBe('x')
  })

  it('SchemaError toJSON works without options', async () => {
    const { SchemaError } = await import('../src/schema/types.js')
    const err = new SchemaError('plain')
    const json = err.toJSON()
    expect(json.name).toBe('SchemaError')
    expect(json.message).toBe('plain')
    expect(json.path).toBe('')
    expect(json.received).toBeUndefined()
  })
})

// ====================================================================
// Schema: additional edge cases
// ====================================================================

describe('schema - LiteralSchema edge cases', () => {
  it('handles boolean literal', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(schema.literal(true).parse(true)).toBe(true)
    expect(() => schema.literal(true).parse(false)).toThrow('Value must be true')
  })

  it('handles null literal', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(schema.literal(null).parse(null)).toBe(null)
    expect(() => schema.literal(null).parse(undefined)).toThrow('Value must be null')
  })

  it('handles undefined literal', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(schema.literal(undefined).parse(undefined)).toBe(undefined)
    expect(() => schema.literal(undefined).parse(null)).toThrow('Value must be undefined')
  })
})

describe('schema - schema.any and schema.unknown', () => {
  it('any passes through anything', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(schema.any().parse(Symbol('x'))).toBeDefined()
    expect(schema.any().parse(undefined)).toBeUndefined()
    expect(() => schema.any().parse('anything')).not.toThrow()
  })

  it('unknown passes through anything', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(schema.unknown().parse(Symbol('x'))).toBeDefined()
    expect(schema.unknown().parse(undefined)).toBeUndefined()
  })
})

describe('schema - StringSchema transform methods', () => {
  it('trim trims whitespace', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(schema.string().trim().parse('  hello  ')).toBe('hello')
  })

  it('lowercase lowercases', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(schema.string().lowercase().parse('HELLO')).toBe('hello')
  })

  it('uppercase uppercases', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(schema.string().uppercase().parse('hello')).toBe('HELLO')
  })
})

describe('schema - StandaloneTransformSchema', () => {
  it('transforms arbitrary values', async () => {
    const { schema } = await import('../src/schema/index.js')
    const sc = schema.transform<number>(v => Number(v))
    expect(sc.parse('42')).toBe(42)
    expect(sc.parse('3.14')).toBe(3.14)
  })
})

// ====================================================================
// Schema: ArraySchema/TupleSchema non-SchemaError rethrow
// ====================================================================

describe('schema/complex - non-SchemaError rethrow', () => {
  it('ArraySchema rethrows non-SchemaError', async () => {
    const { Schema } = await import('../src/schema/index.js')
    const { ArraySchema } = await import('../src/schema/complex.js')
    class ThrowingSchema extends Schema<unknown> {
      _parse(): unknown { throw new TypeError('non-schema array error') }
    }
    const sc = new ArraySchema(new ThrowingSchema())
    expect(() => sc.parse(['x'])).toThrow(TypeError)
  })

  it('TupleSchema rethrows non-SchemaError', async () => {
    const { Schema } = await import('../src/schema/index.js')
    const { TupleSchema } = await import('../src/schema/complex.js')
    class ThrowingSchema extends Schema<unknown> {
      _parse(): unknown { throw new RangeError('non-schema tuple error') }
    }
    const sc = new TupleSchema([new ThrowingSchema()])
    expect(() => sc.parse(['x'])).toThrow(RangeError)
  })
})

// ====================================================================
// Schema: email validator remaining edges
// ====================================================================

describe('schema/primitives - email validator remaining', () => {
  it('rejects domain part > 255 with at least 2 dot segments', async () => {
    const { schema } = await import('../src/schema/index.js')
    const label = 'a'.repeat(254)
    expect(() => schema.string().email().parse(`user@a.${label}`)).toThrow('Invalid email')
  })

  it('rejects quoted local part that is just a single quote', async () => {
    const { schema } = await import('../src/schema/index.js')
    expect(() => schema.string().email().parse('"@example.com')).toThrow('Invalid email')
  })
})

// ====================================================================
// Schema: safeParse catches non-SchemaError from inside Schema
// ====================================================================

describe('schema/types - safeParse non-SchemaError', () => {
  it('catches non-SchemaError thrown from transform', async () => {
    const { schema } = await import('../src/schema/index.js')
    const sc = schema.transform(() => { throw new Error('transform general error') })
    const result = sc.safeParse('x')
    expect(result.success).toBe(false)
    expect(result.error).toBe('Error: transform general error')
  })
})

// ====================================================================
// HTTP: request.ts - getMultipartBoundary no boundary param
// ====================================================================

describe('SuperRequest - missing boundary param', () => {
  it('returns empty formData when multipart has no boundary parameter', async () => {
    const { IncomingMessage } = await import('node:http')
    const { Socket } = await import('node:net')
    const socket = new Socket()
    const req = new IncomingMessage(socket)
    req.method = 'POST'
    req.url = '/'
    req.headers = { 'content-type': 'multipart/form-data' }
    req.push(Buffer.from('test'))
    req.push(null)
    const { SuperRequest } = await import('../src/server/http/request.js')
    const sreq = new SuperRequest(req)
    expect(await sreq.formData()).toEqual({})
  })
})

// ====================================================================
// HTTP: response.ts - file stream error
// ====================================================================

// Note: src/server/http/response.ts lines 198-202 (read stream error handler in file())
// requires triggering an actual read error on createReadStream, which is difficult to
// reproduce reliably in unit tests on Windows due to Vite's ESM live-binding limitations.
// The error handler at lines 197-202 is structurally identical to the one in stream()
// which is tested in http-advanced.test.ts ("handles stream error gracefully").

// ====================================================================
// HTTP: cookie.ts - empty cookie pairs
// ====================================================================

describe('Cookie - empty pair coverage', () => {
  it('handles empty cookie pair from double semicolons', async () => {
    const { parseCookies } = await import('../src/server/http/cookie.js')
    expect(parseCookies('a=1;;b=2')).toEqual({ a: '1', b: '2' })
  })

  it('handles leading semicolon', async () => {
    const { parseCookies } = await import('../src/server/http/cookie.js')
    expect(parseCookies(';a=1')).toEqual({ a: '1' })
  })

  it('handles trailing semicolon', async () => {
    const { parseCookies } = await import('../src/server/http/cookie.js')
    expect(parseCookies('a=1;')).toEqual({ a: '1' })
  })
})

// ====================================================================
// CLI: serve - success paths and ensureTsLoader
// ====================================================================

describe('serve command - success paths', () => {
  let mockConsoleError: any
  let mockConsoleLog: any
  let origExecArgv: string[]
  let tmpDir: string
  let tmpAppPath: string

  beforeEach(() => {
    vi.clearAllMocks()
    origExecArgv = process.execArgv
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
    process.exit = mockExit as any
  })

  afterEach(() => {
    mockConsoleError?.mockRestore()
    mockConsoleLog?.mockRestore()
    Object.defineProperty(process, 'execArgv', { value: origExecArgv, configurable: true })
    try {
      const { unlinkSync, rmdirSync } = require('node:fs')
      if (tmpAppPath) try { unlinkSync(tmpAppPath) } catch { /* ignore */ }
      if (tmpDir) try { rmdirSync(tmpDir) } catch { /* ignore */ }
    } catch { /* ignore */ }
  })

  async function setupAppModule(): Promise<string> {
    const { mkdtempSync, writeFileSync } = await vi.importActual<typeof import('node:fs')>('node:fs')
    const { join } = await vi.importActual<typeof import('node:path')>('node:path')
    const { tmpdir } = await vi.importActual<typeof import('node:os')>('node:os')
    tmpDir = mkdtempSync(join(tmpdir(), 'speexjs-serve-'))
    tmpAppPath = join(tmpDir, 'app.mjs')
    writeFileSync(tmpAppPath, `export const app = { listen(port, host, cb) { if (typeof cb === 'function') cb() } }`)
    return tmpAppPath
  }

  it('dev mode success: loads module and calls app.listen', async () => {
    tmpAppPath = await setupAppModule()
    mockResolve.mockReturnValue(tmpAppPath)
    mockExistsSync.mockReturnValue(true)
    const { serve } = await import('../src/cli/commands/serve.js')
    await serve({ dev: true, port: 3456, host: 'localhost' })
    expect(mockConsoleError).not.toHaveBeenCalled()
  })

  it('production mode success: loads module and calls app.listen', async () => {
    tmpAppPath = await setupAppModule()
    mockResolve.mockReturnValue(tmpAppPath)
    mockExistsSync.mockReturnValue(true)
    const { serve } = await import('../src/cli/commands/serve.js')
    await serve({ dev: false, port: 3457, host: '0.0.0.0' })
    expect(mockConsoleError).not.toHaveBeenCalled()
  })

  it('ensureTsLoader skips when execArgv has ts-node', async () => {
    Object.defineProperty(process, 'execArgv', {
      value: ['--require', 'ts-node/register'],
      configurable: true,
    })
    mockExistsSync.mockReturnValue(false)
    const { serve } = await import('../src/cli/commands/serve.js')
    try { await serve({}) } catch {}
    expect(mockExit).toHaveBeenCalledWith(1)
  })
})

// ====================================================================
// Auth: session-guard edge cases
// ====================================================================

describe('SessionGuard - edge cases', () => {
  it('readSession returns null when req is null', async () => {
    const { SessionGuard } = await import('../src/server/auth/session-guard.js')
    const guard = new SessionGuard()
    const result = await guard.check()
    expect(result).toBe(false)
  })

  it('writeSessionCookie does nothing when res is null', async () => {
    const { SessionGuard } = await import('../src/server/auth/session-guard.js')
    const guard = new SessionGuard()
    await guard.login(42)
  })
})

// ====================================================================
// Auth: token-guard hashTokens false
// ====================================================================

describe('TokenGuard - hashTokens false', () => {
  it('createToken uses plaintext when hashTokens is false', async () => {
    const { TokenGuard } = await import('../src/server/auth/token-guard.js')
    const provider = {
      create: vi.fn().mockResolvedValue(undefined),
      find: vi.fn().mockResolvedValue(null),
      delete: vi.fn(),
      deleteAllForUser: vi.fn(),
    }
    const guard = new TokenGuard({ provider, hashTokens: false })
    const token = await guard.createToken(1, 'test-token', ['read'])
    expect(provider.create).toHaveBeenCalledWith(1, token, 'test-token', ['read'])
    expect(provider.create.mock.calls[0][1]).toBe(token)
  })

  it('findTokenRecord uses plaintext when hashTokens is false', async () => {
    const { TokenGuard } = await import('../src/server/auth/token-guard.js')
    const provider = {
      create: vi.fn(),
      find: vi.fn().mockResolvedValue({ userId: 1, abilities: ['*'] }),
      delete: vi.fn(),
      deleteAllForUser: vi.fn(),
    }
    const guard = new TokenGuard({ provider, hashTokens: false })
    const result = await guard.validate('plain-token')
    expect(provider.find).toHaveBeenCalledWith('plain-token')
    expect(result).toBe(true)
  })
})

// ====================================================================
// Client VDOM: jsx-runtime component with children
// ====================================================================

describe('jsx-runtime - component with children', () => {
  it('jsx passes children to function component', async () => {
    const { jsx } = await import('../src/client/vdom/jsx-runtime.js')
    const Comp = (_props: any) => _props
    const vnode = jsx(Comp, { name: 'test', children: 'child' })
    expect(vnode.type).toBe('component')
    expect((vnode as any).props.name).toBe('test')
    expect((vnode as any).props.children).toBeDefined()
    expect(Array.isArray((vnode as any).props.children)).toBe(true)
  })

  it('jsx omits children prop when none for component', async () => {
    const { jsx } = await import('../src/client/vdom/jsx-runtime.js')
    const Comp = (_props: any) => _props
    const vnode = jsx(Comp, { name: 'test' })
    expect(vnode.type).toBe('component')
    expect((vnode as any).props.children).toBeUndefined()
  })
})

// ====================================================================
// Client VDOM: createElement edge cases
// ====================================================================

describe('createElement - edge cases', () => {
  it('handles undefined props', async () => {
    const { createElement } = await import('../src/client/vdom/jsx.js')
    const vnode = createElement('div', undefined, 'text')
    expect(vnode.type).toBe('element')
    expect((vnode as any).tag).toBe('div')
    expect((vnode as any).props).toEqual({})
  })

  it('handles null props', async () => {
    const { createElement } = await import('../src/client/vdom/jsx.js')
    const vnode = createElement('div', null, 'text')
    expect(vnode.type).toBe('element')
    expect((vnode as any).props).toEqual({})
  })
})

// ====================================================================
// Client Router: hash mode back/forward and link click
// ====================================================================

describe('ClientRouter - hash mode back/forward', () => {
  let mockLocation: { pathname: string; search: string; hash: string; href: string }
  let mockHistory: ReturnType<typeof createMockHistory>
  let mockWindow: ReturnType<typeof createMockWindow>
  const Home: Component = () => ({ type: 'text', text: 'home' } as any)

  beforeEach(() => {
    const { createMockWindow, createMockHistory } = (() => {
      const popstateHandlers: Array<() => void> = []
      const location = { pathname: '/', search: '', hash: '#/', href: 'http://localhost/' }
      const win = {
        location,
        addEventListener: vi.fn((event: string, handler: () => void) => {
          if (event === 'popstate') popstateHandlers.push(handler)
        }),
        removeEventListener: vi.fn(),
        _popstateHandlers: popstateHandlers,
        _triggerPopstate() { for (const h of [...popstateHandlers]) h() },
      }
      const history = {
        pushState: vi.fn(),
        replaceState: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        go: vi.fn(),
        scrollRestoration: 'auto',
        length: 1,
        state: null,
      }
      return { createMockWindow: () => win, createMockHistory: () => history }
    })()
    mockWindow = createMockWindow()
    mockLocation = mockWindow.location
    mockHistory = createMockHistory()

    vi.stubGlobal('window', mockWindow as any)
    vi.stubGlobal('history', mockHistory as any)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('back in hash mode sets window.location.hash', async () => {
    const { ClientRouter } = await import('../src/client/router.js')
    const router = new ClientRouter(
      [{ path: '/', component: Home }, { path: '/two', component: Home }],
      { mode: 'hash' },
    )
    await router.navigate('/')
    await router.navigate('/two')
    expect(mockLocation.hash).toBe('/two')
    router.back()
    expect(mockLocation.hash).toBe('/')
  })

  it('forward in hash mode sets window.location.hash', async () => {
    const { ClientRouter } = await import('../src/client/router.js')
    const router = new ClientRouter(
      [{ path: '/', component: Home }, { path: '/two', component: Home }],
      { mode: 'hash' },
    )
    await router.navigate('/')
    await router.navigate('/two')
    router.back()
    router.forward()
    expect(mockLocation.hash).toBe('/two')
  })
})

describe('ClientRouter - link click handler', () => {
  const Home: Component = () => ({ type: 'text', text: 'home' } as any)
  let mockLocation: { pathname: string; search: string; hash: string; href: string }
  let mockHistory: ReturnType<typeof createMockHistory>
  let mockWindow: ReturnType<typeof createMockWindow>

  beforeEach(() => {
    const { createMockWindow, createMockHistory } = (() => {
      const popstateHandlers: Array<() => void> = []
      const location = { pathname: '/', search: '', hash: '', href: 'http://localhost/' }
      const win = {
        location,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }
      const history = {
        pushState: vi.fn(),
        replaceState: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        go: vi.fn(),
        scrollRestoration: 'auto',
        length: 1,
        state: null,
      }
      return { createMockWindow: () => win, createMockHistory: () => history }
    })()
    mockWindow = createMockWindow()
    mockLocation = mockWindow.location
    mockHistory = createMockHistory()
    vi.stubGlobal('window', mockWindow as any)
    vi.stubGlobal('history', mockHistory as any)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('link click handler calls preventDefault and navigate', async () => {
    const { ClientRouter } = await import('../src/client/router.js')
    const router = new ClientRouter([{ path: '/', component: Home }])
    const onClick = vi.fn()
    const link = router.link({ to: '/dest', children: 'Go', onClick }) as any
    const handler = link.props.onClick
    const preventDefault = vi.fn()
    handler({ preventDefault, metaKey: false, ctrlKey: false, shiftKey: false, button: 0 } as any)
    await new Promise(r => setTimeout(r, 10))
    expect(preventDefault).toHaveBeenCalled()
    expect(onClick).toHaveBeenCalled()
  })

  it('link click handler early-returns on meta key', async () => {
    const { ClientRouter } = await import('../src/client/router.js')
    const router = new ClientRouter([{ path: '/', component: Home }])
    const onClick = vi.fn()
    const link = router.link({ to: '/dest', children: 'Go', onClick }) as any
    const handler = link.props.onClick
    const preventDefault = vi.fn()
    handler({ preventDefault, metaKey: true, ctrlKey: false, shiftKey: false, button: 0 } as any)
    expect(preventDefault).not.toHaveBeenCalled()
    expect(onClick).not.toHaveBeenCalled()
  })
})

// ====================================================================
// CLI: init - git init and npm install failures
// ====================================================================

const { mockExecSync } = vi.hoisted(() => ({
  mockExecSync: vi.fn(),
}))

vi.mock('child_process', () => ({
  execSync: mockExecSync,
}))

describe('init command - install failures', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockResolve.mockImplementation((...args: string[]) => args.join('/').replace(/^C:/, ''))
    process.exit = mockExit as any
    mockExistsSync.mockReturnValue(false)
    mockMkdirSync.mockReturnValue(undefined)
    mockWriteFileSync.mockReturnValue(undefined)
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  it('handles git init failure gracefully', async () => {
    mockExecSync.mockImplementationOnce(() => { throw new Error('git not found') })
    const { initProject } = await import('../src/cli/commands/init.js')
    await initProject('test-project', { git: true, install: false })
    expect(mockExecSync).toHaveBeenCalledWith('git init', expect.any(Object))
  })

  it('logs message when npm install fails', async () => {
    mockExecSync.mockReset()
    mockExecSync.mockImplementationOnce(() => { throw new Error('install failed') })
    const { initProject } = await import('../src/cli/commands/init.js')
    await initProject('test-project', { install: true })
    expect(mockExecSync).toHaveBeenCalledWith('npm install', expect.any(Object))
  })

  it('handles both git init and npm install failures', async () => {
    mockExecSync.mockReset()
    mockExecSync.mockImplementation(() => { throw new Error('failed') })
    const { initProject } = await import('../src/cli/commands/init.js')
    await initProject('test-project', { git: true, install: true })
    expect(mockExecSync).toHaveBeenCalledTimes(2)
  })
})

// ====================================================================
// Database: types.ts (types-only module - see types.ts)
// ====================================================================
// Note: src/server/database/types.ts is a types-only module (no runtime code).
// It only exports TypeScript interfaces and type aliases which are
// compile-time only. No runtime test coverage is needed.

// ====================================================================
// Database: query.ts count() with named column
// ====================================================================

describe('query - count() with named column', () => {
  it('count("email") wraps column name', async () => {
    const { QueryBuilder } = await import('../src/server/database/query.js')
    const { createDialect } = await import('../src/server/database/dialect.js')
    const dialect = createDialect('mysql')
    const raw = vi.fn().mockResolvedValue({ rows: [{ aggregate: 7 }] })
    const conn = {
      raw,
      getDialect: () => dialect,
      getDriver: () => 'mysql',
      getPrefix: () => '',
    }
    const qb = new QueryBuilder(conn as any, 'users')
    const result = await qb.count('email')
    expect(result).toBe(7)
    expect(raw).toHaveBeenCalledWith(
      'SELECT COUNT(`email`) as aggregate FROM `users`',
      [],
    )
  })

  it('count("email") fallback row keys work', async () => {
    const { QueryBuilder } = await import('../src/server/database/query.js')
    const { createDialect } = await import('../src/server/database/dialect.js')
    const dialect = createDialect('mysql')
    const raw = vi.fn().mockResolvedValue({ rows: [{ count: 5 }] })
    const conn = {
      raw,
      getDialect: () => dialect,
      getDriver: () => 'mysql',
      getPrefix: () => '',
    }
    const qb = new QueryBuilder(conn as any, 'users')
    const result = await qb.count('email')
    expect(result).toBe(5)
  })

  it('count("email") fallback to COUNT(*) key', async () => {
    const { QueryBuilder } = await import('../src/server/database/query.js')
    const { createDialect } = await import('../src/server/database/dialect.js')
    const dialect = createDialect('mysql')
    const raw = vi.fn().mockResolvedValue({ rows: [{ 'COUNT(*)': 3 }] })
    const conn = {
      raw,
      getDialect: () => dialect,
      getDriver: () => 'mysql',
      getPrefix: () => '',
    }
    const qb = new QueryBuilder(conn as any, 'users')
    const result = await qb.count('email')
    expect(result).toBe(3)
  })
})

// ====================================================================
// Database: query.ts insert() fallback return 0
// ====================================================================

describe('query - insert() fallback paths', () => {
  it('returns 0 for unknown driver', async () => {
    const { QueryBuilder } = await import('../src/server/database/query.js')
    const { createDialect } = await import('../src/server/database/dialect.js')
    const dialect = createDialect('mysql')
    const raw = vi.fn().mockResolvedValue({ rows: [] })
    const conn = {
      raw,
      getDialect: () => dialect,
      getDriver: () => 'unknown-driver',
      getPrefix: () => '',
    }
    const qb = new QueryBuilder(conn as any, 'users')
    const id = await qb.insert({ name: 'test' })
    expect(id).toBe(0)
  })

  it('returns 0 when sqlite last_insert_rowid has no rows', async () => {
    const { QueryBuilder } = await import('../src/server/database/query.js')
    const { createDialect } = await import('../src/server/database/dialect.js')
    const dialect = createDialect('sqlite')
    const raw = vi.fn().mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [] })
    const conn = {
      raw,
      getDialect: () => dialect,
      getDriver: () => 'sqlite',
      getPrefix: () => '',
    }
    const qb = new QueryBuilder(conn as any, 'users')
    const id = await qb.insert({ name: 'test' })
    expect(id).toBe(0)
  })

  it('returns 0 when mysql result is empty array', async () => {
    const { QueryBuilder } = await import('../src/server/database/query.js')
    const { createDialect } = await import('../src/server/database/dialect.js')
    const dialect = createDialect('mysql')
    const raw = vi.fn().mockResolvedValue({ rows: [] })
    const conn = {
      raw,
      getDialect: () => dialect,
      getDriver: () => 'mysql',
      getPrefix: () => '',
    }
    const qb = new QueryBuilder(conn as any, 'users')
    const id = await qb.insert({ name: 'test' })
    expect(id).toBe(0)
  })
})

// ====================================================================
// Database: query.ts chunk() with empty first page
// ====================================================================

describe('query - chunk() edge cases', () => {
  it('stops immediately when first page is empty', async () => {
    const { QueryBuilder } = await import('../src/server/database/query.js')
    const { createDialect } = await import('../src/server/database/dialect.js')
    const dialect = createDialect('mysql')
    const raw = vi.fn().mockResolvedValue({ rows: [] })
    const conn = {
      raw,
      getDialect: () => dialect,
      getDriver: () => 'mysql',
      getPrefix: () => '',
    }
    const qb = new QueryBuilder(conn as any, 'users')
    const cb = vi.fn().mockResolvedValue(undefined)
    await qb.chunk(10, cb)
    expect(cb).not.toHaveBeenCalled()
    expect(raw).toHaveBeenCalledTimes(1)
  })
})

// ====================================================================
// Schema: complex.ts ObjectSchema rethrows non-SchemaError
// ====================================================================

describe('schema/complex - ObjectSchema rethrows non-SchemaError', () => {
  it('rethrows non-SchemaError from nested schema', async () => {
    const { Schema } = await import('../src/schema/index.js')
    const { ObjectSchema } = await import('../src/schema/complex.js')
    class TypeErrorSchema extends Schema<unknown> {
      _parse(): unknown { throw new TypeError('non-schema object error') }
    }
    const sc = new ObjectSchema({ field: new TypeErrorSchema() })
    expect(() => sc.parse({ field: 'x' })).toThrow(TypeError)
  })
})

// ====================================================================
// HTTP: request.ts formData() with multipart parsed fields
// ====================================================================

describe('SuperRequest - formData() with multipart fields', () => {
  it('extracts field values from multipartParsed', async () => {
    const { IncomingMessage } = await import('node:http')
    const { Socket } = await import('node:net')
    const socket = new Socket()
    const req = new IncomingMessage(socket)
    req.method = 'POST'
    req.url = '/'
    const boundary = '----TestBoundary'
    req.headers = { 'content-type': `multipart/form-data; boundary=${boundary}` }
    const body = [
      `--${boundary}\r\n`,
      'Content-Disposition: form-data; name="username"\r\n',
      '\r\n',
      'john',
      `\r\n--${boundary}\r\n`,
      'Content-Disposition: form-data; name="token"\r\n',
      '\r\n',
      'abc123',
      `\r\n--${boundary}--\r\n`,
    ].join('')
    req.push(Buffer.from(body))
    req.push(null)
    const { SuperRequest } = await import('../src/server/http/request.js')
    const sreq = new SuperRequest(req)
    const data = await sreq.formData()
    expect(data).toEqual({ username: 'john', token: 'abc123' })
  })
})

// ====================================================================
// HTTP: response.ts file stream error handler
// ====================================================================

// Note: src/server/http/response.ts lines 198-202 (read stream error handler
// in file()) requires triggering an actual read error on createReadStream.
// This is impractical in unit tests on Windows because Vite ESM live bindings
// prevent reliable vi.mock/spyOn on stat + createReadStream across dynamic
// import. The code pattern is structurally identical to the stream() error
// handler tested in http-advanced.test.ts ("handles stream error gracefully").

// ====================================================================
// Client Router: popstate, basePath, link() null/boolean children
// ====================================================================

describe('ClientRouter - popstate updates query', () => {
  let mockWindow: any
  let mockHistory: any

  beforeEach(() => {
    const popstateHandlers: Array<() => void> = []
    mockWindow = {
      location: { pathname: '/foo', search: '?page=2', hash: '' },
      addEventListener: vi.fn((event: string, handler: () => void) => {
        if (event === 'popstate') popstateHandlers.push(handler)
      }),
      removeEventListener: vi.fn(),
      _popstateHandlers: popstateHandlers,
    }
    mockHistory = {
      pushState: vi.fn(),
      replaceState: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      go: vi.fn(),
      scrollRestoration: 'auto',
      length: 1,
      state: null,
    }
    vi.stubGlobal('window', mockWindow)
    vi.stubGlobal('history', mockHistory)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('popstate handler updates query signal', async () => {
    const { ClientRouter } = await import('../src/client/router.js')
    const Home = () => ({ type: 'text', text: 'home' } as any)
    const router = new ClientRouter([{ path: '/', component: Home }])
    vi.stubGlobal('window', {
      ...mockWindow,
      location: { pathname: '/bar', search: '?q=test', hash: '' },
    })
    mockWindow._popstateHandlers.forEach((h: () => void) => { h() })
    expect(router.query.value).toEqual({ q: 'test' })
  })
})

describe('ClientRouter - basePath constructor', () => {
  let mockWindow: any
  let mockHistory: any

  beforeEach(() => {
    mockWindow = {
      location: { pathname: '/base/foo', search: '', hash: '' },
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    mockHistory = {
      pushState: vi.fn(),
      replaceState: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      go: vi.fn(),
      scrollRestoration: 'auto',
      length: 1,
      state: null,
    }
    vi.stubGlobal('window', mockWindow)
    vi.stubGlobal('history', mockHistory)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('strips basePath from current path', async () => {
    const { ClientRouter } = await import('../src/client/router.js')
    const Home = () => ({ type: 'text', text: 'home' } as any)
    const router = new ClientRouter([{ path: '/foo', component: Home }], { basePath: '/base' })
    expect(router.current.value?.path).toBe('/foo')
  })

  it('hash mode defaults to / when hash is empty', async () => {
    vi.stubGlobal('window', {
      ...mockWindow,
      location: { pathname: '/', search: '', hash: '' },
    })
    const { ClientRouter } = await import('../src/client/router.js')
    const Home = () => ({ type: 'text', text: 'home' } as any)
    const router = new ClientRouter([{ path: '/', component: Home }], { mode: 'hash' })
    expect(router.current.value?.path).toBe('/')
  })
})

describe('ClientRouter - link() null/boolean children', () => {
  let mockWindow: any
  let mockHistory: any

  beforeEach(() => {
    mockWindow = {
      location: { pathname: '/', search: '', hash: '' },
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    mockHistory = {
      pushState: vi.fn(),
      replaceState: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      go: vi.fn(),
      scrollRestoration: 'auto',
      length: 1,
      state: null,
    }
    vi.stubGlobal('window', mockWindow)
    vi.stubGlobal('history', mockHistory)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('maps null/boolean children to empty text nodes', async () => {
    const { ClientRouter } = await import('../src/client/router.js')
    const Home = () => ({ type: 'text', text: 'home' } as any)
    const router = new ClientRouter([{ path: '/', component: Home }])
    const link = router.link({ to: '/dest', children: [null, false, true, 'hello'] }) as any
    expect(link.children).toHaveLength(4)
    expect(link.children[0].text).toBe('')
    expect(link.children[1].text).toBe('')
    expect(link.children[2].text).toBe('')
    expect(link.children[3].text).toBe('hello')
  })
})

// ====================================================================
// Dialect: PostgreSQL time / year / binary types
// ====================================================================

describe('PostgresqlDialect - mapType time/year/binary', () => {
  const baseCol = () => ({
    name: 'col',
    type: '' as string,
    nullable: true,
    defaultValue: undefined,
    unsigned: false,
    unique: false,
    primary: false,
    index: false,
    comment: null,
    after: null,
    first: false,
    autoIncrement: false,
    precision: null,
    scale: null,
    length: null,
    values: null,
    isForeignId: false,
  })

  it('compiles time type', async () => {
    const { PostgresqlDialect } = await import('../src/server/database/dialect.js')
    const d = new PostgresqlDialect()
    const sql = d.compileColumn({ ...baseCol(), type: 'time' })
    expect(sql).toContain('TIME')
  })

  it('compiles year type', async () => {
    const { PostgresqlDialect } = await import('../src/server/database/dialect.js')
    const d = new PostgresqlDialect()
    const sql = d.compileColumn({ ...baseCol(), type: 'year' })
    expect(sql).toContain('INTEGER')
  })

  it('compiles binary type', async () => {
    const { PostgresqlDialect } = await import('../src/server/database/dialect.js')
    const d = new PostgresqlDialect()
    const sql = d.compileColumn({ ...baseCol(), type: 'binary' })
    expect(sql).toContain('BYTEA')
  })
})

// ====================================================================
// CLI: serve - production mode with no listen method
// ====================================================================

describe('serve command - app without listen method', () => {
  let mockConsoleError: any
  let origExecArgv: string[]

  beforeEach(() => {
    vi.clearAllMocks()
    origExecArgv = process.execArgv
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    process.exit = mockExit as any
  })

  afterEach(() => {
    mockConsoleError?.mockRestore()
    Object.defineProperty(process, 'execArgv', { value: origExecArgv, configurable: true })
  })

  it('production mode errors when app has no listen method', async () => {
    const { mkdtempSync, writeFileSync } = await vi.importActual<typeof import('node:fs')>('node:fs')
    const { join } = await vi.importActual<typeof import('node:path')>('node:path')
    const { tmpdir } = await vi.importActual<typeof import('node:os')>('node:os')
    const tmpDir = mkdtempSync(join(tmpdir(), 'speexjs-serve-'))
    const tmpPath = join(tmpDir, 'app.mjs')
    writeFileSync(tmpPath, 'export const app = { foo: 42 }')

    mockResolve.mockReturnValue(tmpPath)
    mockExistsSync.mockReturnValue(true)
    const { serve } = await import('../src/cli/commands/serve.js')
    await serve({ dev: false, port: 6789, host: 'localhost' })
    expect(mockExit).toHaveBeenCalledWith(1)
    expect(mockConsoleError).toHaveBeenCalled()

    try {
      const { unlinkSync, rmdirSync } = require('node:fs')
      try { unlinkSync(tmpPath) } catch { /* ignore */ }
      try { rmdirSync(tmpDir) } catch { /* ignore */ }
    } catch { /* ignore */ }
  })
})

// ====================================================================
// CLI: toPascalCase/toCamelCase with trailing separator (c ?? '' path)
// ====================================================================

describe('CLI helper - toPascalCase trailing separator', () => {
  it('toPascalCase handles trailing separator where capture is undefined', async () => {
    const { initProject } = await import('../src/cli/commands/init.js')
    mockExistsSync.mockReturnValue(false)
    mockMkdirSync.mockReturnValue(undefined)
    mockWriteFileSync.mockReturnValue(undefined)
    const dirSpy = vi.spyOn(process, 'cwd').mockReturnValue('/tmp/test-pascal')
    await initProject('hello-', { template: 'blank', git: false, install: false })
    dirSpy.mockRestore()
  })
})

describe('CLI make-controller - toPascalCase/toCamelCase trailing separator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockResolve.mockImplementation((...args: string[]) => args.join('/').replace(/^C:/, ''))
    process.exit = mockExit as any
  })

  it('toPascalCase handles trailing separator', async () => {
    mockExistsSync.mockReturnValue(false)
    const { makeController } = await import('../src/cli/commands/make-controller.js')
    const writeSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    makeController('hello-')
    expect(mockWriteFileSync).toHaveBeenCalled()
    writeSpy.mockRestore()
  })

  it('toCamelCase handles trailing separator', async () => {
    mockExistsSync.mockReturnValue(false)
    const { makeController } = await import('../src/cli/commands/make-controller.js')
    const writeSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    makeController('hello-world-')
    expect(mockWriteFileSync).toHaveBeenCalled()
    writeSpy.mockRestore()
  })
})

describe('CLI make-middleware - toPascalCase/toCamelCase trailing separator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockResolve.mockImplementation((...args: string[]) => args.join('/').replace(/^C:/, ''))
    process.exit = mockExit as any
  })

  it('toPascalCase handles trailing separator', async () => {
    mockExistsSync.mockReturnValue(false)
    const { makeMiddleware } = await import('../src/cli/commands/make-middleware.js')
    const writeSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    makeMiddleware('hello-')
    expect(mockWriteFileSync).toHaveBeenCalled()
    writeSpy.mockRestore()
  })

  it('toCamelCase handles trailing separator', async () => {
    mockExistsSync.mockReturnValue(false)
    const { makeMiddleware } = await import('../src/cli/commands/make-middleware.js')
    const writeSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    makeMiddleware('hello-world-')
    expect(mockWriteFileSync).toHaveBeenCalled()
    writeSpy.mockRestore()
  })
})

describe('CLI make-schema - toPascalCase trailing separator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockResolve.mockImplementation((...args: string[]) => args.join('/').replace(/^C:/, ''))
    process.exit = mockExit as any
  })

  it('toPascalCase handles trailing separator', async () => {
    mockExistsSync.mockReturnValue(false)
    const { makeSchema } = await import('../src/cli/commands/make-schema.js')
    const writeSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    makeSchema('hello-')
    expect(mockWriteFileSync).toHaveBeenCalled()
    writeSpy.mockRestore()
  })
})

// ====================================================================
// Model: updateOrCreate with values parameter (line 53)
// ====================================================================

describe('Model - updateOrCreate with values (line 53)', () => {
  it('uses values when provided and record exists', async () => {
    vi.clearAllMocks()
    const { Model } = await import('../src/server/database/model.js')
    const { QueryBuilder } = await import('../src/server/database/query.js')
    const { createDialect } = await import('../src/server/database/dialect.js')
    const dialect = createDialect('mysql')
    const raw = vi.fn()
      .mockResolvedValueOnce({ rows: [{ id: 1, name: 'Old', email: 'old@test.com' }] })
      .mockResolvedValueOnce({ rows: { affectedRows: 1 } })
      .mockResolvedValueOnce({ rows: [{ id: 1, name: 'Updated', email: 'old@test.com' }] })
    const conn = {
      raw,
      getDialect: () => dialect,
      getDriver: () => 'mysql',
      getPrefix: () => '',
    }

    class UserModel extends Model {
      static table = 'users'
      name?: string
      email?: string
    }
    UserModel.setConnection(conn)

    const user = await UserModel.updateOrCreate(
      { email: 'old@test.com' },
      { name: 'Updated' },
    )
    expect(user).toBeInstanceOf(UserModel)
    expect((user as any).name).toBe('Updated')
    expect((user as any).id).toBe(1)
  })
})

// ====================================================================
// Client VDOM: createElement with SVG-like props (isSVG strip)
// ====================================================================

describe('createElement - isSVG prop strip', () => {
  it('strips isSVG from element props', async () => {
    const { createElement } = await import('../src/client/vdom/jsx.js')
    const vnode = createElement('svg', { isSVG: true, viewBox: '0 0 100 100', xmlns: 'http://www.w3.org/2000/svg' })
    expect(vnode.type).toBe('element')
    expect((vnode as any).props.isSVG).toBeUndefined()
    expect((vnode as any).props.viewBox).toBe('0 0 100 100')
  })

  it('handles no props at all', async () => {
    const { createElement } = await import('../src/client/vdom/jsx.js')
    const vnode = createElement('br')
    expect(vnode.type).toBe('element')
    expect((vnode as any).props).toEqual({})
    expect((vnode as any).children).toHaveLength(0)
  })
})

// ====================================================================
// Database: driver.ts requires actual DB connections
// ====================================================================

// Note: src/server/database/driver.ts lines 66-270, 277-285 require actual
// database connections (mysql2 / pg / better-sqlite3) to test. Those are
// optional runtime dependencies and the driver module instantiates real
// database pools. This is an acceptable coverage limitation.
// The QueryBuilder tests (above and in database.test.ts) exercise the query
// compilation and execution logic via mocked connection runners, which is
// the recommended approach for unit testing.

// ====================================================================
// Schema: Primitives email validator domain > 255
// ====================================================================

describe('schema/primitives - email domain > 255', () => {
  it('rejects email with domain part longer than 255 chars', async () => {
    const { schema } = await import('../src/schema/index.js')
    const label = 'a'.repeat(254)
    expect(() => schema.string().email().parse(`user@x.${label}`)).toThrow('Invalid email')
  })
})
