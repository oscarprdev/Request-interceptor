<script setup lang="ts">
import './styles/global.css';
import CollectionsAside from './components/collections-aside.vue';
</script>

<template>
  <CollectionsAside />
  <main>
    <RouterView />
  </main>
</template>
