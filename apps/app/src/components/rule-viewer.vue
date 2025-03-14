<script lang="ts" setup>
import Dropdown from '@/components/ui/ui-dropdown.vue';
import { useUpdateRule } from '@/composables/use-update-rule';
import { useRulesStore } from '@/stores/rules';
import { computed } from 'vue';

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

const methodsDropdownOptions = ALLOWED_METHODS.map(method => ({
  id: method.toLowerCase(),
  value: method,
  label: method,
}));

const ruleStore = useRulesStore();
const { action } = useUpdateRule();

const selectedOption = computed(() => {
  const method = methodsDropdownOptions.find(
    method => method.id === ruleStore.selectedRule?.requestMethods[0].toLowerCase()
  );
  return method;
});

const onMethodDropdownChange = (id: string) => {
  const method = methodsDropdownOptions.find(method => method.id === id);
  const selectedRule = ruleStore.selectedRule;
  if (method && selectedRule) {
    ruleStore.updateRule({ ...selectedRule, requestMethods: [method.value] });
  }
};

const onUrlFilterChanges = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const urlFilter = target.value;
  const selectedRule = ruleStore.selectedRule;

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
        <div class="url-filter__dropdown">
          <Dropdown
            @change="onMethodDropdownChange"
            :default-selected="selectedOption"
            :options="methodsDropdownOptions" />
        </div>
        <div class="url-filter__input">
          <input placeholder="Enter the URL intercepted" @input="onUrlFilterChanges" />
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
    width: 50%;
    border-right: 1px solid var(--border);
    padding: 5px;

    .url-filter {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 40px;

      &__dropdown {
        width: fit-content;
        height: 100%;
        border: 1px solid var(--border);
      }

      &__input {
        display: flex;
        width: 100%;
        height: 100%;

        input {
          width: 100%;
          height: 100%;
          padding: 5px 10px;
          background-color: transparent;
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

  .response {
    width: 50%;
  }
}
</style>
