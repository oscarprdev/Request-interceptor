<script lang="ts" setup>
import { useRoute } from 'vue-router';
import RulesList from '@/components/rules-list.vue';
import RuleViewer from '@/components/rule-viewer.vue';

const route = useRoute();
const collectionId = route.params.id;
</script>

<template>
  <section class="collection-view">
    <RulesList :collection-id="collectionId" />
    <RuleViewer />
  </section>
</template>

<style scoped lang="scss">
.collection-view {
  background-color: var(--background);
  display: flex;
  width: 100%;
  height: 100%;
}
</style>
