<script setup lang="ts">
import { ref, reactive } from 'vue';
import { z } from 'zod';
import { rulesService } from '../services/rules-service';
import Input from './ui/ui-input.vue';
import Textarea from './ui/ui-textarea.vue';
import Button from './ui/ui-button.vue';
import {
  REQUEST_METHODS,
  ruleSchema,
  type AddRuleFormEmits,
  type RuleFormData,
} from './add-rule-form.types';

const emit = defineEmits<AddRuleFormEmits>();

const formRef = ref<HTMLFormElement | null>(null);
const formData = reactive<RuleFormData>({
  urlFilter: '',
  requestMethods: ['GET'],
  response: '{}',
});

const errors = reactive<Record<string, string>>({});
const isSubmitting = ref(false);
const submitError = ref('');

const availableMethods = Object.values(REQUEST_METHODS);

const toggleMethod = (method: string) => {
  const index = formData.requestMethods.indexOf(method);
  if (index === -1) {
    formData.requestMethods.push(method);
  } else if (formData.requestMethods.length > 1) {
    formData.requestMethods.splice(index, 1);
  }
  validateField('requestMethods');
};

const validateField = (field: keyof RuleFormData) => {
  try {
    const fieldSchema = ruleSchema.shape[field];
    fieldSchema.parse(formData[field]);
    delete errors[field];
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldError = error.errors[0]?.message || `Invalid ${field}`;
      errors[field] = fieldError;
    }
    return false;
  }
};

const validateResponseJson = () => {
  try {
    JSON.parse(formData.response);
    delete errors.response;
    return true;
  } catch (error: unknown) {
    errors.response = error instanceof Error ? error.message : 'Invalid JSON format';
    return false;
  }
};

const formatJson = () => {
  try {
    const parsedJson = JSON.parse(formData.response);
    formData.response = JSON.stringify(parsedJson, null, 2);
    delete errors.response;
  } catch (error: unknown) {
    errors.response = error instanceof Error ? error.message : 'Invalid JSON format';
  }
};

const validateForm = () => {
  let isValid = true;

  Object.keys(formData).forEach(key => {
    const field = key as keyof RuleFormData;
    if (!validateField(field)) {
      isValid = false;
    }
  });

  if (!validateResponseJson()) {
    isValid = false;
  }

  return isValid;
};

const submitForm = async () => {
  if (!validateForm()) return false;

  isSubmitting.value = true;
  submitError.value = '';

  emit('submitting', true);

  const responseObj = JSON.parse(formData.response);

  const [error, result] = await rulesService.createRule({
    urlFilter: formData.urlFilter,
    requestMethods: formData.requestMethods,
    response: responseObj,
  });

  if (error) {
    submitError.value = error.message;
    emit('error', error.message);
  } else if (result) {
    emit('success', result.id);
  }

  isSubmitting.value = false;
  emit('submitting', false);
};

defineExpose({ submitForm });
</script>

<template>
  <div class="add-rule-form">
    <form ref="formRef" @submit.prevent="submitForm" class="add-rule-form__form">
      <Input
        v-model="formData.urlFilter"
        label="URL Filter"
        name="urlFilter"
        placeholder="e.g., https://api.example.com/users"
        required
        :error="errors.urlFilter"
        @blur="validateField('urlFilter')" />

      <div class="add-rule-form__field">
        <label class="add-rule-form__label">
          Request Methods
          <span class="add-rule-form__required">*</span>
        </label>

        <div class="add-rule-form__methods">
          <button
            v-for="method in availableMethods"
            type="button"
            class="add-rule-form__method-btn"
            :key="method"
            :class="{
              'add-rule-form__method-btn--active': formData.requestMethods.includes(method),
            }"
            @click="toggleMethod(method)">
            {{ method }}
          </button>
        </div>

        <p v-if="errors.requestMethods" class="add-rule-form__error">{{ errors.requestMethods }}</p>
      </div>

      <div class="add-rule-form__field add-rule-form__textarea">
        <Button
          class="add-rule-form__textarea--format-btn"
          variant="secondary"
          size="small"
          type="button"
          @click="formatJson">
          Format
        </Button>

        <Textarea
          v-model="formData.response"
          label="Response (JSON)"
          name="response"
          placeholder="{}"
          required
          help-text="Enter a valid JSON object that will be returned as the response"
          :error="errors.response"
          :rows="8"
          @blur="validateResponseJson" />
      </div>

      <p v-if="submitError" class="add-rule-form__submit-error">{{ submitError }}</p>
    </form>
  </div>
</template>

<style scoped lang="scss">
.add-rule-form {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;

  &__form {
    display: flex;
    flex-direction: column;
  }

  &__field {
    margin-bottom: 16px;
    width: 100%;
  }

  &__label {
    display: block;
    margin-bottom: 6px;
    font-weight: 500;
    color: var(--background-foreground);
  }

  &__textarea {
    position: relative;

    &--format-btn {
      position: absolute;
      top: 2.5em;
      right: 0.5em;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
  }

  &__required {
    color: var(--destructive);
    margin-left: 4px;
  }

  &__methods {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
  }

  &__method-btn {
    padding: 6px 12px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background-color: var(--background);
    color: var(--background-foreground);
    cursor: pointer;
    transition: all 0.2s;

    &--active {
      background-color: var(--accent);
      color: var(--accent-foreground);
      border-color: var(--accent);
    }

    &:hover:not(&--active) {
      background-color: var(--background-foreground-muted);
    }
  }

  &__error {
    margin-top: 4px;
    font-size: 0.875rem;
    color: var(--destructive);
  }

  &__submit-error {
    margin: 16px 0;
    padding: 12px;
    background-color: var(--destructive);
    color: white;
    border-radius: var(--radius);
  }
}
</style>
