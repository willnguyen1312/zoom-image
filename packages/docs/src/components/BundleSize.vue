<script setup lang="ts">
import size from "../../../../size.json"
defineProps<{ func: string; pkg: string }>()
</script>

<template>
  <span>{{ size[pkg][func] }}</span>
</template>
