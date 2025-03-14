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
        <div class="url-filter__dropdown">
          <Dropdown
            @change="onMethodDropdownChange"
            :default-selected="selectedOption"
            :options="methodsDropdownOptions" />
        </div>
        <div class="url-filter__input">
          <input
            placeholder="Enter the URL intercepted"
            :value="rulesStore.selectedRule?.urlFilter"
            @input="onUrlFilterChanges" />
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

    .url-filter {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 40px;

      &__dropdown {
        width: fit-content;
        height: 100%;
        border-bottom: 1px solid var(--border);
        border-right: 1px solid var(--border);

        .dropdown__content {
          border-left: none;
        }
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
          border: none;
          border-bottom: 1px solid var(--border);
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
