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
  loading.value = true;
  error.value = null;

  const [err, data] = await rulesService.getRules();

  if (err) {
    error.value = err;
  } else if (data) {
    rules.value = data;
  }

  loading.value = false;
};

const openReviewModal = (rule: RuleApplication) => {
  selectedRule.value = rule;
  showReviewModal.value = true;
};

const closeReviewModal = () => {
  showReviewModal.value = false;
  selectedRule.value = null;
};

const openAddModal = () => {
  showAddModal.value = true;
};

const closeAddModal = () => {
  showAddModal.value = false;
};

const handleRuleAdded = (ruleId: number) => {
  console.log('ruleId', ruleId);
  fetchRules();
};

onMounted(() => {
  fetchRules();
});
</script>

<template>
  <main class="rules__container">
    <header class="rules__header">
      <h1>Rules Management</h1>
      <Button primary @click="openAddModal">Add Rule</Button>
    </header>

    <div v-if="error" class="rules__error">
      <h3>Error</h3>
      <p>{{ error.message }}</p>
      <Button primary @click="fetchRules">Try Again</Button>
    </div>

    <RulesTable v-else :rules="rules" :loading="loading" @review="openReviewModal" />

    <ReviewRuleModal v-if="showReviewModal" :rule="selectedRule" @close="closeReviewModal" />

    <AddRuleModal :isOpen="showAddModal" @close="closeAddModal" @success="handleRuleAdded" />
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
