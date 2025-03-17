<script setup lang="ts">
import { Toaster } from 'vue-sonner';
import './styles/global.css';
import { onMounted, ref } from 'vue';
import { useUserStore } from './stores/user';
import InstallExtensionModal from './components/modals/install-extension-modal.vue';

const userStore = useUserStore();

const isExtensionModalOpened = ref(false);

onMounted(() => {
  // @ts-expect-error chrome runtime is not typed
  chrome.runtime.sendMessage('dnofpfkhdmmanfhnangcoiamhbhojblg', { type: 'GET_USER' }, response => {
    console.log(response);
    const { userId } = response;
    if (userId) {
      userStore.setUserToken(userId);
    } else {
      isExtensionModalOpened.value = true;
    }
  });
});
</script>

<template>
  <header>
    <RouterLink to="/" class="header-link">
      <h1>Requestick</h1>
    </RouterLink>
  </header>
  <main>
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <InstallExtensionModal :is-open="isExtensionModalOpened" />
  <Toaster richColors />
</template>

<style scoped>
.header-link {
  text-decoration: none;
  color: var(--text-light);

  &:hover {
    color: inherit;
    background-color: transparent;
  }
}
</style>
