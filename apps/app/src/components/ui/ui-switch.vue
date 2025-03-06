<script setup lang="ts">
import { computed } from 'vue';
import { SWITCH_SIZES, SWITCH_COLORS, type SwitchProps, type SwitchEmits } from './ui-switch.types';

const props = defineProps<SwitchProps>();
const emit = defineEmits<SwitchEmits>();

const switchId = computed(
  () => props.id || `switch-${props.name || Math.random().toString(36).substring(2, 9)}`
);

const switchSize = computed(() => {
  if (props.size === SWITCH_SIZES.small) return 'switch__toggle--small';
  else if (props.size === SWITCH_SIZES.large) return 'switch__toggle--large';
  else return 'switch__toggle--medium';
});

const switchColor = computed(() => {
  if (props.color === SWITCH_COLORS.primary) return 'switch__toggle--primary';
  else if (props.color === SWITCH_COLORS.secondary) return 'switch__toggle--secondary';
  else if (props.color === SWITCH_COLORS.destructive) return 'switch__toggle--destructive';
  else return 'switch__toggle--default';
});

const switchState = computed(() => {
  if (props.modelValue) return 'switch__toggle--active';
  else return 'switch__toggle--inactive';
});

const handleToggle = () => {
  if (!props.disabled) {
    const newValue = !props.modelValue;
    emit('change', newValue);
  }
};
</script>

<template>
  <div class="switch">
    <div class="switch__container" @click="handleToggle">
      <div
        :class="[
          'switch__toggle',
          { 'switch__toggle--disabled': disabled },
          switchSize,
          switchColor,
          switchState,
        ]">
        <div class="switch__thumb"></div>
      </div>

      <label v-if="label" :for="switchId" class="switch__label">
        {{ label }}
      </label>
    </div>
  </div>
</template>

<style scoped lang="scss">
.switch {
  display: inline-block;

  &__container {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  &__toggle {
    position: relative;
    display: inline-block;
    border-radius: 999px;
    transition: all 0.2s ease;
    width: 44px;
    height: 24px;
    background-color: var(--border);

    &--small {
      width: 36px;
      height: 20px;
    }

    &--medium {
      width: 44px;
      height: 24px;
    }

    &--large {
      width: 52px;
      height: 28px;
    }

    &--active {
      &.switch__toggle--default {
        background-color: var(--accent);
      }

      &.switch__toggle--primary {
        background-color: var(--badge-1);
      }

      &.switch__toggle--secondary {
        background-color: var(--badge-2);
      }

      &.switch__toggle--destructive {
        background-color: var(--destructive);
      }

      .switch__thumb {
        transform: translateX(calc(100% + 4px)) translateY(-50%);
      }
    }

    &--disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__thumb {
    position: absolute;
    left: 4px;
    top: 50%;
    transform: translateY(-50%);
    height: calc(100% - 8px);
    aspect-ratio: 1/1;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  &__label {
    margin-left: 10px;
    font-size: 1rem;
    color: var(--background-foreground);
  }
}
</style>
