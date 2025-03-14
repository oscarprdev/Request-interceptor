<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import {
  type AddCollectionModalProps,
  type AddCollectionModalEmits,
  type FormState,
  formStateSchema,
  inputNameSchema,
} from './add-collection-modal.types';
import Modal from '@/components/ui/ui-modal.vue';
import Input from '@/components/ui/ui-input.vue';
import Button from '@/components/ui/ui-button.vue';
import { useMutation } from '@tanstack/vue-query';
import { collectionMutations } from '@/services/mutations/collection-mutations';
import type { CreateCollectionInput } from '@/services/mutations/collection-mutations.types';

const props = defineProps<AddCollectionModalProps>();
const emit = defineEmits<AddCollectionModalEmits>();

const handleClose = () => {
  emit('close');
};

const formState = ref<FormState>({
  name: {
    value: '',
    error: null,
  },
});
const { mutate, isPending } = useMutation({
  mutationFn: async (input: CreateCollectionInput) =>
    await collectionMutations.createCollection(input),
  onSuccess: () => emit('close'),
});

const isDisabled = computed(() => {
  return Boolean(isPending.value || !formState.value.name.value);
});

const onSubmit = async (e: Event) => {
  e.preventDefault();

  const validationResult = formStateSchema.safeParse({
    name: formState.value.name.value,
  });

  if (!validationResult.success) {
    validationResult.error.errors.forEach(error => {
      const fieldName = error.path[0];
      formState.value[fieldName as keyof FormState].error = error.message;
    });
    return;
  }

  formState.value.name.error = null;

  mutate({
    name: validationResult.data.name,
  });
};

const onNameInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const value = target.value;

  const validationResult = inputNameSchema.safeParse(value);

  if (formState.value.name.error && !validationResult.success) {
    formState.value.name.error = validationResult.error.errors[0].message;
    return;
  }
  formState.value.name.error = null;
};

watch(
  () => props.isOpen,
  () => {
    formState.value.name.value = '';
    formState.value.name.error = null;
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <Modal
    v-if="isOpen"
    title="Add New Collection"
    size="small"
    :isOpen="isOpen"
    @close="handleClose">
    <form @submit="onSubmit" class="add-collection-form">
      <Input
        v-model="formState.name.value"
        :error="formState.name.error ?? undefined"
        label="Name"
        placeholder="Collection Name"
        @input="onNameInput" />
      <Button
        class="add-collection-form__button"
        variant="primary"
        type="submit"
        :disabled="isDisabled">
        <template v-if="isPending"> Loading... </template>
        <template v-else> Create Collection </template>
      </Button>
    </form>
  </Modal>
</template>

<style lang="scss">
.add-collection-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
