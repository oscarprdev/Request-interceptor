<script lang="ts" setup>
import Dropdown from '@/components/ui/ui-dropdown.vue';
import Switch from '@/components/ui/ui-switch.vue';
import Button from '@/components/ui/ui-button.vue';
import { useUpdateRule } from '@/composables/use-update-rule';
import { useRulesStore } from '@/stores/rules';
import { computed, ref } from 'vue';
import RuleResponse from './rule-response.vue';
import RemoveRuleModal from '@/components/modals/remove-rule-modal.vue';
import { ACTION_TYPES, ActionType } from '@/models/Rule';
import { capitalizeStr } from '@/utils/strings';

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

const methodsDropdownOptions = ALLOWED_METHODS.map(method => ({
  id: method.toLowerCase(),
  value: method,
  label: method,
}));

const actionTypeOptions = ACTION_TYPES.map(actionType => ({
  id: actionType.toLowerCase(),
  value: actionType,
  label: capitalizeStr(actionType),
}));

const responseError = ref<string | null>(null);
const isRemoveModalOpen = ref(false);

const rulesStore = useRulesStore();
const { action } = useUpdateRule();

const responseContent = computed(() => {
  if (rulesStore.selectedRule?.redirectUrl) {
    try {
      const base64Match = rulesStore.selectedRule.redirectUrl.match(/base64,(.+)/);
      if (base64Match && base64Match[1]) {
        const jsonStr = atob(base64Match[1]);
        return JSON.stringify(JSON.parse(jsonStr), null, 2);
      }
    } catch (e) {
      console.error('Error parsing redirectUrl:', e);
    }
  }
  return rulesStore.selectedRule?.response
    ? JSON.stringify(rulesStore.selectedRule.response, null, 2)
    : '{\n  "message": "Your response data here"\n}';
});

const selectedOption = computed(() => {
  return methodsDropdownOptions.find(
    method => method.id === rulesStore.selectedRule?.requestMethods[0].toLowerCase()
  );
});

const selectedActionType = computed(() => {
  const actionType = rulesStore.selectedRule?.actionType || ActionType.REDIRECT;
  return actionTypeOptions.find(option => option.id === actionType.toLowerCase());
});

const isRuleEnabled = computed(() => {
  return rulesStore.selectedRule?.isEnabled || false;
});

const onTitleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const title = target.value;
  const selectedRule = rulesStore.selectedRule;

  if (selectedRule) {
    selectedRule.title = title;
    action(selectedRule);
  }
};

const onOpenRemoveModal = () => {
  isRemoveModalOpen.value = true;
};

const onCloseRemoveModal = () => {
  isRemoveModalOpen.value = false;
};

const onEnableToggle = (value: boolean) => {
  const selectedRule = rulesStore.selectedRule;

  if (selectedRule) {
    selectedRule.isEnabled = value;
    action(selectedRule);
  }
};

const onMethodDropdownChange = (id: string) => {
  const method = methodsDropdownOptions.find(method => method.id === id);
  const selectedRule = rulesStore.selectedRule;

  if (method && selectedRule) {
    selectedRule.requestMethods = [method.value];
    action(selectedRule);
  }
};

const onActionTypeChange = (id: string) => {
  const actionType = actionTypeOptions.find(option => option.id === id);
  const selectedRule = rulesStore.selectedRule;

  if (actionType && selectedRule) {
    selectedRule.actionType = actionType.value as ActionType;
    action(selectedRule);
  }
};

const onUrlFilterChanges = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const urlFilter = target.value;
  const selectedRule = rulesStore.selectedRule;

  if (selectedRule) {
    selectedRule.urlFilter = urlFilter;
    action(selectedRule);
  }
};

const onResponseChange = (value: string) => {
  const selectedRule = rulesStore.selectedRule;
  if (!selectedRule) return;

  try {
    responseError.value = null;
    const jsonData = JSON.parse(value);

    const base64Data = btoa(JSON.stringify(jsonData));
    selectedRule.redirectUrl = `data:application/json;base64,${base64Data}`;

    selectedRule.response = jsonData;

    action(selectedRule);
  } catch (error) {
    responseError.value = error instanceof Error ? error.message : 'Invalid JSON';
  }
};
</script>

