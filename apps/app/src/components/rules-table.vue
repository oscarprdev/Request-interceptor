<script setup lang="ts">
import type { RuleApplication } from '../models/Rule';
import Button from './ui/ui-button.vue';
import UiBadge from './ui/ui-badge.vue';

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

const getMethodVariant = (method: string) => {
  switch (method) {
    case 'GET':
      return 'primary';
    case 'PUT':
      return 'secondary';
    case 'DELETE':
      return 'destructive';
    default:
      return 'default';
  }
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
            <th></th>
          </tr>
        </thead>
        <tbody class="rules-table__body">
          <tr v-for="rule in rules" :key="rule.id">
            <td>{{ rule.id }}</td>
            <td class="rules-table__body--url">{{ rule.urlFilter }}</td>
            <td class="rules-table__body--methods">
              <UiBadge
                v-for="method in rule.requestMethods"
                :key="method"
                :label="method"
                :variant="getMethodVariant(method)" />
            </td>
            <td>{{ rule.resourceTypes.join(', ') }}</td>
            <td>{{ rule.priority }}</td>
            <td>{{ rule.createdAt }}</td>
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
    border: none;

    th,
    td {
      padding: 12px;
      text-align: left;
    }

    th {
      background-color: var(--background);
      font-weight: 700;
      color: var(--text-light);
      border-bottom: 2px solid var(--border);
    }

    td {
      color: var(--text-muted);
      border-bottom: 1px solid var(--background-foreground-muted);
      font-weight: 400;
    }

    tr {
      transition: background-color 0.2s ease;

      &:hover {
        background-color: var(--background-foreground-muted);
      }
    }

    &__body {
      &--url {
        max-width: 250px;
        width: 250px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &--methods {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
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
