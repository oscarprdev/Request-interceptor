<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';
import Button from './ui-button.vue';

const props = defineProps<{
  title: string;
  isOpen: boolean;
  size?: 'small' | 'medium' | 'large' | 'full';
}>();

const emit = defineEmits<{
  close: [];
  afterOpen: [];
  afterClose: [];
}>();

const dialogRef = ref<HTMLDialogElement | null>(null);

const handleClose = () => {
  if (dialogRef.value) {
    dialogRef.value.close();
    emit('close');
    emit('afterClose');
  }
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    handleClose();
  }
};

const handleClickOutside = (e: MouseEvent) => {
  if (dialogRef.value && e.target === dialogRef.value) {
    handleClose();
  }
};

const getModalSizeClass = () => {
  switch (props.size) {
    case 'small':
      return 'modal-small';
    case 'large':
      return 'modal-large';
    case 'full':
      return 'modal-full';
    default:
      return 'modal-medium';
  }
};

watch(
  () => props.isOpen,
  isOpen => {
    if (isOpen && dialogRef.value && !dialogRef.value.open) {
      dialogRef.value.showModal();
      emit('afterOpen');
    } else if (!isOpen && dialogRef.value && dialogRef.value.open) {
      dialogRef.value.close();
      emit('afterClose');
    }
  },
  { immediate: true }
);

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);

  if (props.isOpen && dialogRef.value && !dialogRef.value.open) {
    dialogRef.value.showModal();
    emit('afterOpen');
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <dialog ref="dialogRef" class="ui-modal" :class="getModalSizeClass()" @click="handleClickOutside">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">{{ title }}</h2>
        <button class="close-btn" @click="handleClose">x</button>
      </div>

      <div class="modal-body">
        <slot></slot>
      </div>

      <div class="modal-footer">
        <Button secondary @click="handleClose">Close</Button>
      </div>
    </div>
  </dialog>
</template>

<style>
.ui-modal {
  padding: 0;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  background-color: var(--background);
  color: var(--background-foreground);
  margin: auto;
}

.ui-modal::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
}

.modal-small {
  width: 400px;
  max-width: 90%;
  max-height: 80vh;
}

.modal-medium {
  width: 600px;
  max-width: 90%;
  max-height: 80vh;
}

.modal-large {
  width: 800px;
  max-width: 90%;
  max-height: 90vh;
}

.modal-full {
  width: 95%;
  height: 95%;
  max-width: none;
  max-height: none;
}

.modal-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
  color: var(--background-foreground);
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--background-foreground);
  opacity: 0.7;
}

.close-btn:hover {
  opacity: 1;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
