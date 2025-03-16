<script lang="ts" setup>
import { computed } from 'vue';
import Modal from '@/components/ui/ui-modal.vue';
import Button from '@/components/ui/ui-button.vue';
import { useDeleteRule } from '@/composables/use-delete-rule';
import type { RemoveRuleModalProps, RemoveRuleModalEmits } from './remove-rule-modal.types';

const props = defineProps<RemoveRuleModalProps>();
const emit = defineEmits<RemoveRuleModalEmits>();

const { deleteRule, isDeleting } = useDeleteRule();

const onClose = () => {
  emit('close');
};

const onDelete = () => {
  if (props.ruleId) {
    deleteRule(props.ruleId);
    onClose();
  }
};

const buttonText = computed(() => {
  return isDeleting.value ? 'Deleting...' : 'Delete Rule';
});
</script>

<template>
  <Modal v-if="isOpen" title="Delete Rule" size="small" :is-open="isOpen" @close="onClose">
    <div class="remove-rule-modal">
      <p class="remove-rule-modal__message">
        Are you sure you want to delete this rule? This action cannot be undone.
      </p>

      <div class="remove-rule-modal__actions">
        <Button variant="ghost" @click="onClose">Cancel</Button>
        <Button variant="destructive" :disabled="isDeleting" @click="onDelete">
          {{ buttonText }}
        </Button>
      </div>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>
.remove-rule-modal {
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
