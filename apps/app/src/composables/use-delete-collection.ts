import { ref } from 'vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { collectionsMutations } from '@/services/mutations/collection-mutations';
import { toast } from 'vue-sonner';

export function useDeleteCollection() {
  const queryClient = useQueryClient();
  const isDeleting = ref(false);

  const { mutate } = useMutation({
    mutationFn: (collectionId: string) => {
      isDeleting.value = true;
      return collectionsMutations.deleteCollection({ collectionId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast.success('Collection deleted successfully');
      isDeleting.value = false;
    },
    onError: error => {
      console.error('Error deleting collection:', error);
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
