<script lang="ts" setup>
import { useCreateRule } from '@/composables/use-create-rule';
import Button from '@/components/ui/ui-button.vue';
import Badge from '@/components/ui/ui-badge.vue';
import type { Rule } from '@/models/Rule';
import { rulesQueries } from '@/services/queries/rules-queries';
import { useRulesStore } from '@/stores/rules';
import { mapRuleToApplication } from '@/utils/mappers';
import { useQuery } from '@tanstack/vue-query';
import { watch } from 'vue';
import { BADGE_VARIANTS } from './ui/ui-badge.types';
import { useUserStore } from '@/stores/user';

const props = defineProps<{
  collectionId: string | string[];
}>();

const METHOD_BADGE_MAP = {
  GET: BADGE_VARIANTS.primary,
  POST: BADGE_VARIANTS.secondary,
  PUT: BADGE_VARIANTS.tertiary,
  DELETE: BADGE_VARIANTS.destructive,
};

const userStore = useUserStore();
const rulesStore = useRulesStore();
const { action } = useCreateRule({ collectionId: props.collectionId as string });
const query = useQuery({
  queryKey: ['rules', props.collectionId],
  queryFn: async () => {
    if (!userStore.userToken) {
      return {
        data: [],
        limit: 0,
        page: 0,
        total: 0,
        totalPages: 0,
      };
    }

    return await rulesQueries.getRulesByCollectionId({
      userId: userStore.userToken,
      collectionId: props.collectionId as string,
    });
  },
});
const { data: rules, isLoading, error } = query;

const onAddRule = () =>
  action({
    id: crypto.randomUUID(),
    title: `Rule #${rulesStore.rules.length + 1}`,
    urlFilter: 'http://example.com',
    requestMethods: ['GET'],
    priority: rulesStore.rules.length + 1,
    isEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    response: {
      type: 'block',
      body: 'Blocked by default rule',
    },
  });

const onSelectRule = (ruleId: string) => {
  rulesStore.setSelectedRule(ruleId);
};

watch(
  () => rules.value?.data,
  (rules?: Rule[]) => {
    if (rules && rules.length > 0) {
      rulesStore.setRules(rules.map(mapRuleToApplication));
      if (!rulesStore.selectedRule || rules.length === 1) {
        rulesStore.setSelectedRule(rules[0].id);
      }
    }
  }
);
</script>

<template>
  <div class="rules-list">
    <div class="rules-header">
      <h3 class="title">Rules: {{ rules?.data.length }}</h3>
      <Button variant="primary" class="add-rule-button" @click="onAddRule">New rule</Button>
    </div>
    <div class="loading" v-if="isLoading">Loading...</div>
    <div class="error" v-else-if="error">Error: {{ error }}</div>
    <div class="no-rules" v-else-if="rulesStore.rules.length === 0">No rules found</div>
    <ul v-else class="rules">
      <li
        v-for="rule in rulesStore.rules"
        :key="rule.id"
        :id="`rule-${rule.id}`"
        :class="['rule', { 'rule--selected': rulesStore.selectedRule?.id === rule.id }]">
        <button class="rule-button" @click="onSelectRule(rule.id)">
          <div class="rule-methods">
            <Badge
              v-for="method in rule.requestMethods"
              :label="method"
              :key="method"
              :variant="METHOD_BADGE_MAP[method as keyof typeof METHOD_BADGE_MAP]"></Badge>
          </div>
          <div class="rule-title">{{ rule.title }}</div>
        </button>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
.rules-list {
  display: flex;
  flex-direction: column;
  width: 25%;
  max-width: 300px;
  min-width: 200px;
  height: 100%;
  border-right: 1px solid var(--border);

  .rules-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border);
    height: var(--rule-header);
    padding: 0;
    margin: 0;

    .title {
      font-size: var(--font-sm);
      font-weight: 600;
      padding-left: 15px;
    }

    .add-rule-button {
      width: fit-content;
      font-weight: 600;
      margin: 0;
      border-radius: 0;

      &__icon {
        width: 20px;
        height: 20px;
      }
    }
  }

  .rules {
    list-style: none;
    padding: 0;
    margin: 0;

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
  }

  .loading {
    text-align: center;
    margin-top: 10px;
    font-size: var(--font-sm);
  }

  .error {
    text-align: center;
    margin-top: 10px;
    font-size: var(--font-sm);
    color: var(--destructive);
  }

  .no-rules {
    text-align: center;
    margin-top: 10px;
    font-size: var(--font-sm);
    color: var(--text-muted);
  }
}
</style>
