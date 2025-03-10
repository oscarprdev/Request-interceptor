<script setup lang="ts">
import type { CollectionApplication } from '@/models/Collection';
import { collectionsService } from '@/services/collections-service';
import { onMounted, ref } from 'vue';
import Button from './ui/ui-button.vue';
import AddCollectionModal from './modals/add-collection-modal.vue';
import CollectionRuleAside from './collection-rules-aside.vue';

const collections = ref<CollectionApplication[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

const addCollectionModal = ref<boolean>(false);

const fetchCollections = async () => {
  isLoading.value = true;
  error.value = null;

  const [errorResponse, collectionsResponse] = await collectionsService.getCollections();
  if (errorResponse || !collectionsResponse) {
    error.value = errorResponse?.message || 'Failed to fetch collections';
  } else {
    collections.value = collectionsResponse;
  }

  isLoading.value = false;
};

const openAddCollectionModal = () => {
  addCollectionModal.value = true;
};

const onAddCollectionModalClose = async () => {
  addCollectionModal.value = false;
  await fetchCollections();
};

onMounted(async () => {
  await fetchCollections();
});
</script>

<template>
  <aside class="collections-aside">
    <div class="collections-aside__header">
      <h1>Requestick</h1>
    </div>
    <Button variant="primary" @click="openAddCollectionModal">Create Collection</Button>
    <section class="collections-aside__content">
      <div v-if="collections.length === 0">
        <p>No collections found</p>
      </div>
      <div v-else-if="isLoading">
        <p>Loading...</p>
      </div>
      <div v-else>
        <CollectionRuleAside
          v-for="collection in collections"
          :key="collection.id"
          :collection-id="collection.id"
          :collection-name="collection.name" />
      </div>
    </section>
  </aside>
  <AddCollectionModal
    v-if="addCollectionModal"
    :isOpen="addCollectionModal"
    @close="onAddCollectionModalClose" />
</template>

<style lang="scss">
.collections-aside {
  width: 20vw;
  min-width: 250px;
  max-width: 350px;
  height: 100%;
  padding: 0 1rem;
  background-color: var(--background);
  border-right: 1px solid var(--border);

  display: flex;
  flex-direction: column;

  &__header {
    padding: 1rem;
    font-size: 0.8rem;
  }

  &__content {
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
