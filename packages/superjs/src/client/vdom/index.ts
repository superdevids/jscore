import { Signal, Computed, effect, untracked } from '../signals/index.js'

export type VNode = VElement | VText | VFragment | VComponent | VSignalNode

export interface VElement {
  type: 'element'
  tag: string
  props: Record<string, any>
  children: VNode[]
  key?: string
}

export interface VText {
  type: 'text'
  text: string
}

export interface VFragment {
  type: 'fragment'
  children: VNode[]
}

export interface VComponent {
  type: 'component'
  component: Component
  props: Record<string, any>
  children?: VNode[]
}

export interface VSignalNode {
  type: 'signal'
  signal: Signal<VNode>
}

export interface Component {
  (props: Record<string, any>, context?: ComponentContext): VNode | Promise<VNode>
}

export interface ComponentContext {
  signal: typeof signal
  computed: typeof computed
  effect: typeof effect
  props: Record<string, any>
  children?: VNode[]
}

const VOID_ELEMENTS = new Set([
  'area','base','br','col','embed','hr','img','input','link','meta',
  'param','source','track','wbr',
])

function isSignal(val: unknown): val is Signal<any> {
  return val instanceof Signal
}

