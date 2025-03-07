<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { rulesService } from '../services/rules-service';
import type { RuleApplication } from '../models/Rule';
import ReviewRuleModal from '../components/review-rule-modal.vue';
import AddRuleModal from '../components/add-rule-modal.vue';
import Button from '../components/ui/ui-button.vue';
import RulesTable from '../components/rules-table.vue';
import { extensionService } from '@/services/extension-service';
import { MESSAGE_TYPES } from '@/services/extension-service.types';

const rules = ref<RuleApplication[]>([]);
const loading = ref(true);
const error = ref<{ error: boolean; message: string } | null>(null);
const isDeleting = ref(false);

const selectedReviewRule = ref<RuleApplication | null>(null);
const selectedRuleIds = ref<string[]>([]);

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
  selectedReviewRule.value = rule;
  showReviewModal.value = value;
};

const toggleAddModal = (value: boolean) => {
  showAddModal.value = value;
};

const handleRuleAdded = async (id: string) => {
  await extensionService.sendMessage({
    type: MESSAGE_TYPES.UPDATE_RULES,
    payload: id,
  });
  await fetchRules();
  toggleAddModal(false);
};

const handleSelectionChange = (ids: string[]) => {
  selectedRuleIds.value = ids;
};

const handleRulesUpdated = async () => {
  await fetchRules();
  await extensionService.sendMessage({
    type: MESSAGE_TYPES.UPDATE_RULES,
    payload: [],
  });
};

const handleRemoveRules = async () => {
  isDeleting.value = true;
  await Promise.all(selectedRuleIds.value.map(id => rulesService.deleteRule(id)));

  await fetchRules();
  await extensionService.sendMessage({
    type: MESSAGE_TYPES.UPDATE_RULES,
    payload: [],
  });

  selectedRuleIds.value = [];
  isDeleting.value = false;
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
      <div class="rules__actions">
        <Button
          v-if="selectedRuleIds.length > 0"
          variant="destructive"
          class="rules__action-button"
          @click="handleRemoveRules">
          <span v-if="!isDeleting">Remove rule{{ selectedRuleIds.length > 1 ? 's' : '' }}</span>
          <span v-else>Removing...</span>
        </Button>
        <Button variant="primary" @click="toggleAddModal(true)">Add Rule</Button>
      </div>
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
      :selected-rules="selectedRuleIds"
      @review-rule="rule => toggleReviewModal(rule, true)"
      @rules-updated="handleRulesUpdated"
      @selection-change="handleSelectionChange" />

    <ReviewRuleModal
      v-if="showReviewModal"
      :rule="selectedReviewRule"
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

  &__actions {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  &__action-button {
    font-weight: 500;
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
