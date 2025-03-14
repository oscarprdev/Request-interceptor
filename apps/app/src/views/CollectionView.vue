<script lang="ts" setup>
import { useRoute } from 'vue-router';
import CollectionViewRight from '@/components/collection-view-right.vue';
import RulesList from '@/components/rules-list.vue';

const route = useRoute();
const collectionId = route.params.id;
</script>

<template>
  <section class="collection-view">
    <RulesList :collection-id="collectionId" />
    <CollectionViewRight />
  </section>
</template>

<style scoped lang="scss">
.collection-view {
  display: flex;
  width: 100%;
  height: 100%;
}
</style>
