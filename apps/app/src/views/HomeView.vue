<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { rulesService } from '../services/rules-service';
import type { RuleApplication } from '../models/Rule';
import ReviewRuleModal from '../components/review-rule-modal.vue';
import Button from '../components/ui/ui-button.vue';

const rules = ref<RuleApplication[]>([]);
const loading = ref(true);
const error = ref<{ error: boolean; message: string } | null>(null);
const selectedRule = ref<RuleApplication | null>(null);
const showModal = ref(false);

const hasRules = computed(() => rules.value.length > 0);

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
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedRule.value = null;
};

onMounted(() => {
  fetchRules();
});
</script>

<template>
  <main class="rules__container">
    <header class="rules__header">
      <h1>Rules Management</h1>
      <Button secondary :disabled="loading" @click="fetchRules">
        {{ loading ? 'Loading...' : 'Refresh' }}
      </Button>
    </header>

    <div v-if="loading" class="rules__loading">
      <div class="rules__loading-spinner"></div>
      <p>Loading rules...</p>
    </div>

    <div v-else-if="error" class="rules__error">
      <h3>Error</h3>
      <p>{{ error.message }}</p>
      <Button primary @click="fetchRules">Try Again</Button>
    </div>

    <div v-else-if="!hasRules" class="rules__empty">
      <p>No rules found. Create your first rule!</p>
    </div>

    <div v-else class="rules__table-container">
      <table class="rules__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>URL Filter</th>
            <th>Methods</th>
            <th>Resource Types</th>
            <th>Priority</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rule in rules" :key="rule.id">
            <td>{{ rule.id }}</td>
            <td class="rules__table-url">{{ rule.urlFilter }}</td>
            <td>{{ rule.requestMethods.join(', ') }}</td>
            <td>{{ rule.resourceTypes.join(', ') }}</td>
            <td>{{ rule.priority }}</td>
            <td>{{ new Date(rule.createdAt).toLocaleDateString() }}</td>
            <td>
              <Button secondary size="small" @click="openReviewModal(rule)">Review</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ReviewRuleModal v-if="showModal" :rule="selectedRule" @close="closeModal" />
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

  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;

    &-spinner {
      border: 4px solid var(--accent);
      border-top: 4px solid var(--accent-foreground);
      border-radius: 50%;
      width: 30px;
      height: 30px;
      animation: spin 1s linear infinite;
      margin-bottom: 10px;
    }
  }

  &__error {
    padding: 20px;
    background-color: var(--destructive);
    border: 1px solid var(--destructive-foreground);
    border-radius: 4px;
    margin-bottom: 20px;
  }

  &__empty {
    padding: 40px;
    text-align: center;
    background-color: var(--background);
    border-radius: 4px;
    font-style: italic;
  }

  &__table-container {
    overflow-x: auto;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid var(--border);

    th,
    td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }

    th {
      background-color: var(--background);
      font-weight: 600;
    }

    tr:hover {
      background-color: var(--background);
    }

    &-url {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
