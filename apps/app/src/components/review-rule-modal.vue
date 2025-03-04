<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { RuleApplication } from '../models/Rule';
import Button from './ui/button.vue';

const props = defineProps<{
  rule: RuleApplication | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const dialogRef = ref<HTMLDialogElement | null>(null);

const handleClose = () => {
  if (dialogRef.value) {
    dialogRef.value.close();
  }
  emit('close');
};

onMounted(() => {
  if (props.rule && dialogRef.value) {
    dialogRef.value.showModal();
  }
});
</script>

<template>
  <dialog ref="dialogRef" class="rule-modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Rule Response</h2>
        <button class="close-btn" @click="handleClose">&times;</button>
      </div>

      <div class="modal-body" v-if="rule">
        <div class="rule-details">
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
        </div>

        <h3>Response Data</h3>
        <pre class="response-code">{{ JSON.stringify(rule.response, null, 2) }}</pre>
      </div>

      <div class="modal-footer">
        <Button secondary @click="handleClose">Close</Button>
      </div>
    </div>
  </dialog>
</template>

<style>
.rule-modal {
  padding: 0;
  border: none;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  background-color: var(--background);
  color: var(--background-foreground);
}

.rule-modal::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
  filter: blur(15px);
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
  border-bottom: 1px solid var(--border, #eee);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--background-foreground, #333);
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--background-foreground, #666);
}

.close-btn:hover {
  color: var(--background-foreground, #333);
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.rule-details {
  margin-bottom: 20px;
  padding: 15px;
  background-color: var(--background, #f8f9fa);
  border-radius: 6px;
  border-left: 4px solid var(--accent, #2196f3);
}

.detail-row {
  margin-bottom: 8px;
  display: flex;
}

.detail-label {
  font-weight: 600;
  min-width: 120px;
  color: var(--background-foreground, #555);
}

.detail-value {
  flex: 1;
}

.response-code {
  background-color: var(--background, #f5f5f5);
  padding: 15px;
  border-radius: 6px;
  overflow-x: auto;
  font-family: monospace;
  white-space: pre-wrap;
  border: 1px solid var(--border, #ddd);
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border, #eee);
  display: flex;
  justify-content: flex-end;
}
</style>
