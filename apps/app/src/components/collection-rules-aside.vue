<script lang="ts" setup>
import type { RuleApplication } from '@/models/Rule';
import { collectionsService } from '@/services/collections-service';
import { ChevronDown } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';

const props = defineProps<{ collectionId: string; collectionName: string }>();

const rules = ref<RuleApplication[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const isListOpen = ref(false);
const onToggleList = () => {
  isListOpen.value = !isListOpen.value;
};

onMounted(async () => {
  isLoading.value = true;
  const [errorResponse, response] = await collectionsService.getRulesByCollectionId(
    props.collectionId
  );

  if (errorResponse) {
    error.value = errorResponse.message;
    isLoading.value = false;
    return;
  }

  rules.value = response ?? [];
  isLoading.value = false;
});
</script>

<template>
  <div class="collection-rules-aside">
    <button class="collection-rules-aside__button" @click="onToggleList">
      {{ collectionName }}
      <ChevronDown :class="['collection-rules-aside__chevron', isListOpen ? 'up' : 'down']" />
    </button>
    <ul
      v-if="rules.length > 0"
      :class="['collection-rules-aside__list', isListOpen ? 'open' : 'closed']">
      <li class="collection-rules-aside__item" v-for="rule in rules" :key="rule.id">
        <span>{{ rule.urlFilter }}</span>
        <span>{{ rule.actionType }}</span>
      </li>
    </ul>
    <p v-else :class="['collection-rules-aside__empty', isListOpen ? 'open' : 'closed']">
      No rules found
    </p>
  </div>
</template>

<style lang="scss" scoped>
.collection-rules-aside {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;

  &__button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px;
    cursor: pointer;
    background-color: transparent;
    border: none;
    color: var(--text-light);
  }

  &__button:hover {
    text-decoration: underline;
  }

  &__chevron {
    width: 16px;
    height: 16px;
    transition: transform 0.3s ease;
  }

  &__chevron.up {
    transform: rotate(180deg);
  }

  &__list {
    opacity: 0;
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
    max-height: 0;
    overflow: hidden;
    transform: translateY(-10px);

    &.open {
      opacity: 1;
      max-height: 500px;
      transform: translateY(0);
    }

    &.closed {
      opacity: 0;
      max-height: 0;
      transform: translateY(-10px);
    }
  }

  &__empty {
    padding: 10px;
    color: var(--text-muted);
    font-size: 0.8rem;
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;

    &.open {
      opacity: 1;
      transform: translateY(0);
    }

    &.closed {
      opacity: 0;
      transform: translateY(-10px);
    }
  }
}
</style>
