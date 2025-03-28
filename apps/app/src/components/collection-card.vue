<script lang="ts" setup>
import { computed, ref } from 'vue';
import { MoreVertical } from 'lucide-vue-next';
import Dropdown from '@/components/ui/ui-dropdown.vue';
import RemoveCollectionModal from '@/components/modals/remove-collection-modal.vue';
import { useRouter } from 'vue-router';
import CollectionRulesCounter from './collection-rules-counter.vue';

type COLLECTION_ACTIONS_TYPES = 'UPDATE' | 'REMOVE';
const COLLECTION_ACTIONS = {
  UPDATE: 'UPDATE',
  REMOVE: 'REMOVE',
} as const as Record<COLLECTION_ACTIONS_TYPES, COLLECTION_ACTIONS_TYPES>;

const router = useRouter();

const props = defineProps<{
  collection: {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    rulesCount?: number;
  };
}>();

const isRemoveModalOpen = ref(false);

const formattedDate = computed(() => {
  if (!props.collection.createdAt) return '';
  return new Date(props.collection.createdAt).toLocaleDateString();
});

const dropdownOptions = Object.values(COLLECTION_ACTIONS).map(action => ({
  id: action,
  label: `${action[0]}${action.substring(1, action.length)}`,
  value: action,
}));

const onDropdownChange = (action: string) => {
  switch (action) {
    case COLLECTION_ACTIONS.REMOVE:
      onOpenRemoveModal();
      break;
    // Update functionality will be implemented later
    default:
      break;
  }
};

const onOpenRemoveModal = () => {
  isRemoveModalOpen.value = true;
};

const onCloseRemoveModal = () => {
  isRemoveModalOpen.value = false;
};

const onClickCollectionCard = () => {
  router.push(`/collections/${props.collection.id}`);
};
</script>

<template>
  <article @click="onClickCollectionCard" class="collection-card">
    <div class="collection-card__header">
      <h3 class="title">{{ collection.name }}</h3>

      <div class="dropdown-wrapper" @click.stop>
        <Dropdown :options="dropdownOptions" @change="onDropdownChange">
          <template #trigger>
            <div class="dropdown-icon">
              <MoreVertical :size="15" />
            </div>
          </template>
        </Dropdown>
      </div>
    </div>

    <footer class="collection-card__footer">
      <div class="collection-card__metadata">
        <p class="collection-card__date">{{ formattedDate }}</p>
        <CollectionRulesCounter :collectionId="collection.id" />
      </div>
    </footer>
  </article>

  <RemoveCollectionModal
    :isOpen="isRemoveModalOpen"
    :collectionId="collection.id"
    @close="onCloseRemoveModal" />
</template>

<style lang="scss" scoped>
.collection-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 150px;
  padding: 16px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background-color: transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 8px;

    .title {
      font-size: var(--font-md);
      font-weight: 600;
      color: var(--text-light);
      margin: 0;
    }

    .dropdown-icon {
      margin-right: -5px;
    }
  }

  &__footer {
    margin-top: auto;
  }

  &__metadata {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
  }

  &__date {
    font-size: var(--font-xs);
    color: var(--text-muted);
    margin: 0;
  }

  &:hover {
    border-color: var(--border-hover);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}

.dropdown-wrapper {
  position: relative;
}

.dropdown-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: var(--text-muted);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--background-hover);
    color: var(--text-light);
  }
}

:deep(.dropdown) {
  position: static;
}

:deep(.dropdown__content) {
  position: absolute;
  top: 30px;
  right: -100px;
  left: auto;
  width: 120px;
  z-index: 50;
}
</style>
