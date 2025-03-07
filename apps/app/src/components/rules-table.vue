<script setup lang="ts">
import type { RuleApplication } from '../models/Rule';
import Button from './ui/ui-button.vue';
import Badge from './ui/ui-badge.vue';
import Switch from './ui/ui-switch.vue';
import Checkbox from './ui/ui-checkbox.vue';
import type { RuleTableProps, RuleTableEmits } from './rules-table.types';
import { BADGE_VARIANTS } from './ui/ui-badge.types';
import { REQUEST_METHODS } from './add-rule-form.types';
import { reactive, ref } from 'vue';
import { rulesService } from '@/services/rules-service';

defineProps<RuleTableProps>();
const emit = defineEmits<RuleTableEmits>();

const isEnabledTriggered = reactive<{ [key: string]: boolean }>({});
const selectedRules = ref<string[]>([]);

const handleReview = (rule: RuleApplication) => {
  emit('review-rule', rule);
};

const handleToggleEnabled = async (rule: RuleApplication) => {
  isEnabledTriggered[rule.id] = true;
  await rulesService.updateRule({ rule: { ...rule, isEnabled: !rule.isEnabled } });
  isEnabledTriggered[rule.id] = false;
  emit('rules-updated');
};

const handleSelectRule = (ruleIds: string[], checked: boolean) => {
  if (checked) {
    selectedRules.value = [...selectedRules.value, ...ruleIds];
  } else {
    selectedRules.value = selectedRules.value.filter(id => !ruleIds.includes(id));
  }

  emit('selection-change', selectedRules.value);
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
            <th class="checkbox-column">
              <Checkbox
                :model-value="rules.every(rule => selectedRules.includes(rule.id))"
                @change="
                  checked =>
                    handleSelectRule(
                      rules.map(rule => rule.id),
                      checked
                    )
                " />
            </th>
            <th>ID</th>
            <th>URL Filter</th>
            <th>Methods</th>
            <th>Created Date</th>
            <th>Updated Date</th>
            <th>Enabled</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rule in rules" :key="rule.id">
            <td class="checkbox-column">
              <Checkbox
                :model-value="selectedRules.includes(rule.id)"
                @change="checked => handleSelectRule([rule.id], checked)" />
            </td>
            <td class="ellipsis">{{ rule.id }}</td>
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
            <td>{{ rule.createdAt }}</td>
            <td>{{ rule.updatedAt }}</td>
            <td>
              <Switch
                :disabled="isEnabledTriggered[rule.id]"
                v-model="rule.isEnabled"
                @change="handleToggleEnabled(rule)" />
            </td>
            <td>
              <Button variant="secondary" size="small" @click="handleReview(rule)">Review</Button>
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

    .ellipsis {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      max-width: 100px;
    }

    .checkbox-column {
      width: 40px;
      text-align: center;
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
