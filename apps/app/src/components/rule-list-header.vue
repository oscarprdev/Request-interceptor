<script lang="ts" setup>
import type { RuleApplication } from '@/models/Rule';
import { useRulesStore } from '@/stores/rules';
import { Plus } from 'lucide-vue-next';
import Button from '@/components/ui/ui-button.vue';

defineProps<{
  rulesLength: number;
}>();

const DEFAULT_RULE: RuleApplication = {
  id: crypto.randomUUID(),
  urlFilter: 'default',
  requestMethods: ['GET'],
  priority: 1,
  resourceTypes: ['xmlhttprequest'],
  actionType: 'block',
  isEnabled: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  response: {
    type: 'block',
    body: 'Blocked by default rule',
  },
};

const rulesStore = useRulesStore();

const onAddRule = () => {
  rulesStore.addRule(DEFAULT_RULE);
};
</script>

<template>
  <div class="rules-header">
    <h3 class="title">Rules: {{ rulesLength }}</h3>
    <Button variant="ghost" class="add-rule-button" @click="onAddRule"
      ><Plus class="add-rule-button__icon"
    /></Button>
  </div>
</template>

<style lang="scss">
.rules-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border);
  padding: 0;
  margin: 0;

  .title {
    font-size: var(--font-sm);
    font-weight: 600;
    padding-left: 15px;
  }

  .add-rule-button {
    width: fit-content;
    border-left: 1px solid var(--border);
    margin: 0;
    border-radius: 0;

    &__icon {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
