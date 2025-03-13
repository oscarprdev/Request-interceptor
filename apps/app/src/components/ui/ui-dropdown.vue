<script lang="ts" setup>
import Button from '@/components/ui/ui-button.vue';
import { ChevronDown } from 'lucide-vue-next';
import { ref } from 'vue';

type DropdownOption = {
  id: string;
  value: string;
  label: string;
};

const props = defineProps<{
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
}>();

const optionSelected = ref<DropdownOption | null>(props.placeholder ? null : props.options[0]);
const isOpened = ref(false);

const onToggleDropdown = () => (isOpened.value = !isOpened.value);
const onSelectOption = (id: string) => {
  const option = props.options.find(option => option.id === id);
  if (!option) return;

  optionSelected.value = option;
};
</script>

<template>
  <div class="dropdown">
    <Button class="dropdown__selector" variant="ghost" @click="onToggleDropdown">
      {{ optionSelected?.label || placeholder }}
      <ChevronDown :class="['chevron', { opened: isOpened }]" />
    </Button>
    <ul class="dropdown__content">
      <li v-for="option in options" :key="option.id">
        <button
          @click="() => onSelectOption(option.id)"
          :class="['item', { selected: optionSelected?.id === option.id }]">
          {{ option.label }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
.dropdown {
  width: 100%;
}
</style>
