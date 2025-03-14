<script lang="ts" setup>
import {
  Button,
  type DropdownEmits,
  type DropdownOption,
  type DropdownProps,
} from '@/components/ui';
import { ChevronDown } from 'lucide-vue-next';
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps<DropdownProps>();
const emit = defineEmits<DropdownEmits>();

const dropdownRef = ref<HTMLDivElement | null>(null);
const optionSelected = ref<DropdownOption | null>(null);
const isOpened = ref(false);

watch(
  () => props.modelValue,
  newValue => {
    if (newValue) {
      const option = props.options.find(option => option.value === newValue);
      if (option) {
        optionSelected.value = option;
      }
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (!props.modelValue && !optionSelected.value) {
    optionSelected.value = props.placeholder ? null : props.options[0];
    if (optionSelected.value) {
      emit('update:modelValue', optionSelected.value.value);
    }
  }

  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const handleClickOutside = (event: MouseEvent) => {
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
  emit('update:modelValue', option.value);
  emit('change', option);
};
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

  &__selector {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 8px 12px;
    text-align: left;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background-color: var(--background);

    &:hover:not(:disabled) {
      border-color: var(--accent);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__chevron {
    transition: transform 0.2s ease;
    margin-left: 8px;

    &--opened {
      transform: rotate(180deg);
    }
  }

  &__content {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    margin: 0;
    padding: 0;
    list-style: none;
    background-color: var(--background);
    border: 1px solid var(--border);
    border-radius: var(--radius);
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
      background-color: var(--accent-muted);
      color: var(--text-light);
      font-weight: 500;
    }
  }
}
</style>
