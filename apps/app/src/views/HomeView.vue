<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { rulesService } from '../services/rules-service';
import type Rule from '../models/Rule';

const rules = ref<Rule[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const fetchRules = async () => {
  loading.value = true;
  error.value = null;

  try {
    rules.value = await rulesService.getRules();
  } catch (err) {
    console.error('Failed to fetch rules:', err);
    error.value = err instanceof Error ? err.message : 'Failed to load rules. Please try again.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchRules();
});
</script>

<template>
  <main>
    <h1>Rules Management</h1>

    <div v-if="loading">Loading rules...</div>

    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="fetchRules">Try Again</button>
    </div>

    <div v-else-if="rules.length === 0" class="no-rules">
      No rules found. Create your first rule!
    </div>

    <div v-else class="rules-list">
      <div v-for="rule in rules" :key="rule.id" class="rule-card">
        <h3>{{ rule.urlFilter }}</h3>
        <div class="rule-details">
          <p><strong>Priority:</strong> {{ rule.priority }}</p>
          <p><strong>Action Type:</strong> {{ rule.actionType }}</p>
          <p><strong>Resource Types:</strong> {{ rule.resourceTypes.join(', ') }}</p>
          <p><strong>Request Methods:</strong> {{ rule.requestMethods.join(', ') }}</p>
          <p v-if="rule.redirectUrl"><strong>Redirect URL:</strong> {{ rule.redirectUrl }}</p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.rules-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.rule-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background-color: #f9f9f9;
}

.rule-details {
  margin-top: 10px;
}

.error {
  color: red;
  margin: 20px 0;
}

.no-rules {
  margin: 20px 0;
  font-style: italic;
}
</style>
