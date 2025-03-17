<script setup lang="ts">
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { collectionsQueries } from '@/services/queries/collections-queries';
import CollectionCard from '@/components/collection-card.vue';
import { Plus } from 'lucide-vue-next';
import AddCollectionModal from '@/components/modals/add-collection-modal.vue';
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { toast } from 'vue-sonner';

const queryClient = useQueryClient();
const userStore = useUserStore();
const QUERY_KEY = 'collections';

const isAddCollectionModalOpen = ref(false);

const { data, isLoading, error } = useQuery({
  queryKey: [QUERY_KEY],
  queryFn: () => {
    if (!userStore.userToken) {
      toast.error('User token is not set');
      return [];
    }
    return collectionsQueries.getCollections(userStore.userToken);
  },
  enabled: !!userStore.userToken,
});

const onAddCollection = () => {
  isAddCollectionModalOpen.value = true;
};

const onCloseAddCollectionModal = () => {
  isAddCollectionModalOpen.value = false;
  queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
};
</script>

<template>
  <p v-if="isLoading">Loading...</p>
  <p v-if="error">Error: {{ error }}</p>
  <section v-if="!isLoading && !error" class="collections">
    <button class="collections__add-button" @click="onAddCollection">
      <Plus class="collections__add-icon" />
      Add Collection
    </button>
    <CollectionCard v-for="collection in data" :key="collection.id" :collection="collection" />
  </section>
  <AddCollectionModal :is-open="isAddCollectionModalOpen" @close="onCloseAddCollectionModal" />
</template>

<style scoped lang="scss">
.collections {
  background-color: var(--background);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  padding: 30px;

  &__add-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 150px;
    gap: 10px;
    padding: 10px;
    border-radius: var(--radius);
    border: 1px solid var(--border);
    background-color: var(--background);
    color: var(--text-muted);
    font-size: var(--font-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &-icon {
      width: 20px;
      height: 20px;
    }

    &:hover {
      background-color: var(--background-hover);
      border-color: var(--border-hover);
    }
  }
}
</style>
