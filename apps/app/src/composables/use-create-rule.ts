import type { RuleApplication } from '@/models/Rule';
import { rulesMutations } from '@/services/mutations/rules-mutations';
import { useRulesStore } from '@/stores/rules';
import { useDebounce } from '@/utils/debounce';
import { mapRuleToServer } from '@/utils/mappers';
import { useMutation, useQueryClient } from '@tanstack/vue-query';

const ACTION_TIMEOUT = 100;

export const useCreateRule = ({ collectionId }: { collectionId: string }) => {
  const rulesStore = useRulesStore();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ['create-rule'],
    mutationFn: async (rule: RuleApplication) =>
      await rulesMutations.createRule({
        collectionId,
        rule: mapRuleToServer(rule),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rules'] }),
    onError: () => {
      // delete rule from store
      // show error toast
      queryClient.invalidateQueries({ queryKey: ['rules'] });
    },
  });
  const debounce = useDebounce((rule: RuleApplication) => mutate(rule), ACTION_TIMEOUT);

  return {
    action: (rule: RuleApplication) => {
      rulesStore.addRule(rule);
      debounce(rule);
    },
    loading: isPending,
  };
};
