<script lang="ts" setup>
import { computed } from 'vue';
import Modal from '@/components/ui/ui-modal.vue';
import Button from '@/components/ui/ui-button.vue';
import { useDeleteCollection } from '@/composables/use-delete-collection';
import {
  type RemoveCollectionModalProps,
  type RemoveCollectionModalEmits,
} from './remove-collection-modal.types';

const props = defineProps<RemoveCollectionModalProps>();
const emit = defineEmits<RemoveCollectionModalEmits>();

const { deleteCollection, isDeleting } = useDeleteCollection();

const handleClose = () => {
  emit('close');
};

const handleDelete = () => {
  if (props.collectionId) {
    deleteCollection(props.collectionId);
    emit('success');
    handleClose();
  }
};

const buttonText = computed(() => {
  return isDeleting.value ? 'Deleting...' : 'Delete Collection';
});
</script>

<template>
  <Modal v-if="isOpen" title="Delete Collection" size="small" :isOpen="isOpen" @close="handleClose">
    <div class="remove-collection-modal">
      <p class="remove-collection-modal__message">
        Are you sure you want to delete this collection? All rules in this collection will also be
        deleted. This action cannot be undone.
      </p>

      <div class="remove-collection-modal__actions">
        <Button variant="ghost" @click="handleClose">Cancel</Button>
        <Button variant="destructive" :disabled="isDeleting" @click="handleDelete">
          {{ buttonText }}
        </Button>
      </div>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>
.remove-collection-modal {
  display: flex;
  flex-direction: column;

  &__message {
    margin-bottom: 20px;
    color: var(--text-muted);
    line-height: 1.5;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style>
