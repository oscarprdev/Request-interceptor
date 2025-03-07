<script setup lang="ts">
import { computed } from 'vue';
import { type TextareaProps, type TextareaEmits } from './ui-textarea.types';

const props = defineProps<TextareaProps>();
const emit = defineEmits<TextareaEmits>();

const textareaId = computed(
  () => props.id || `textarea-${props.name || Math.random().toString(36).substring(2, 9)}`
);

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
  emit('update', target.value);
};
</script>

<template>
  <div class="textarea">
    <label :for="textareaId" class="textarea__label">
      {{ label }}
      <span v-if="required" class="textarea__required">*</span>
    </label>

    <textarea
      :id="textareaId"
      :name="name"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :rows="rows || 5"
      :maxlength="maxLength"
      class="textarea__field"
      :class="{ 'textarea__field--error': error }"
      @input="handleInput"></textarea>

    <p v-if="error" class="textarea__error">{{ error }}</p>
    <p v-else-if="helpText" class="textarea__help">{{ helpText }}</p>
  </div>
</template>

<style scoped lang="scss">
.textarea {
  margin-bottom: 16px;
  width: 100%;

  &__label {
    display: block;
    margin-bottom: 6px;
    font-weight: 500;
    color: var(--background-foreground);
  }

  &__required {
    color: var(--destructive);
    margin-left: 4px;
  }

  &__field {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background-color: var(--background);
    color: var(--background-foreground);
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;
    min-height: 100px;
    transition:
      border-color 0.2s,
      box-shadow 0.2s;

    &:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 2px rgba(var(--accent-rgb), 0.2);
    }

    &--error {
      border-color: var(--destructive);

      &:focus {
        box-shadow: 0 0 0 2px rgba(var(--destructive-rgb), 0.2);
      }
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__error {
    margin-top: 4px;
    font-size: 0.875rem;
    color: var(--destructive);
  }

  &__help {
    margin-top: 4px;
    font-size: 0.875rem;
    color: var(--background-foreground-muted);
  }
}
</style>
