<script setup lang="ts">
import type { RuleApplication } from '../models/Rule';
import Button from './ui/ui-button.vue';

defineProps<{
  rules: RuleApplication[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  review: [rule: RuleApplication];
}>();

const handleReview = (rule: RuleApplication) => {
  emit('review', rule);
};
</script>

<template>
  <div class="rules-table">
    <div v-if="loading" class="rules-table__loading">
      <div class="rules-table__loading-spinner"></div>
      <p>Loading rules...</p>
    </div>

    <div v-else-if="!rules.length" class="rules-table__empty">
      <p>No rules found. Create your first rule!</p>
    </div>

    <div v-else class="rules-table__container">
      <table class="rules-table__table">
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
            <td class="rules-table__url">{{ rule.urlFilter }}</td>
            <td>{{ rule.requestMethods.join(', ') }}</td>
            <td>{{ rule.resourceTypes.join(', ') }}</td>
            <td>{{ rule.priority }}</td>
            <td>{{ new Date(rule.createdAt).toLocaleDateString() }}</td>
            <td>
              <Button secondary size="small" @click="handleReview(rule)">Review</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.rules-table {
  width: 100%;

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

  &__empty {
    padding: 40px;
    text-align: center;
    background-color: var(--background);
    border-radius: 4px;
    font-style: italic;
  }

  &__container {
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
  }

  &__url {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
