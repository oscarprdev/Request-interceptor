import type { RuleApplication } from '@/models/Rule';
import { rulesMutations } from '@/services/mutations/rules-mutations';
import { useRulesStore } from '@/stores/rules';
import { useDebounce } from '@/utils/debounce';
import { mapRuleToServer } from '@/utils/mappers';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { ref } from 'vue';
import { toast } from 'vue-sonner';

const ACTION_TIMEOUT = 500;

export const useUpdateRule = () => {
  const ruleToUpdate = ref<RuleApplication | null>(null);

  const rulesStore = useRulesStore();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ['update-rule'],
    mutationFn: async (rule: RuleApplication) =>
      await rulesMutations.updateRule({
        rule: mapRuleToServer(rule),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rules'] }),
    onError: () => {
      if (ruleToUpdate.value) {
        rulesStore.updateRule(ruleToUpdate.value);
      }
      toast.error('Error updating rule');
    },
  });
  const debounce = useDebounce((rule: RuleApplication) => mutate(rule), ACTION_TIMEOUT);

  return {
    action: (rule: RuleApplication) => {
      ruleToUpdate.value = rulesStore.selectedRule;
      rulesStore.updateRule(rule);
      debounce(rule);
    },
    loading: isPending,
  };
};
