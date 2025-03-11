<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { MODAL_SIZES, type ModalProps, type ModalEmits } from './ui-modal.types';

const props = defineProps<ModalProps>();
const emit = defineEmits<ModalEmits>();

const dialogRef = ref<HTMLDialogElement | null>(null);

const handleClose = () => {
  if (dialogRef.value) {
    dialogRef.value.close();
    emit('close');
  }
};

const modalSize = computed(() => {
  switch (props.size) {
    case MODAL_SIZES.small:
      return 'modal--small';
    case MODAL_SIZES.large:
      return 'modal--large';
    case MODAL_SIZES.full:
      return 'modal--full';
    default:
      return 'modal--medium';
  }
});

watch(
  () => props.isOpen,
  isOpen => {
    if (isOpen && dialogRef.value && !dialogRef.value.open) {
      dialogRef.value.showModal();
    } else if (!isOpen && dialogRef.value && dialogRef.value.open) {
      dialogRef.value.close();
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (props.isOpen && dialogRef.value && !dialogRef.value.open) {
    dialogRef.value.showModal();
  }
});
</script>

<template>
  <dialog ref="dialogRef" :class="['modal', modalSize]">
    <div class="modal__content">
      <div class="modal__header">
        <h2 class="modal__title">
          {{ title.charAt(0).toUpperCase() + title.slice(1).toLowerCase() }}
        </h2>
        <button class="modal__close" @click="handleClose">×</button>
      </div>

      <div class="modal__body">
        <slot></slot>
      </div>

      <div v-if="$slots.footer" class="modal__footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </dialog>
</template>

<style scoped lang="scss">
.modal {
  padding: 0;
  border: none;
  border-radius: var(--radius);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  background-color: var(--background);
  color: var(--background-foreground);
  margin: auto;

  &::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(1px);
  }

  &--small {
    width: 400px;
    max-width: 90%;
    max-height: 80vh;
  }

  &--medium {
    width: 600px;
    max-width: 90%;
    max-height: 80vh;
  }

  &--large {
    width: 800px;
    max-width: 90%;
    max-height: 90vh;
  }

  &--full {
    width: 95%;
    height: 95%;
    max-width: none;
    max-height: none;
  }

  &__content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
  }

  &__title {
    margin: 0;
    font-size: var(--font-md);
    color: var(--background-foreground);
  }

  &__close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--background-foreground);
    opacity: 0.7;

    &:hover {
      opacity: 1;
    }
  }

  &__body {
    padding: 20px;
    overflow-y: auto;
    flex: 1;
  }

  &__footer {
    padding: 16px 20px;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style>
