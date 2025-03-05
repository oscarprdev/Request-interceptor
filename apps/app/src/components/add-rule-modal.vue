<script setup lang="ts">
import { ref } from 'vue';
import Modal from './ui/ui-modal.vue';
import AddRuleForm from './add-rule-form.vue';
import Button from './ui/ui-button.vue';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
  success: [ruleId: number];
}>();

const formRef = ref<InstanceType<typeof AddRuleForm> | null>(null);
const formError = ref('');
const isSubmitting = ref(false);

const handleSuccess = (ruleId: number) => {
  emit('success', ruleId);
  emit('close');
};

const handleError = (error: string) => {
  formError.value = error;
};

const handleSubmitting = (submitting: boolean) => {
  isSubmitting.value = submitting;
};

const handleClose = () => {
  formError.value = '';
  emit('close');
};

const handleSubmit = async () => {
  if (formRef.value) {
    await formRef.value.submitForm();
  }
};
</script>

<template>
  <Modal v-if="isOpen" title="Add New Rule" :isOpen="isOpen" size="large" @close="handleClose">
    <div v-if="formError" class="add-rule-modal__error">
      <p>{{ formError }}</p>
    </div>

    <AddRuleForm
      ref="formRef"
      @success="handleSuccess"
      @error="handleError"
      @submitting="handleSubmitting" />

    <template #footer>
      <div class="add-rule-modal__footer">
        <Button secondary @click="handleClose" :disabled="isSubmitting">Cancel</Button>
        <Button primary @click="handleSubmit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Saving...' : 'Save Rule' }}
        </Button>
      </div>
    </template>
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

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}
</style>
