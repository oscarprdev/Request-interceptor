<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getRules, deleteRule, toggleRule } from '../services/ruleService'
import type { Rule } from '../types/rule'
import RuleItem from './RuleItem.vue'

const rules = ref<Rule[]>([])
const loading = ref(true)

onMounted(async () => {
  await loadRules()
})

const loadRules = async () => {
  loading.value = true
  rules.value = await getRules()
  loading.value = false
}

const handleDelete = async (ruleId: string) => {
  if (confirm('Are you sure you want to delete this rule?')) {
    await deleteRule(ruleId)
    await loadRules()
  }
}

const handleToggle = async (rule: Rule) => {
  await toggleRule(rule)
  await loadRules()
}
</script>

<template>
  <div class="rule-list">
    <div v-if="loading" class="loading">
      Loading rules...
    </div>
    <div v-else-if="rules.length === 0" class="empty-state">
      <p>You don't have any rules yet.</p>
      <p>Click "Add Rule" to create your first rule.</p>
    </div>
    <div v-else>
      <RuleItem 
        v-for="rule in rules" 
        :key="rule.id" 
        :rule="rule"
        @delete="handleDelete"
        @toggle="handleToggle"
      />
    </div>
  </div>
</template> 