# Summary

SpeexJS — Fullstack TypeScript framework.

| Subpath | Contents |
|---------|-----|
| `speexjs` | Main barrel (schema, server, client, rpc) |
| `speexjs/server` | SuperApp, Router, Middleware, Controller, Container, Engine |
| `speexjs/server/http` | SuperRequest, SuperResponse, Headers, Cookies, Status |
| `speexjs/server/router` | Route groups, resource routes, named routes |
| `speexjs/server/middleware` | CORS, Auth, CSRF, Throttle, Session, Logger, etc |
| `speexjs/server/controller` | Base Controller + decorators |
| `speexjs/server/auth` | SessionGuard, TokenGuard, AuthManager |
| `speexjs/server/gate` | Gate authorization, policies |
| `speexjs/server/database` | QueryBuilder, Migrations, Pagination, Seeder |
| `speexjs/server/cache` | Cache system (memory/file) |
| `speexjs/server/storage` | File storage multi-disk |
| `speexjs/server/events` | EventEmitter + wildcard |
| `speexjs/client` | Signals, VDOM, JSX, SSR, ClientRouter |
| `speexjs/client/signals` | signal, computed, effect |
| `speexjs/client/vdom` | h, render, patch, hydrate, renderToString |
| `speexjs/rpc` | Type-safe RPC server & client |
| `speexjs/schema` | 25+ schema types for validation |
