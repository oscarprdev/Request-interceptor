<script setup lang="ts">
import type { RuleApplication } from '../models/Rule';
import Button from './ui/ui-button.vue';
import Badge from './ui/ui-badge.vue';
import Switch from './ui/ui-switch.vue';
import type { RuleTableProps, RuleTableEmits } from './rules-table.types';
import { BADGE_VARIANTS } from './ui/ui-badge.types';
import { REQUEST_METHODS } from './add-rule-form.types';

defineProps<RuleTableProps>();
const emit = defineEmits<RuleTableEmits>();

const handleReview = (rule: RuleApplication) => {
  emit('review', rule);
};

const badgeVariantsMap = {
  [REQUEST_METHODS.GET]: BADGE_VARIANTS.primary,
  [REQUEST_METHODS.PUT]: BADGE_VARIANTS.secondary,
  [REQUEST_METHODS.DELETE]: BADGE_VARIANTS.destructive,
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
            <th>Enabled</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rule in rules" :key="rule.id">
            <td>{{ rule.id }}</td>
            <td class="row-url">{{ rule.urlFilter }}</td>
            <td>
              <Badge
                v-for="method in rule.requestMethods"
                :key="method"
                :label="method"
                :variant="
                  badgeVariantsMap[method as keyof typeof badgeVariantsMap] ||
                  BADGE_VARIANTS.default
                " />
            </td>
            <td>{{ rule.resourceTypes.join(', ') }}</td>
            <td>{{ rule.priority }}</td>
            <td>{{ rule.createdAt }}</td>
            <td>
              <Switch v-model="rule.isEnabled" />
            </td>
            <td>
              <Button variant="primary" size="small" @click="handleReview(rule)">Review</Button>
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

      .row-url {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      span {
        margin: 0 1px;
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
