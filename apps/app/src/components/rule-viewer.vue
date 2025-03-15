<script lang="ts" setup>
import Dropdown from '@/components/ui/ui-dropdown.vue';
import Button from '@/components/ui/ui-button.vue';
import { useUpdateRule } from '@/composables/use-update-rule';
import { useRulesStore } from '@/stores/rules';
import { computed } from 'vue';
import { Plus } from 'lucide-vue-next';

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

const methodsDropdownOptions = ALLOWED_METHODS.map(method => ({
  id: method.toLowerCase(),
  value: method,
  label: method,
}));

const rulesStore = useRulesStore();
const { action } = useUpdateRule();

const selectedOption = computed(() => {
  return methodsDropdownOptions.find(
    method => method.id === rulesStore.selectedRule?.requestMethods[0].toLowerCase()
  );
});

const onMethodDropdownChange = (id: string) => {
  const method = methodsDropdownOptions.find(method => method.id === id);
  const selectedRule = rulesStore.selectedRule;

  if (method && selectedRule) {
    selectedRule.requestMethods = [method.value];
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
</script>

<template>
  <section class="rule-viewer">
    <article class="settings">
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

      <div class="rule-headers">
        <div class="rule-headers__header">
          <h3 class="title">Headers</h3>
          <Button variant="ghost" size="small" class="button"><Plus /></Button>
        </div>
      </div>
    </article>
    <article class="response">response</article>
  </section>
</template>

<style lang="scss">
.rule-viewer {
  display: flex;
  width: 100%;
  height: 100%;

  .settings {
    display: flex;
    flex-direction: column;
    width: 50%;
    border-right: 1px solid var(--border);

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

    .rule-headers {
      display: flex;
      flex-direction: column;
      gap: 3px;
      width: calc(100% - 20px);
      height: 500px;
      padding: 10px;
      margin: 10px;
      background-color: var(--background-foreground-muted);

      &__header {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 5px;
        border-bottom: 1px solid var(--border);

        .title {
          font-size: var(--font-md);
          color: var(--text-muted);
          margin-left: 5px;
        }

        .button {
          width: 25px;
          padding: 1px 5px;
          border: 1px solid var(--border);
          color: var(--text-muted);
        }

        .button:hover {
          color: var(--text-light);
          border: 1px solid var(--border-hover);
        }
      }
    }
  }

  .response {
    width: 50%;
  }
}
</style>
