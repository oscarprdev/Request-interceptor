<script lang="ts" setup>
import { rulesCollectionsQueries } from '@/services/queries/rules-collections-queries';
import { onMounted, ref } from 'vue';

const props = defineProps<{ collectionId: string }>();

const rulesCount = ref(0);

onMounted(async () => {
  rulesCount.value = await rulesCollectionsQueries.countRulesByCollection(props.collectionId);
});
</script>

<template>
  <p class="rules-count">{{ rulesCount }} rules</p>
</template>

<style lang="scss">
.rules-count {
  font-size: var(--font-xs);
  color: var(--text-muted);
  margin: 0;
}
</style>
