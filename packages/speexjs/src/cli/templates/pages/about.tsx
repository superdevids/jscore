import type { VNode } from 'speexjs/client/vdom'

interface AboutProps {
  version?: string
}

export default function About({ version }: AboutProps): VNode {
  return (
    <div style="padding: 2rem; font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>About SpeexJS</h1>
      <p>Version: {version ?? '0.6.x'}</p>
      <ul>
        <li>Zero dependencies</li>
        <li>Fullstack TypeScript</li>
        <li>1,849 tests passing</li>
        <li>96.9% code coverage</li>
      </ul>
      <a href="/" style="color: #0066cc;">Back to Home</a>
    </div>
  )
}
