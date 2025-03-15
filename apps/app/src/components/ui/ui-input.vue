<script setup lang="ts">
import { computed } from 'vue';
import { type InputProps, type InputEmits } from './ui-input.types';

const props = defineProps<InputProps>();
const emit = defineEmits<InputEmits>();

const inputId = computed(
  () => props.id || `input-${props.name || Math.random().toString(36).substring(2, 9)}`
);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <div class="input">
    <label :for="inputId" class="input__label">
      {{ label }}
      <span v-if="required" class="input__required">*</span>
    </label>

    <input
      :id="inputId"
      :name="name"
      :type="type || 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :class="['input__field', { 'input__field--error': error }]"
      @input="handleInput" />

    <p v-if="error" class="input__error">{{ error }}</p>
    <p v-else-if="helpText" class="input__help">{{ helpText }}</p>
  </div>
</template>

<style scoped lang="scss">
.input {
  margin-bottom: 16px;
  width: 100%;

  &__label {
    display: block;
    margin-bottom: 6px;
    font-weight: 500;
    color: var(--text-muted);
    font-size: var(--font-md);
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
    color: var(--text-muted);
    font-size: 1rem;
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
      font-size: var(--font-md);

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
    font-size: var(--font-sm);
    color: var(--destructive);
  }

  &__help {
    margin-top: 4px;
    font-size: 0.875rem;
    color: var(--text-muted);
  }
}
</style>
