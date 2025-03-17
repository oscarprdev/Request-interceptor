<script setup lang="ts">
import { Toaster } from 'vue-sonner';
import './styles/global.css';
import { onBeforeMount, ref } from 'vue';
import { useUserStore } from './stores/user';
import InstallExtensionModal from './components/modals/install-extension-modal.vue';
import { userMutations } from './services/mutations/user-mutations';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { usersQueries } from './services/queries/users-queries';

const userStore = useUserStore();
const queryClient = useQueryClient();
const isExtensionModalOpened = ref(false);
const isLoading = ref(true);

// Set up user fetch query with enabled:false so we control when it runs
const userQuery = useQuery({
  queryKey: ['user'],
  queryFn: () => {
    if (!userStore.userToken) return null;
    return usersQueries.getUserById(userStore.userToken);
  },
  retry: 1,
});

// Set up user creation mutation
const createUserMutation = useMutation({
  mutationFn: userMutations.createUser,
  onSuccess: createdUser => {
    // When user is created, update the store and invalidate queries
    userStore.setUserToken(createdUser.id);
    queryClient.invalidateQueries({ queryKey: ['user'] });
    isLoading.value = false;
  },
  onError: error => {
    console.error('Failed to create user:', error);
    isLoading.value = false;
    isExtensionModalOpened.value = true;
  },
});

onBeforeMount(async () => {
  try {
    // Create a promise-based wrapper for chrome message
    const getUserId = (): Promise<string | null> => {
      return new Promise(resolve => {
        // @ts-expect-error chrome runtime is not typed
        chrome.runtime.sendMessage(
          'dnofpfkhdmmanfhnangcoiamhbhojblg',
          { type: 'GET_USER' },
          (response: { userId: string }) => resolve(response?.userId || null)
        );
      });
    };

    const userId = await getUserId();

    if (userId) {
      userStore.setUserToken(userId);

      const result = await userQuery.refetch();

      if (!result.data) {
        createUserMutation.mutate(userId);
      } else {
        isLoading.value = false;
      }
    } else {
      isExtensionModalOpened.value = true;
      isLoading.value = false;
    }
  } catch (error) {
    console.error('Error initializing user:', error);
    isLoading.value = false;
    isExtensionModalOpened.value = true;
  }
});
</script>

<template>
  <div v-if="isLoading" class="loading-container">
    <p>Loading...</p>
  </div>
  <template v-else>
    <header>
      <RouterLink to="/" class="header-link">
        <h1>Requestick</h1>
      </RouterLink>
    </header>
    <main v-if="userStore.userToken">
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <InstallExtensionModal :is-open="isExtensionModalOpened" />
  </template>
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

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: var(--text-light);
}
</style>
