<script setup lang="ts">
import { computed } from 'vue';
import { BADGE_VARIANTS, type BadgeProps } from './ui-badge.types';

const props = defineProps<BadgeProps>();

const badgeVariants = computed(() => {
  if (props.variant === BADGE_VARIANTS.primary) {
    return 'badge-get';
  } else if (props.variant === BADGE_VARIANTS.secondary) {
    return 'badge-post';
  } else if (props.variant === BADGE_VARIANTS.tertiary) {
    return 'badge-put';
  } else if (props.variant === BADGE_VARIANTS.destructive) {
    return 'badge-delete';
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
}
</style>
