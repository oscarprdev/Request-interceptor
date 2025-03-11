<script lang="ts" setup>
import type { RuleApplication } from '@/models/Rule';
import { useRulesStore } from '@/stores/rules';

const emit = defineEmits<{
  (e: 'update-rule', rule: RuleApplication): void;
}>();

const rulesStore = useRulesStore();

const onSubmit = () => {
  if (rulesStore.selectedRule) {
    emit('update-rule', { ...rulesStore.selectedRule, requestMethods: ['POST'] });
  }
};
</script>
<template>
  <div class="rule-settings">
    <button @click="onSubmit">try</button>
  </div>
</template>

<style lang="scss">
.rule-settings {
  width: 50%;
  height: 100%;
  border-right: 1px solid var(--border);
}
</style>
