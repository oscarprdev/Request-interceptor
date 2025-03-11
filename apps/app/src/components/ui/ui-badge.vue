<script setup lang="ts">
import { computed } from 'vue';
import { BADGE_VARIANTS, type BadgeProps } from './ui-badge.types';

const props = defineProps<BadgeProps>();

const badgeVariants = computed(() => {
  if (props.variant === BADGE_VARIANTS.primary) {
    return 'badge--primary';
  } else if (props.variant === BADGE_VARIANTS.secondary) {
    return 'badge--secondary';
  } else if (props.variant === BADGE_VARIANTS.tertiary) {
    return 'badge--tertiary';
  } else if (props.variant === BADGE_VARIANTS.destructive) {
    return 'badge--destructive';
  } else {
    return 'badge--default';
  }
});
</script>

<template>
  <span :class="['badge', badgeVariants]">{{ label }}</span>
</template>

<style scoped lang="scss">
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 0.4rem;
  font-weight: 800;
  font-size: 0.6rem;
  border-radius: calc(var(--radius) * 2);

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

  &--tertiary {
    background-color: var(--badge-3-foreground);
    color: var(--badge-3);
    border: 1px solid var(--badge-3);
  }

  &--destructive {
    background-color: var(--destructive-foreground);
    color: var(--destructive);
    border: 1px solid var(--destructive-foreground);
  }
}
</style>
