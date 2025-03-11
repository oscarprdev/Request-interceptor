<script setup lang="ts">
import type { RuleApplication } from '@/models/Rule';
import Badge from './ui/ui-badge.vue';
import { BADGE_VARIANTS } from './ui/ui-badge.types';
import { useRulesStore } from '@/stores/rules';

defineProps<{
  rule: RuleApplication;
}>();

const rulesStore = useRulesStore();

const onSelectRule = (ruleId: string) => {
  rulesStore.setSelectedRule(ruleId);
};

const BADGE_MAP = {
  GET: BADGE_VARIANTS.primary,
  POST: BADGE_VARIANTS.secondary,
  PUT: BADGE_VARIANTS.tertiary,
  DELETE: BADGE_VARIANTS.destructive,
};
</script>

<template>
  <li :class="['rule', { 'rule--selected': rulesStore.selectedRule?.id === rule.id }]">
    <button class="rule-button" @click="onSelectRule(rule.id)">
      <div class="rule-methods">
        <Badge
          v-for="method in rule.requestMethods"
          :label="method"
          :key="method"
          :variant="BADGE_MAP[method as keyof typeof BADGE_MAP]"></Badge>
      </div>
      <div class="rule-title">{{ rule.urlFilter }}</div>
    </button>
  </li>
</template>

<style lang="scss">
.rule {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 2px solid transparent;
  border-bottom: 1px solid var(--border);

  &--selected {
    border-left: 2px solid var(--accent);
  }

  .rule-button {
    width: 100%;
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 15px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: var(--text);

    &:hover {
      background-color: var(--background-hover);
    }

    .rule-title {
      max-width: 150px;
      font-size: var(--font-md);
      font-weight: 600;
      text-transform: capitalize;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .rule-methods {
      display: flex;
      gap: 5px;
      font-size: var(--font-xs);
    }
  }
}
</style>
