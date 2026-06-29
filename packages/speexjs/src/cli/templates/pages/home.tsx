import type { VNode } from 'speexjs/client/vdom'

interface HomeProps {
  title?: string
  name?: string
}

export default function Home({ title, name }: HomeProps): VNode {
  return (
    <div style="padding: 2rem; font-family: sans-serif; text-align: center;">
      <h1>{title ?? 'Welcome to SpeexJS'}</h1>
      <p>Hello {name ?? 'Guest'}! Your server is running.</p>
      <p style="color: #666; margin-top: 2rem;">
        Built with SpeexJS — Zero dependencies fullstack framework
      </p>
    </div>
  )
}
