<script setup lang="ts">
import { computed } from 'vue';
import {
  BUTTON_VARIANTS,
  BUTTON_SIZES,
  BUTTON_TYPES,
  type ButtonProps,
  type ButtonEmits,
} from './ui-button.types';

const props = defineProps<ButtonProps>();
const emit = defineEmits<ButtonEmits>();

const buttonVariants = computed(() => {
  if (props.variant === BUTTON_VARIANTS.secondary) return 'button--secondary';
  else if (props.variant === BUTTON_VARIANTS.destructive) return 'button--destructive';
  else if (props.variant === BUTTON_VARIANTS.ghost) return 'button--ghost';
  else return 'button--primary';
});

const buttonSizes = computed(() => {
  if (props.size === BUTTON_SIZES.small) return 'button--small';
  else if (props.size === BUTTON_SIZES.large) return 'button--large';
  else return 'button--medium';
});

const buttonTypes = computed(() => {
  if (props.type === BUTTON_TYPES.submit) return 'button--submit';
  else if (props.type === BUTTON_TYPES.reset) return 'button--reset';
  else return 'button--button';
});

const buttonDisabled = computed(() => {
  if (props.disabled) return 'button--disabled';
  else return '';
});

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>

<template>
  <button
    :class="['button', buttonVariants, buttonSizes, buttonTypes, buttonDisabled]"
    :type="type || 'button'"
    :disabled="disabled"
    @click="handleClick">
    <slot />
  </button>
</template>

<style scoped lang="scss">
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;

  &--primary {
    background-color: var(--accent-muted);
    border: 1px solid var(--accent);
    color: var(--accent);

    &:hover:not(.button--disabled) {
      background-color: var(--accent);
      color: var(--text-light);
      border: 1px solid var(--accent-muted);
    }
  }

  &--secondary {
    background-color: var(--background-foreground);
    color: var(--background);
    border: 1px solid var(--border);

    &:hover:not(.button--disabled) {
      background-color: var(--background);
      color: var(--text-light);
    }
  }

  &--destructive {
    background-color: var(--destructive-foreground);
    color: var(--destructive);
    border: 1px solid var(--destructive);

    &:hover:not(.button--disabled) {
      background-color: var(--destructive-foreground-muted);
      color: var(--text-light);
    }
  }

  &--ghost {
    background-color: transparent;
    color: var(--text-muted);
    border: none;

    &:hover:not(.button--disabled) {
      background-color: var(--background-foreground-muted);
      color: var(--text-light);
    }
  }

  &--small {
    padding: 6px 12px;
    font-size: 0.875rem;
  }

  &--medium {
    padding: 10px 20px;
    font-size: 1rem;
  }

  &--large {
    padding: 12px 24px;
    font-size: 1.125rem;
  }

  &--full-width {
    width: 100%;
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
