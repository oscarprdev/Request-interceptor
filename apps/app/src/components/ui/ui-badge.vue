<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  variant?: 'default' | 'primary' | 'secondary' | 'destructive';
  label: string;
}>();

const badgeClass = computed(() => {
  const classes = ['badge'];

  if (props.variant === 'primary') {
    classes.push('badge--primary');
  } else if (props.variant === 'secondary') {
    classes.push('badge--secondary');
  } else if (props.variant === 'destructive') {
    classes.push('badge--destructive');
  } else {
    classes.push('badge--default');
  }

  return classes.join(' ');
});
</script>

<template>
  <span :class="badgeClass">{{ label }}</span>
</template>

<style scoped lang="scss">
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.1rem 0.4rem;
  font-weight: 800;
  font-size: 0.6rem;
  border-radius: 2rem;

  &--default {
    background-color: var(--accent-muted);
    color: var(--accent);
    border: 1px solid var(--accent);
  }

  &--primary {
    background-color: var(--badge-1-foreground);
    color: var(--badge-1);
    border: 1px solid var(--badge-1);
  }

  &--secondary {
    background-color: var(--badge-2-foreground);
    color: var(--badge-2);
    border: 1px solid var(--badge-2);
  }

  &--destructive {
    background-color: var(--destructive-foreground);
    color: var(--destructive);
    border: 1px solid var(--destructive-foreground);
  }
}
</style>
