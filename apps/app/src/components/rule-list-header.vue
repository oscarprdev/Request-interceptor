<script lang="ts" setup>
import { Plus } from 'lucide-vue-next';
import Button from '@/components/ui/ui-button.vue';
import { useCreateRule } from '@/composables/use-create-rule';

const props = defineProps<{
  collectionId: string | string[];
  rulesLength: number;
}>();

const createRule = useCreateRule({ collectionId: props.collectionId as string });
const onAddRule = () =>
  createRule({
    id: crypto.randomUUID(),
    urlFilter: 'default',
    requestMethods: ['GET'],
    priority: 1,
    isEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    response: {
      type: 'block',
      body: 'Blocked by default rule',
    },
  });
</script>

<template>
  <div class="rules-header">
    <h3 class="title">Rules: {{ rulesLength }}</h3>
    <Button variant="ghost" class="add-rule-button" @click="onAddRule"
      ><Plus class="add-rule-button__icon"
    /></Button>
  </div>
</template>

<style lang="scss">
.rules-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border);
  padding: 0;
  margin: 0;

  .title {
    font-size: var(--font-sm);
    font-weight: 600;
    padding-left: 15px;
  }

  .add-rule-button {
    width: fit-content;
    border-left: 1px solid var(--border);
    margin: 0;
    border-radius: 0;

    &__icon {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
