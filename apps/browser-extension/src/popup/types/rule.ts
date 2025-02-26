export type RuleType = 'request' | 'response'
export type ActionType = 'static' | 'function'

export interface Rule {
  id: string
  name: string
  type: RuleType
  matches: string[]
  pattern?: string
  action: ActionType
  value: string
  enabled: boolean
  createdAt?: string
}

export interface RuleFormData {
  name: string
  type: RuleType
  pattern: string
  action: ActionType
  value: string
} 