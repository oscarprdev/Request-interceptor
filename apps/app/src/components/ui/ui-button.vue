<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  primary?: boolean;
  secondary?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}>();

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const buttonClass = computed(() => {
  const classes = ['button'];

  if (props.secondary) classes.push('button--secondary');
  else classes.push('button--primary');

  if (props.size === 'small') classes.push('button--small');
  else if (props.size === 'large') classes.push('button--large');
  else classes.push('button--medium');

  if (props.fullWidth) classes.push('button--full-width');
  if (props.disabled) classes.push('button--disabled');

  return classes.join(' ');
});

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>

<template>
  <button :class="buttonClass" :type="type || 'button'" :disabled="disabled" @click="handleClick">
    <slot></slot>
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
    background-color: var(--accent);
    color: var(--accent-foreground);
    border: none;

    &:hover:not(.button--disabled) {
      background-color: var(--accent-muted);
      color: var(--accent-foreground);
    }
  }

  &--secondary {
    background-color: var(--background);
    color: var(--background-foreground);
    border: 1px solid var(--border);

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
