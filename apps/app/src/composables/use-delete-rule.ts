import { rulesMutations } from '@/services/mutations/rules-mutations';
import { useRulesStore } from '@/stores/rules';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';

export const useDeleteRule = () => {
  const rulesStore = useRulesStore();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ['delete-rule'],
    mutationFn: async (ruleId: string) => await rulesMutations.deleteRule({ ruleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
      if (rulesStore.rules.length > 0) {
        rulesStore.setSelectedRule(rulesStore.rules[0].id);
      }
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
      toast.error('Error deleting rule');
    },
  });

  return {
    deleteRule: (ruleId: string) => {
      rulesStore.deleteRule(ruleId);
      mutate(ruleId);
    },
    isDeleting: isPending,
  };
};
