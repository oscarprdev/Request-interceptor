import type { RuleApplication } from '@/models/Rule';
import { rulesMutations } from '@/services/mutations/rules-mutations';
import { useRulesStore } from '@/stores/rules';
import { useDebounce } from '@/utils/debounce';
import { mapRuleToServer } from '@/utils/mappers';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { ref } from 'vue';

export const useUpdateRule = () => {
  const previousRule = ref<RuleApplication | null>(null);
  const rulesStore = useRulesStore();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ['update-rule'],
    mutationFn: async (rule: RuleApplication) =>
      await rulesMutations.updateRule({
        ruleId: rule.id,
        rule: mapRuleToServer(rule),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rules'] }),
    onError: () => {
      if (previousRule.value) {
        rulesStore.updateRule(previousRule.value);
      }
    },
  });
  const debounce = useDebounce((rule: RuleApplication) => mutate(rule), 100);

  return {
    action: (rule: RuleApplication) => {
      previousRule.value = rulesStore.selectedRule;
      rulesStore.updateRule(rule);
      debounce(rule);
    },
    loading: isPending,
  };
};
