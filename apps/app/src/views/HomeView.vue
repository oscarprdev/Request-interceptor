<script setup lang="ts">
import { onMounted, ref } from 'vue';

const rules = ref([]);

onMounted(async () => {
  await getRulesFromExtension();
  // await fetch('http://localhost:3000/example', {
  //   method: 'POST',
  // })
  //   .then(res => res.json())
  //   .then(data => {
  //     console.log(data);
  //   });
});
</script>

<template>
  <main></main>
</template>
