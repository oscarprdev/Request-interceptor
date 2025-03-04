<script setup lang="ts">
import { ref } from 'vue';
import Modal from './ui/ui-modal.vue';
import AddRuleForm from './add-rule-form.vue';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
  success: [ruleId: number];
}>();

const formError = ref('');

const handleSuccess = (ruleId: number) => {
  emit('success', ruleId);
  emit('close');
};

const handleError = (error: string) => {
  formError.value = error;
};

const handleClose = () => {
  formError.value = '';
  emit('close');
};
</script>

<template>
  <Modal v-if="isOpen" title="Add New Rule" :isOpen="isOpen" size="large" @close="handleClose">
    <div v-if="formError" class="add-rule-modal__error">
      <p>{{ formError }}</p>
    </div>

    <AddRuleForm @success="handleSuccess" @error="handleError" />
  </Modal>
</template>

<style scoped lang="scss">
.add-rule-modal {
  &__error {
    margin-bottom: 16px;
    padding: 12px;
    background-color: var(--destructive);
    color: white;
    border-radius: var(--radius);
  }
}
</style>