<template>
  <section class="rule-viewer">
    <article class="settings">
      <div class="rule-opts">
        <h3 class="rule-opts__label">Rule Configuration</h3>
        <div class="rule-opts__container">
          <div class="rule-opts__title">
            <input
              placeholder="Enter rule title"
              :value="rulesStore.selectedRule?.title"
              @input="onTitleChange"
              class="rule-opts__input" />
            <Button
              v-if="rulesStore.selectedRule"
              variant="destructive"
              size="small"
              class="rule-opts__remove-btn"
              @click="onOpenRemoveModal">
              Remove
            </Button>
          </div>
          <div class="rule-opts__actions">
            <div class="action-type">
              <label>Action Type</label>
              <Dropdown
                @change="onActionTypeChange"
                :default-selected="selectedActionType"
                :options="actionTypeOptions" />
            </div>

            <div class="switch">
              <label>Request status</label>
              <Switch :model-value="isRuleEnabled" @change="onEnableToggle" size="medium" />
            </div>
          </div>
        </div>
      </div>

      <div class="url-filter">
        <h3 class="url-filter__title">URL Filter</h3>
        <div class="url-filter__container">
          <div class="dropdown">
            <Dropdown
              @change="onMethodDropdownChange"
              :default-selected="selectedOption"
              :options="methodsDropdownOptions" />
          </div>
          <div class="input">
            <input
              placeholder="Enter the URL intercepted"
              :value="rulesStore.selectedRule?.urlFilter"
              @input="onUrlFilterChanges" />
          </div>
        </div>
      </div>
    </article>
    <article class="response">
      <div class="response__header">
        <h3 class="response__title">Response</h3>
        <p class="response__subtitle">Edit the JSON response for this rule</p>
      </div>
      <div class="response__editor">
        <RuleResponse
          v-model="responseContent"
          :error="responseError"
          language="json"
          placeholder="Enter JSON response here..."
          @response-change="onResponseChange" />
      </div>
    </article>

    <RemoveRuleModal
      v-if="rulesStore.selectedRule"
      :isOpen="isRemoveModalOpen"
      :ruleId="rulesStore.selectedRule.id"
      @close="onCloseRemoveModal" />
  </section>
</template>

<style lang="scss">
.rule-viewer {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .settings {
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--border);

    .rule-opts {
      display: flex;
      flex-direction: column;
      gap: 3px;
      width: calc(100% - 20px);
      padding: 10px;
      margin: 10px;
      background-color: var(--background-foreground-muted);

      &__label {
        font-size: var(--font-md);
        color: var(--text-muted);
        margin-left: 5px;
      }

      &__container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        min-height: 40px;
        width: 100%;
        gap: 10px;
      }

      &__title {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      &__action-type {
        width: 120px;
        margin-right: 16px;

        label {
          font-size: var(--font-sm);
          color: var(--text-muted);
          margin-bottom: 5px;
          margin-left: 5px;
        }
      }

      &__input {
        width: 100%;
        height: 40px;
        padding: 5px 10px;
        background-color: var(--background);
        border: 1px solid var(--border);
        outline: none;
        color: var(--text-light);
        border-radius: var(--radius);

        &:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 1px var(--accent-muted);
        }
      }

      &__actions {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;

        label {
          font-size: var(--font-sm);
          color: var(--text-muted);
          margin-bottom: 5px;
        }

        .switch {
          display: flex;
          flex-direction: column;
          min-width: 100px;
        }
      }

      &__remove-btn {
        color: var(--error);
      }
    }

    .url-filter {
      display: flex;
      flex-direction: column;
      gap: 3px;
      width: calc(100% - 20px);
      padding: 10px;
      margin: 10px;
      background-color: var(--background-foreground-muted);

      &__title {
        font-size: var(--font-md);
        color: var(--text-muted);
        margin-left: 5px;
      }

      &__container {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        height: 40px;
        width: 100%;

        .dropdown {
          width: fit-content;
          height: 100%;
        }

        .input {
          display: flex;
          width: 100%;
          height: 100%;

          input {
            width: 100%;
            height: 100%;
            padding: 5px 10px;
            background-color: var(--background);
            border: 1px solid var(--border);
            border-left: none;
            outline: none;
            color: var(--text-light);
          }

          input:focus {
            border-bottom: 1px solid var(--accent);
          }
        }
      }
    }
  }

  .response {
    display: flex;
    flex-direction: column;
    padding: 10px;

    &__header {
      padding: 10px;
      margin-bottom: 10px;
    }

    &__title {
      font-size: var(--font-md);
      color: var(--text-light);
      margin: 0 0 5px 0;
    }

    &__subtitle {
      font-size: var(--font-sm);
      color: var(--text-muted);
      margin: 0;
    }

    &__editor {
      flex: 1;
      width: 100%;
    }
  }
}
</style>
