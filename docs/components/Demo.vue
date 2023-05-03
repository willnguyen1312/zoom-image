<script setup lang="ts">
defineProps<{ url: string }>()
</script>

<template>
  <div class="min-h-3xl flex flex-col mt-6 w-full">
    <iframe
      :src="url"
      class="flex-1 overflow-hidden lg:rounded-l-2xl shadow-xl shadow-gray-700/20 bg-white dark:bg-black rounded-4 border-transparent"
    />
  </div>
</template>
