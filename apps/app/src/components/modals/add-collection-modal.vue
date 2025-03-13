<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import {
  type AddCollectionModalProps,
  type AddCollectionModalEmits,
  type FormState,
  formStateSchema,
  inputNameSchema,
  descriptionInputSchema,
} from './add-collection-modal.types';
import Modal from '../ui/ui-modal.vue';
import Input from '../ui/ui-input.vue';
import Button from '../ui/ui-button.vue';
import { useMutation } from '@tanstack/vue-query';
import { collectionMutations } from '@/services/mutations/collection-mutations';
import type { CreateCollectionInput } from '@/services/mutations/collection-mutations.types';

defineProps<AddCollectionModalProps>();
const emit = defineEmits<AddCollectionModalEmits>();

const handleClose = () => {
  emit('close');
};

const formState = ref<FormState>({
  name: {
    value: '',
    error: null,
  },
  description: {
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
  return Boolean(
    isPending.value || !formState.value.name.value || !formState.value.description.value
  );
});

const onSubmit = async (e: Event) => {
  e.preventDefault();

  const validationResult = formStateSchema.safeParse({
    name: formState.value.name.value,
    description: formState.value.description.value,
  });

  if (!validationResult.success) {
    validationResult.error.errors.forEach(error => {
      const fieldName = error.path[0];
      formState.value[fieldName as keyof FormState].error = error.message;
    });
    return;
  }

  formState.value.name.error = null;
  formState.value.description.error = null;

  mutate({
    name: validationResult.data.name,
    description: validationResult.data.description,
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

const onDescriptionInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const value = target.value;

  const validationResult = descriptionInputSchema.safeParse(value);

  if (formState.value.description.error && !validationResult.success) {
    formState.value.description.error = validationResult.error.errors[0].message;
    return;
  }
  formState.value.description.error = null;
};

onMounted(() => {
  formState.value.name.value = '';
  formState.value.name.error = null;
  formState.value.description.value = '';
  formState.value.description.error = null;
});
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
      <Input
        v-model="formState.description.value"
        :error="formState.description.error ?? undefined"
        label="Description"
        placeholder="Collection Description"
        @input="onDescriptionInput" />
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
