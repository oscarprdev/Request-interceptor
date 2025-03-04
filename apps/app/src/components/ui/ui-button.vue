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
  const classes = ['ui-button'];

  if (props.primary) classes.push('btn-primary');
  else if (props.secondary) classes.push('btn-secondary');
  else classes.push('btn-default');

  if (props.size === 'small') classes.push('btn-small');
  else if (props.size === 'large') classes.push('btn-large');
  else classes.push('btn-medium');

  if (props.fullWidth) classes.push('btn-full-width');
  if (props.disabled) classes.push('btn-disabled');

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

<style>
.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.btn-primary {
  background-color: var(--accent);
  color: var(--accent-foreground);
  border: none;
}

.btn-primary:hover:not(.btn-disabled) {
  background-color: var(--accent-foreground);
  color: var(--accent);
}

.btn-secondary {
  background-color: var(--background);
  color: var(--background-foreground);
  border: 1px solid var(--border);
}

.btn-secondary:hover:not(.btn-disabled) {
  background-color: var(--background-foreground);
  color: var(--background);
}

.btn-default {
  background-color: transparent;
  color: var(--background-foreground);
  border: 1px solid var(--border);
}

.btn-default:hover:not(.btn-disabled) {
  background-color: rgba(255, 255, 255, 0.1);
}

.btn-small {
  padding: 6px 12px;
  font-size: 0.875rem;
}

.btn-medium {
  padding: 10px 20px;
  font-size: 1rem;
}

.btn-large {
  padding: 12px 24px;
  font-size: 1.125rem;
}

.btn-full-width {
  width: 100%;
}

.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
