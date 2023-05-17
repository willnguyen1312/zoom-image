<script setup lang="ts">
import size from "@zoom-image/core/size.json"
defineProps<{ func: string }>()
</script>

<template>
  <h1>{{ func }} - {{ size[func] }}</h1>
</template>
