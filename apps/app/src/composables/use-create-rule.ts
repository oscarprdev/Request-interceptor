import type { RuleApplication } from '@/models/Rule';
import { rulesMutations } from '@/services/mutations/rules-mutations';
import { useRulesStore } from '@/stores/rules';
import { useDebounce } from '@/utils/debounce';
import { mapRuleToServer } from '@/utils/mappers';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { ref } from 'vue';
import { toast } from 'vue-sonner';

const ACTION_TIMEOUT = 100;

export const useCreateRule = ({ collectionId }: { collectionId: string }) => {
  const ruleToCreate = ref<RuleApplication | null>(null);
  const rulesStore = useRulesStore();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ['create-rule'],
    mutationFn: async (rule: RuleApplication) =>
      await rulesMutations.createRule({
        collectionId,
        rule: mapRuleToServer(rule),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
      toast.success('Rule created successfully');
    },
    onError: () => {
      if (ruleToCreate.value) {
        rulesStore.deleteRule(ruleToCreate.value.id);
      }

      if (rulesStore.rules.length > 0) {
        rulesStore.setSelectedRule(rulesStore.rules[0].id);
      }

      queryClient.invalidateQueries({ queryKey: ['rules'] });
      toast.error('Error creating rule');
    },
  });
  const debounce = useDebounce((rule: RuleApplication) => mutate(rule), ACTION_TIMEOUT);

  return {
    action: (rule: RuleApplication) => {
      ruleToCreate.value = rule;
      rulesStore.addRule(rule);
      debounce(rule);
    },
    loading: isPending,
  };
};
