<script lang="ts" setup>
import { Dropdown } from '@/components/ui';

const methodsDropdownOptions = [
  {
    id: 'get',
    label: 'GET',
    value: 'GET',
  },
  {
    id: 'post',
    label: 'POST',
    value: 'POST',
  },
];
</script>
<template>
  <div class="rule-settings">
    <div class="url-filter">
      <div class="url-filter__dropdown">
        <Dropdown :options="methodsDropdownOptions" />
      </div>
      <input class="url-filter__input" placeholder="hola" />
    </div>
  </div>
</template>

<style lang="scss">
.rule-settings {
  width: 50%;
  height: 100%;
  border-right: 1px solid var(--border);

  .url-filter {
    display: flex;
    align-items: center;
    margin: 5px;
    border: 1px solid var(--border);
    width: 100%;

    &__dropdown {
      width: 100px;
    }

    &__input {
      width: 100%;
    }
  }
}
</style>
