import { ref } from 'vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { collectionsMutations } from '@/services/mutations/collection-mutations';
import { toast } from 'vue-sonner';
import { useUserStore } from '@/stores/user';
export function useDeleteCollection() {
  const queryClient = useQueryClient();
  const isDeleting = ref(false);

  const userStore = useUserStore();
  const { mutate } = useMutation({
    mutationFn: (collectionId: string) => {
      isDeleting.value = true;
      return collectionsMutations.deleteCollection({
        collectionId,
        userId: userStore.userToken,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast.success('Collection deleted successfully');
      isDeleting.value = false;
    },
    onError: () => {
      toast.error('Failed to delete collection');
      isDeleting.value = false;
    },
  });

  const deleteCollection = (collectionId: string) => {
    mutate(collectionId);
  };

  return {
    deleteCollection,
    isDeleting,
  };
}
