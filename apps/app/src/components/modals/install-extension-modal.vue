<script lang="ts" setup>
import Modal from '@/components/ui/ui-modal.vue';
import Button from '@/components/ui/ui-button.vue';

defineProps<{ isOpen: boolean }>();
defineEmits<{ (e: 'close'): void }>();

const handleInstallClick = () => {
  window.open('https://chrome.google.com/webstore/detail/requestick/your-extension-id', '_blank');
};
</script>

<template>
  <Modal v-if="isOpen" :can-close="false" :is-open="isOpen" title="Requestick" size="small">
    <div class="extension-modal">
      <div class="extension-modal__icon">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20 6H12L10 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6ZM18 12H16V14H14V16H16V18H18V16H20V14H18V12ZM4 8H11.17L13.17 10H20V18H4V8Z"
            fill="var(--accent)" />
        </svg>
      </div>
      <div class="extension-modal__content">
        <h3 class="extension-modal__title">Welcome to Requestick!</h3>
        <p class="extension-modal__description">
          To unlock the full power of Requestick, you need to install our browser extension first.
        </p>
        <div class="extension-modal__features">
          <div class="feature-item">
            <span class="feature-item__icon">✓</span>
            <span class="feature-item__text">Intercept and modify HTTP requests</span>
          </div>
          <div class="feature-item">
            <span class="feature-item__icon">✓</span>
            <span class="feature-item__text">Create custom request rules</span>
          </div>
          <div class="feature-item">
            <span class="feature-item__icon">✓</span>
            <span class="feature-item__text">Organize rules into collections</span>
          </div>
        </div>
      </div>
      <div class="extension-modal__actions">
        <Button variant="primary" size="medium" @click="handleInstallClick">
          Install Extension
        </Button>
      </div>
    </div>
  </Modal>
</template>

<style lang="scss">
.extension-modal {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0.5rem;

  &__icon {
    display: flex;
    justify-content: center;
    margin-bottom: 0.5rem;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__title {
    font-size: var(--font-lg);
    font-weight: 600;
    color: var(--text-light);
    margin-bottom: 0.5rem;
  }

  &__description {
    font-size: var(--font-md);
    color: var(--text-muted);
    line-height: 1.5;
  }

  &__features {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    background-color: var(--background-foreground);
    padding: 1rem;
    border-radius: var(--radius);
    border: 1px solid var(--border);
    margin: 0.5rem 0;
  }

  &__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;

    button {
      width: 100%;
    }
  }
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: var(--accent-muted);
    color: var(--accent);
    font-size: var(--font-sm);
    font-weight: bold;
  }

  &__text {
    font-size: var(--font-sm);
    color: var(--text-light);
  }
}
</style>
