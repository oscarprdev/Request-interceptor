<script setup lang="ts">
import { Toaster } from 'vue-sonner';
import './styles/global.css';
</script>

<template>
  <header>
    <RouterLink to="/" class="header-link">
      <h1>Requestick</h1>
    </RouterLink>
  </header>
  <main>
    <RouterView />
  </main>
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
