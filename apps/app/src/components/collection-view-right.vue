<script lang="ts" setup>
import { useUpdateRule } from '@/composables/use-update-rule';
import RuleResponse from './rule-response.vue';
import RuleSettings from './rule-settings.vue';
import type { RuleApplication } from '@/models/Rule';

const updateRule = useUpdateRule();

const onUpdateRule = (rule: RuleApplication) => updateRule(rule);
</script>

<template>
  <div class="collection-view__right">
    <RuleSettings @update-rule="onUpdateRule" />
    <RuleResponse />
  </div>
</template>

<style lang="scss">
.collection-view__right {
  display: flex;
  width: 100%;
  height: 100%;
}
</style>
