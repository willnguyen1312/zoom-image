<script setup lang="ts">
import size from "./size.json"
defineProps<{ func: string }>()
</script>

<template>
  <h1>{{ func }} - {{ size[func] }}</h1>
</template>
