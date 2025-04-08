<script setup lang="ts">
import { computed, ref, watch } from 'vue';

interface RuleResponseProps {
  modelValue: string;
  language?: string;
  placeholder?: string;
  readonly?: boolean;
  error?: string | null;
}

interface RuleResponseEmits {
  'update:modelValue': [value: string];
  'response-change': [value: string];
}

const props = defineProps<RuleResponseProps>();
const emit = defineEmits<RuleResponseEmits>();

const codeContent = ref(props.modelValue || '');
const editorRef = ref<HTMLTextAreaElement | null>(null);

const lineCount = computed(() => {
  return codeContent.value.split('\n').length;
});

const lineNumbers = computed(() => {
  return Array.from({ length: lineCount.value }, (_, i) => i + 1);
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  codeContent.value = target.value;
  emit('update:modelValue', codeContent.value);
  emit('response-change', codeContent.value);
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Tab') {
    event.preventDefault();

    const textarea = event.target as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newValue =
      codeContent.value.substring(0, start) + '  ' + codeContent.value.substring(end);

    codeContent.value = newValue;
    emit('update:modelValue', newValue);
    emit('response-change', newValue);

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 2;
    }, 0);
  }
};

const resizeTextarea = () => {
  if (editorRef.value) {
    editorRef.value.style.height = 'auto';
    editorRef.value.style.height = `${editorRef.value.scrollHeight}px`;
  }
};

watch(
  codeContent,
  () => {
    setTimeout(resizeTextarea, 0);
  },
  { immediate: true }
);

watch(
  () => props.modelValue,
  newValue => {
    if (newValue !== codeContent.value) {
      codeContent.value = newValue;
    }
  }
);
</script>

<template>
  <div class="rule-response">
    <div class="rule-response__header">
      <span v-if="language" class="rule-response__language">{{ language }}</span>
    </div>

    <div class="rule-response__editor-container">
      <div class="rule-response__line-numbers">
        <div v-for="lineNumber in lineNumbers" :key="lineNumber" class="rule-response__line-number">
          {{ lineNumber }}
        </div>
      </div>

      <textarea
        ref="editorRef"
        v-model="codeContent"
        :placeholder="placeholder"
        :readonly="readonly"
        class="rule-response__editor"
        spellcheck="false"
        @input="handleInput"
        @keydown="handleKeyDown"></textarea>
    </div>
  </div>
  <div v-if="error" class="rule-response__error">{{ error }}</div>
</template>

<style scoped lang="scss">
.rule-response {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background-color: var(--background);
  overflow: hidden;

  &__header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 6px 12px;
    background-color: var(--background-foreground-muted);
    border-bottom: 1px solid var(--border);
  }

  &__language {
    font-size: 0.85rem;
    color: var(--text-muted);
    text-transform: uppercase;
  }

  &__editor-container {
    display: flex;
    min-height: 200px;
    height: 40vh;
    overflow: auto;
  }

  &__line-numbers {
    display: flex;
    flex-direction: column;
    padding: 12px 8px;
    background-color: var(--background-foreground-muted);
    border-right: 1px solid var(--border);
    user-select: none;
    text-align: right;
    color: var(--text-muted);
  }

  &__line-number {
    font-family: monospace;
    font-size: 0.9rem;
    line-height: 1.5;
    min-width: 20px;
  }

  &__editor {
    flex: 1;
    padding: 12px;
    font-family: monospace;
    font-size: 0.9rem;
    line-height: 1.5;
    color: var(--text-light);
    background-color: transparent;
    border: none;
    resize: none;
    overflow: hidden;
    white-space: pre;
    tab-size: 2;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: var(--text-muted);
      opacity: 0.6;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &__error {
    padding: 12px;
    font-size: var(--font-sm);
    color: var(--destructive);
  }
}
</style>
