<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { rulesService } from '../services/rules-service';
import type { RuleApplication } from '../models/Rule';
import ReviewRuleModal from '../components/review-rule-modal.vue';
import AddRuleModal from '../components/add-rule-modal.vue';
import Button from '../components/ui/ui-button.vue';
import RulesTable from '../components/rules-table.vue';

const rules = ref<RuleApplication[]>([]);
const loading = ref(true);
const error = ref<{ error: boolean; message: string } | null>(null);
const selectedRule = ref<RuleApplication | null>(null);
const showReviewModal = ref(false);
const showAddModal = ref(false);

const fetchRules = async () => {
  const [err, data] = await rulesService.getRules();

  if (err) {
    error.value = err;
  } else if (data) {
    rules.value = data;
  }
};

const toggleReviewModal = (rule: RuleApplication | null, value: boolean) => {
  selectedRule.value = rule;
  showReviewModal.value = value;
};

const toggleAddModal = (value: boolean) => {
  showAddModal.value = value;
};

const handleRuleAdded = () => {
  fetchRules();
};

onMounted(async () => {
  loading.value = true;
  error.value = null;

  await fetchRules();

  loading.value = false;
});
</script>

<template>
  <main class="rules__container">
    <header class="rules__header">
      <h1>Rules Management</h1>
      <Button variant="primary" @click="toggleAddModal(true)">Add Rule</Button>
    </header>

    <div v-if="error" class="rules__error">
      <h3>Error</h3>
      <p>{{ error.message }}</p>
      <Button variant="primary" @click="fetchRules">Try Again</Button>
    </div>

    <RulesTable
      v-else
      :rules="rules"
      :loading="loading"
      @review-rule="rule => toggleReviewModal(rule, true)"
      @rules-updated="fetchRules" />

    <ReviewRuleModal
      v-if="showReviewModal"
      :rule="selectedRule"
      @close="toggleReviewModal(null, false)" />

    <AddRuleModal
      :isOpen="showAddModal"
      @close="toggleAddModal(false)"
      @success="handleRuleAdded" />
  </main>
</template>

<style scoped lang="scss">
.rules {
  &__container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  &__error {
    padding: 20px;
    background-color: var(--destructive);
    border: 1px solid var(--destructive-foreground);
    border-radius: 4px;
    margin-bottom: 20px;
  }
}
</style>
