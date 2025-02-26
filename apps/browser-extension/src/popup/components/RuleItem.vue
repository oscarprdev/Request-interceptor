<script setup lang="ts">
import { computed } from 'vue'
import type { Rule } from '../types/rule'

const props = defineProps<{
  rule: Rule
}>()

const emit = defineEmits<{
  (e: 'delete', id: string): void
  (e: 'toggle', rule: Rule): void
}>()

const statusClass = computed(() => ({
  'rule-item': true,
  'disabled': !props.rule.enabled
}))

const toggleLabel = computed(() => 
  props.rule.enabled ? 'Enabled' : 'Disabled'
)

const toggleClass = computed(() => ({
  'toggle': true,
  'toggle-on': props.rule.enabled,
  'toggle-off': !props.rule.enabled
}))

const ruleTypeLabel = computed(() => 
  props.rule.type === 'request' ? 'Request Modification' : 'Response Modification'
)

const actionTypeLabel = computed(() => 
  props.rule.action === 'static' ? 'Static Value' : 'Custom Function'
)
</script>

<template>
  <div :class="statusClass">
    <div class="rule-header">
      <h3>{{ rule.name }}</h3>
      <div class="rule-actions">
        <button 
          :class="toggleClass"
          @click="emit('toggle', rule)"
        >
          {{ toggleLabel }}
        </button>
        <button 
          class="delete"
          @click="emit('delete', rule.id)"
        >
          Delete
        </button>
      </div>
    </div>
    <div class="rule-details">
      <p><strong>Type:</strong> {{ ruleTypeLabel }}</p>
      <p><strong>URL Pattern:</strong> {{ rule.matches.join(', ') }}</p>
      <p><strong>Action:</strong> {{ actionTypeLabel }}</p>
    </div>
  </div>
</template> 