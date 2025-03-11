<script lang="ts" setup>
import { useRoute } from 'vue-router';
import Button from '@/components/ui/ui-button.vue';
import { useRulesStore } from '@/stores/rules';
import { useQuery } from '@tanstack/vue-query';
import { collectionsQueries } from '@/services/queries/collections-queries';
import { onMounted } from 'vue';

const route = useRoute();
const collectionId = route.params.id;

const rulesStore = useRulesStore();
const QUERY_KEY = 'rules';
const { data, isLoading, error } = useQuery({
  queryKey: [QUERY_KEY, collectionId],
  queryFn: () =>
    collectionsQueries.getRulesByCollectionId({ collectionId: collectionId as string }),
});

const addRule = () => {
  rulesStore.addRule({ id: crypto.randomUUID(), name: 'Default Rule', method: 'GET' });
};

onMounted(() => {
  if (data.value && data.value.data.length > 0) {
    const rules = data.value.data.map(rule => ({
      id: rule.id,
      name: rule.urlFilter,
      method: rule.actionType,
    }));
    rulesStore.setRules(rules);
  }
});
</script>

<template>
  <section class="collection-view">
    <div class="collection-view__left">
      <Button variant="ghost" class="collection-view__add-rule-button" @click="addRule"
        >Add Rule</Button
      >
      <div class="collection-view__loading" v-if="isLoading">Loading...</div>
      <div class="collection-view__error" v-else-if="error">Error: {{ error }}</div>
      <div class="collection-view__no-rules" v-else-if="data?.data.length === 0">
        No rules found
      </div>
      <ul v-else class="collection-view__rules">
        <li v-for="rule in rulesStore.rules" :key="rule.id">
          <div class="collection-view__rule-name">{{ rule.name }}</div>
          <div class="collection-view__rule-method">{{ rule.method }}</div>
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

  &__add-rule-button {
    width: 100%;
    border-bottom: 1px solid var(--border);
  }

  &__left {
    display: flex;
    flex-direction: column;
    width: 25%;
    max-width: 300px;
    min-width: 200px;
    height: 100%;
    border-right: 1px solid var(--border);
  }

  &__right {
    width: 100%;
    height: 100%;
  }

  &__loading {
    text-align: center;
    margin-top: 10px;
    font-size: var(--font-sm);
  }

  &__error {
    text-align: center;
    margin-top: 10px;
    font-size: var(--font-sm);
    color: var(--destructive);
  }

  &__no-rules {
    text-align: center;
    margin-top: 10px;
    font-size: var(--font-sm);
    color: var(--text-muted);
  }
}
</style>
