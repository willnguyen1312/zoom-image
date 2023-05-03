<template>
  <p :class="$style.footer">
    Made with ❤️‍🔥 by
    <a :class="$style.blog" target="_blank" rel="noopener noreferrer" href="https://namnguyen.design">Nam Nguyen</a>
  </p>
</template>

<style module>
.footer {
  text-align: center;
  margin-top: 16px;
}

.blog {
  color: violet;
  font-weight: bold;
}
</style>
