<script lang="ts" setup>
import { useRoute } from 'vue-router';
import Button from '@/components/ui/ui-button.vue';
import { useRulesStore } from '@/stores/rules';
import { useQuery } from '@tanstack/vue-query';
import { collectionsQueries } from '@/services/queries/collections-queries';
import { watch } from 'vue';
import type { Rule, RuleApplication } from '@/models/Rule';
import { mapRuleToApplication } from '@/utils/mappers';
import { Plus } from 'lucide-vue-next';

const route = useRoute();
const collectionId = route.params.id;

const rulesStore = useRulesStore();
const QUERY_KEY = 'rules';
const { data, isLoading, error } = useQuery({
  queryKey: [QUERY_KEY, collectionId],
  queryFn: () =>
    collectionsQueries.getRulesByCollectionId({ collectionId: collectionId as string }),
});

const onAddRule = () => {
  rulesStore.addRule({
    id: crypto.randomUUID(),
    urlFilter: 'default',
    requestMethods: ['GET'],
    priority: 0,
    resourceTypes: [],
    actionType: 'block',
    isEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    response: {
      type: 'block',
      body: 'Blocked by default rule',
    },
  });
};

const onSelectRule = (rule: RuleApplication) => {
  rulesStore.setSelectedRule(rule);
};

watch(
  () => data.value?.data,
  (data?: Rule[]) => {
    if (data && data.length > 0) {
      rulesStore.setRules(data.map(mapRuleToApplication));
    }
  }
);
</script>

<template>
  <section class="collection-view">
    <div class="collection-view__left">
      <div class="rules-header">
        <h3 class="title">Rules: {{ rulesStore.rules.length }}</h3>
        <Button variant="ghost" class="add-rule-button" @click="onAddRule"
          ><Plus class="add-rule-button__icon"
        /></Button>
      </div>

      <div class="loading" v-if="isLoading">Loading...</div>
      <div class="error" v-else-if="error">Error: {{ error }}</div>
      <div class="no-rules" v-else-if="rulesStore.rules.length === 0">No rules found</div>
      <ul v-else class="rules">
        <li class="rule" v-for="rule in rulesStore.rules" :key="rule.id">
          <button class="rule-button" @click="onSelectRule(rule)">
            <div class="rule-methods">{{ rule.requestMethods.join(', ') }}</div>
            <div class="rule-title">{{ rule.urlFilter }}</div>
          </button>
        </li>
      </ul>
    </div>
    <div class="collection-view__right"></div>
  </section>
</template>

<style scoped lang="scss">
.collection-view {
  display: flex;
  width: 100%;
  height: 100%;

  &__left {
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

    .rules {
      list-style: none;
      padding: 0;
      margin: 0;

      .rule {
        display: flex;
        justify-content: space-between;
        align-items: center;

        border-bottom: 1px solid var(--border);

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
            font-size: var(--font-sm);
            font-weight: 600;
          }

          .rule-methods {
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

  &__right {
    width: 100%;
    height: 100%;
  }
}
</style>
