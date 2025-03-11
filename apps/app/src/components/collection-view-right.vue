<script lang="ts" setup>
import { useRulesStore } from '@/stores/rules';
import RuleResponse from './rule-response.vue';
import RuleSettings from './rule-settings.vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { rulesMutations } from '@/services/mutations/rules-mutations';
import type { RuleApplication } from '@/models/Rule';
import { useDebounce } from '@/utils/debounce';
import { mapRuleToServer } from '@/utils/mappers';

const props = defineProps<{
  collectionId: string | string[];
}>();

const ruleStore = useRulesStore();
const queryClient = useQueryClient();
const { mutate } = useMutation({
  mutationKey: ['create-rule'],
  mutationFn: async (rule: RuleApplication) =>
    await rulesMutations.createRule({
      collectionId: props.collectionId as string,
      rule: mapRuleToServer(rule),
    }),
});
const debounce = useDebounce((rule: RuleApplication) => mutate(rule), 100);

const onUpdateRule = (rule: RuleApplication) => {
  ruleStore.updateRule(rule);
  console.log(rule);
  debounce(rule);
  queryClient.invalidateQueries({ queryKey: ['rules'] });
};
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
