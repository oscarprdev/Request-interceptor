<script setup lang="ts">
import { ref } from 'vue';
import RuleList from './components/RuleList.vue';
import RuleForm from './components/RuleForm.vue';

const activeTab = ref<'list' | 'add'>('list');

const switchTab = (tab: 'list' | 'add') => {
  activeTab.value = tab;
};
</script>

<template>
  <div class="container">
    <header>
      <h1>RequestAI Interceptor</h1>
      <div class="tabs">
        <button :class="{ active: activeTab === 'list' }" @click="switchTab('list')">
          My Rules
        </button>
        <button :class="{ active: activeTab === 'add' }" @click="switchTab('add')">Add Rule</button>
      </div>
    </header>

    <main>
      <RuleList v-if="activeTab === 'list'" />
      <RuleForm v-else @rule-added="switchTab('list')" />
    </main>
  </div>
</template>
