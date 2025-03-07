<script setup lang="ts">
import { computed } from 'vue';
import type { CheckboxProps, CheckboxEmits } from './ui-checkbox.types';

const props = defineProps<CheckboxProps>();
const emit = defineEmits<CheckboxEmits>();

const checkboxId = computed(
  () => props.id || `checkbox-${props.name || Math.random().toString(36).substring(2, 9)}`
);

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
  emit('change', target.checked);
};
</script>

<template>
  <div class="checkbox">
    <div class="checkbox__container">
      <input
        type="checkbox"
        class="checkbox__input"
        :id="checkboxId"
        :name="name"
        :checked="modelValue"
        :disabled="disabled"
        @change="handleChange" />
      <label v-if="label" :for="checkboxId" class="checkbox__label">
        {{ label }}
      </label>
    </div>
  </div>
</template>

<style scoped lang="scss">
.checkbox {
  display: inline-block;

  &__container {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  &__input {
    appearance: none;
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border: 1px solid var(--border);
    border-radius: 4px;
    background-color: var(--background);
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease;

    &:checked {
      background-color: var(--accent);
      border-color: var(--accent);

      &::after {
        content: '';
        position: absolute;
        left: 5px;
        top: 2px;
        width: 6px;
        height: 10px;
        border: solid var(--accent-foreground);
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }
    }

    &:indeterminate {
      background-color: var(--accent);
      border-color: var(--accent);

      &::after {
        content: '';
        position: absolute;
        left: 3px;
        top: 7px;
        width: 10px;
        height: 2px;
        background-color: var(--accent-foreground);
      }
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(var(--accent-rgb), 0.2);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__label {
    margin-left: 8px;
    font-size: 1rem;
    color: var(--background-foreground);
    cursor: pointer;
  }
}
</style>
