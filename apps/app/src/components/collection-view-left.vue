<script lang="ts" setup>
import { useRulesStore } from '@/stores/rules';
import RuleListHeader from './rule-list-header.vue';
import RuleListItem from './rule-list-item.vue';
import { useQuery } from '@tanstack/vue-query';
import { collectionsQueries } from '@/services/queries/collections-queries';
import type { Rule } from '@/models/Rule';
import { watch } from 'vue';
import { mapRuleToApplication } from '@/utils/mappers';

const props = defineProps<{
  collectionId: string | string[];
}>();

const rulesStore = useRulesStore();
const QUERY_KEY = 'rules';
const { data, isLoading, error } = useQuery({
  queryKey: [QUERY_KEY, props.collectionId],
  queryFn: () =>
    collectionsQueries.getRulesByCollectionId({ collectionId: props.collectionId as string }),
});

watch(
  () => data.value?.data,
  (data?: Rule[]) => {
    console.log(data);
    if (data && data.length > 0) {
      rulesStore.setRules(data.map(mapRuleToApplication));
      rulesStore.setSelectedRule(data[0].id);
    }
  }
);
</script>

<template>
  <div class="collection-view__left">
    <RuleListHeader :collection-id="collectionId" :rules-length="rulesStore.rules.length" />
    <div class="loading" v-if="isLoading">Loading...</div>
    <div class="error" v-else-if="error">Error: {{ error }}</div>
    <div class="no-rules" v-else-if="rulesStore.rules.length === 0">No rules found</div>
    <ul v-else class="rules">
      <RuleListItem v-for="rule in rulesStore.rules" :key="rule.id" :rule="rule" />
    </ul>
  </div>
</template>

<style lang="scss">
.collection-view__left {
  display: flex;
  flex-direction: column;
  width: 25%;
  max-width: 300px;
  min-width: 200px;
  height: 100%;
  border-right: 1px solid var(--border);

  .rules {
    list-style: none;
    padding: 0;
    margin: 0;
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
