import type { RuleApplication } from '@/models/Rule';
import { rulesMutations } from '@/services/mutations/rules-mutations';
import { useRulesStore } from '@/stores/rules';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { ref } from 'vue';
import { toast } from 'vue-sonner';

export const useDeleteRule = () => {
  const ruleToDelete = ref<RuleApplication | null>(null);

  const rulesStore = useRulesStore();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ['delete-rule'],
    mutationFn: async (ruleId: string) => await rulesMutations.deleteRule({ ruleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
      if (rulesStore.rules.length > 0) {
        rulesStore.setSelectedRule(rulesStore.rules[0].id);
      } else {
        rulesStore.setSelectedRule(null);
      }

      toast.success('Rule deleted successfully');
    },
    onError: () => {
      if (ruleToDelete.value) {
        rulesStore.addRule(ruleToDelete.value);
      }
      queryClient.invalidateQueries({ queryKey: ['rules'] });
      toast.error('Error deleting rule');
    },
  });

  return {
    deleteRule: (ruleId: string) => {
      ruleToDelete.value = rulesStore.rules.find(rule => rule.id === ruleId) || null;
      rulesStore.deleteRule(ruleId);
      mutate(ruleId);
    },
    isDeleting: isPending,
  };
};
