<script setup lang="ts">
import type { Collection } from '@/models/Collection';
import { formatPgDate } from '@/utils/dates';
import { Library, Clock } from 'lucide-vue-next';

defineProps<{
  collection: Collection;
}>();
</script>

<template>
  <a :href="`/collections/${collection.id}`" class="collection">
    <div class="collection__header">
      <Library class="collection__header-icon" />
      <h2>{{ collection.name }}</h2>
    </div>
    <div class="collection__time">
      <Clock class="collection__time-icon" />
      {{ formatPgDate(collection.updatedAt) }}
    </div>
  </a>
</template>

<style scoped lang="scss">
.collection {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px;
  height: 200px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    border-color: var(--border-hover);
    background-color: var(--background-hover);
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: var(--font-sm);
    color: var(--accent);

    &-icon {
      width: 32px;
      height: 32px;
      padding: 5px;
      border: 1px solid var(--border);
    }
  }

  &__description {
    margin-top: 10px;
    margin-bottom: auto;
    font-size: var(--font-sm);
    color: var(--text-muted);
  }

  &__time {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
    font-size: var(--font-sm);
    color: var(--text-muted);

    &-icon {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
