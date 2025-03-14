<script lang="ts" setup>
import { ChevronDown } from 'lucide-vue-next';
import { ref, onUnmounted, watch, onMounted } from 'vue';
import type { DropdownEmits, DropdownOption, DropdownProps } from './ui-dropdown.types';
import Button from '@/components/ui/ui-button.vue';

const props = defineProps<DropdownProps>();
const emit = defineEmits<DropdownEmits>();

const dropdownRef = ref<HTMLDivElement | null>(null);
const optionSelected = ref<DropdownOption | null>(props.defaultSelected || null);
const isOpened = ref(false);

const onClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpened.value = false;
  }
};

const onToggleDropdown = () => {
  if (!props.disabled) {
    isOpened.value = !isOpened.value;
  }
};

const onSelectOption = (option: DropdownOption) => {
  optionSelected.value = option;
  isOpened.value = false;

  emit('change', option.id);
};

watch(
  () => props.defaultSelected,
  selected => {
    optionSelected.value = selected || null;
  },
  { immediate: true }
);

onMounted(() => {
  document.addEventListener('click', onClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside);
});
</script>

<template>
  <div class="dropdown" ref="dropdownRef">
    <Button
      class="dropdown__selector"
      variant="ghost"
      @click="onToggleDropdown"
      :disabled="disabled">
      {{ optionSelected?.label || placeholder }}
      <ChevronDown :class="['dropdown__chevron', { 'dropdown__chevron--opened': isOpened }]" />
    </Button>
    <ul v-if="isOpened" class="dropdown__content">
      <li v-for="option in options" :key="option.id">
        <button
          type="button"
          @click="() => onSelectOption(option)"
          :class="[
            'dropdown__item',
            { 'dropdown__item--selected': optionSelected?.id === option.id },
          ]">
          {{ option.label }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.dropdown {
  position: relative;
  width: 100%;
  height: inherit;

  &__selector {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 6px 12px;
    height: inherit;
    text-align: left;
    border: inherit;
    border-radius: var(--radius);
    background-color: var(--background);
    color: var(--text-muted);

    &:hover:not(:disabled) {
      border-color: var(--accent);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &:hover {
      color: var(--text-light);

      .dropdown__chevron {
        color: var(--text-light);
      }
    }
  }

  &__chevron {
    transition: transform 0.2s ease;
    margin-left: 8px;
    width: 20px;
    color: var(--text-muted);

    &--opened {
      transform: rotate(180deg);
    }
  }

  &__content {
    position: absolute;
    top: 100%;
    left: 0;
    width: calc(100% + 1px);
    max-height: 200px;
    overflow-y: auto;
    margin: 0;
    padding: 0;
    list-style: none;
    background-color: var(--background);
    border: 1px solid var(--border);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }

  &__item {
    width: 100%;
    padding: 8px 12px;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-light);

    &:hover {
      background-color: var(--background-foreground-muted);
    }

    &--selected {
      border-left: 2px solid var(--accent);
      color: var(--text-light);
      font-weight: 500;
    }
  }
}
</style>
