<script setup lang="ts">
import { justSayHi } from "@zoom-image/core"
import { onMounted } from "vue"

onMounted(() => {
  justSayHi()
})
</script>

<template>
  <h1>Hello Vue</h1>
</template>

<style module></style>
