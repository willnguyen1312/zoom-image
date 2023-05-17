<script setup lang="ts">
defineProps<{ url: string }>()
</script>

<template>
  <div class="min-h-3xl mt-6 flex w-full flex-col">
    <iframe
      :src="url"
      class="rounded-4 flex-1 overflow-hidden border-transparent bg-white shadow-xl shadow-gray-700/20 dark:bg-black lg:rounded-l-2xl"
    />
  </div>
</template>
