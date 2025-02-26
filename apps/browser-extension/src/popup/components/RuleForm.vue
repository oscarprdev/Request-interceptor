<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { saveRule } from '../services/ruleService';
import type { RuleFormData } from '../types/rule';

const emit = defineEmits<{
  (e: 'rule-added'): void;
}>();

const formData = reactive<RuleFormData>({
  name: '',
  type: 'request',
  pattern: '',
  action: 'static',
  value: '',
});

const error = ref('');
const submitting = ref(false);

const valuePlaceholder = computed(() => {
  if (formData.action === 'static') {
    return formData.type === 'request'
      ? '{"data": "example"}'
      : '{"result": "success", "data": []}';
  } else {
    return formData.type === 'request'
      ? 'return function(args) {\n  // Modify request\n  const body = args.bodyAsJson;\n  body.modified = true;\n  return JSON.stringify(body);\n}'
      : 'return function(args) {\n  // Modify response\n  const response = args.responseJson;\n  response.modified = true;\n  return response;\n}';
  }
});

const handleSubmit = async () => {
  // Validate form
  if (!formData.name.trim()) {
    error.value = 'Rule name is required';
    return;
  }

  if (!formData.pattern.trim()) {
    error.value = 'URL pattern is required';
    return;
  }

  if (!formData.value.trim()) {
    error.value = formData.action === 'static' ? 'Value is required' : 'Function code is required';
    return;
  }

  error.value = '';
  submitting.value = true;

  try {
    // Create rule object
    const rule = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      matches: [formData.pattern],
      pattern: formData.pattern,
      action: formData.action,
      value: formData.value,
      enabled: true,
      createdAt: new Date().toISOString(),
    };

    // Save rule
    await saveRule(rule);

    // Reset form
    formData.name = '';
    formData.type = 'request';
    formData.pattern = '';
    formData.action = 'static';
    formData.value = '';

    // Notify parent
    emit('rule-added');
  } catch (err) {
    error.value = 'Failed to save rule';
    console.error(err);
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="rule-form">
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div class="form-group">
      <label for="rule-name">Rule Name</label>
      <input
        id="rule-name"
        v-model="formData.name"
        type="text"
        placeholder="My API Rule"
        :disabled="submitting" />
    </div>

    <div class="form-group">
      <label for="rule-type">Rule Type</label>
      <select id="rule-type" v-model="formData.type" :disabled="submitting">
        <option value="request">Request Modification</option>
        <option value="response">Response Modification</option>
      </select>
    </div>

    <div class="form-group">
      <label for="rule-pattern">URL Pattern</label>
      <input
        id="rule-pattern"
        v-model="formData.pattern"
        type="text"
        placeholder="api.example.com"
        :disabled="submitting" />
      <small>Enter a domain or path that should match the request URL</small>
    </div>

    <div class="form-group">
      <label for="rule-action">Action Type</label>
      <select id="rule-action" v-model="formData.action" :disabled="submitting">
        <option value="static">Static Value</option>
        <option value="function">Custom Function</option>
      </select>
    </div>

    <div class="form-group">
      <label for="rule-value">
        {{ formData.action === 'static' ? 'Value' : 'Function Code' }}
      </label>
      <textarea
        id="rule-value"
        v-model="formData.value"
        rows="6"
        :placeholder="valuePlaceholder"
        :disabled="submitting"></textarea>
      <small v-if="formData.action === 'static'">
        Enter a {{ formData.type === 'request' ? 'request body' : 'response body' }} as JSON
      </small>
      <small v-else>
        Write a function that returns the modified
        {{ formData.type === 'request' ? 'request' : 'response' }}
      </small>
    </div>

    <button class="submit-button" @click="handleSubmit" :disabled="submitting">
      {{ submitting ? 'Saving...' : 'Add Rule' }}
    </button>
  </div>
</template>
