<script lang="ts" setup>
import Dropdown from './ui/ui-dropdown.vue';
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
    <div class="rule-settings__url-filter">
      <Dropdown :options="methodsDropdownOptions" />
    </div>
  </div>
</template>

<style lang="scss">
.rule-settings {
  width: 50%;
  height: 100%;
  border-right: 1px solid var(--border);

  &__url-filter {
    display: flex;
    align-items: center;
    margin: 5px;
    border: 1px solid var(--border);
    width: 100%;
  }
}
</style>
