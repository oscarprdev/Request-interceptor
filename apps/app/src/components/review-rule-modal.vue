<script setup lang="ts">
import { ref } from 'vue';
import type { RuleApplication } from '../models/Rule';
import Modal from './ui/ui-modal.vue';

defineProps<{
  rule: RuleApplication | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const isOpen = ref(true);

const handleClose = () => {
  isOpen.value = false;
  emit('close');
};
</script>

<template>
  <Modal
    v-if="rule"
    :title="'Rule Response: ' + rule.urlFilter"
    :isOpen="isOpen"
    size="large"
    :closeOnEscape="true"
    :closeOnClickOutside="true"
    @close="handleClose">
    <section class="rule-details">
      <div class="detail-row">
        <span class="detail-label">URL Filter:</span>
        <span class="detail-value">{{ rule.urlFilter }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Methods:</span>
        <span class="detail-value">{{ rule.requestMethods.join(', ') }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Resource Types:</span>
        <span class="detail-value">{{ rule.resourceTypes.join(', ') }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Priority:</span>
        <span class="detail-value">{{ rule.priority }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Created:</span>
        <span class="detail-value">{{ new Date(rule.createdAt).toLocaleString() }}</span>
      </div>
    </section>

    <h3>Response Data</h3>
    <pre class="response-code">{{ rule.response }}</pre>
  </Modal>
</template>

<style>
.rule-details {
  margin-bottom: 20px;
  padding: 15px;
  background-color: var(--background);
  border-radius: 6px;
  border-left: 4px solid var(--accent);
}

.detail-row {
  margin-bottom: 8px;
  display: flex;
}

.detail-label {
  font-weight: 600;
  min-width: 120px;
  color: var(--background-foreground);
}

.detail-value {
  flex: 1;
}

.response-code {
  background-color: var(--background);
  padding: 15px;
  border-radius: 6px;
  overflow-x: auto;
  font-family: monospace;
  white-space: pre-wrap;
  border: 1px solid var(--border);
}

h3 {
  margin-top: 20px;
  margin-bottom: 10px;
  color: var(--background-foreground);
}
</style>
