<script setup lang="ts">
import { ref } from 'vue';
import Modal from './ui/ui-modal.vue';
import type { ReviewRuleModalProps, ReviewRuleModalEmits } from './review-rule-modal.types';

defineProps<ReviewRuleModalProps>();
const emit = defineEmits<ReviewRuleModalEmits>();

const isOpen = ref(true);

const handleClose = () => {
  isOpen.value = false;
  emit('close');
};
</script>

<template>
  <Modal
    v-if="rule"
    size="large"
    title="Rule"
    :isOpen="isOpen"
    :closeOnEscape="true"
    :closeOnClickOutside="true"
    @close="handleClose">
    <section class="rule__details">
      <div class="rule__row">
        <span class="rule__label">URL Filter:</span>
        <span class="rule__value">{{ rule.urlFilter }}</span>
      </div>
      <div class="rule__row">
        <span class="rule__label">Methods:</span>
        <span class="rule__value">{{ rule.requestMethods.join(', ') }}</span>
      </div>
      <div class="rule__row">
        <span class="rule__label">Resource Types:</span>
        <span class="rule__value">{{ rule.resourceTypes.join(', ') }}</span>
      </div>
      <div class="rule__row">
        <span class="rule__label">Priority:</span>
        <span class="rule__value">{{ rule.priority }}</span>
      </div>
      <div class="rule__row">
        <span class="rule__label">Created:</span>
        <span class="rule__value">{{ new Date(rule.createdAt).toLocaleString() }}</span>
      </div>
    </section>

    <h3 class="rule__heading">Response Data</h3>
    <pre class="rule__response">{{ rule.response }}</pre>
  </Modal>
</template>

<style lang="scss">
.rule {
  &__details {
    margin-bottom: 20px;
    padding: 15px;
    background-color: var(--background);
    border-radius: 6px;
    border-left: 4px solid var(--accent);
  }

  &__row {
    margin-bottom: 8px;
    display: flex;
  }

  &__label {
    font-weight: 600;
    min-width: 120px;
    color: var(--background-foreground);
  }

  &__value {
    flex: 1;
  }

  &__response {
    background-color: var(--background);
    padding: 15px;
    border-radius: 6px;
    overflow-x: auto;
    font-family: monospace;
    white-space: pre-wrap;
    border: 1px solid var(--border);
  }

  &__heading {
    margin-top: 20px;
    margin-bottom: 10px;
    color: var(--background-foreground);
  }
}
</style>
