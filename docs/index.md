---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Zoom Image"
  tagline: "A little powerful library to zoom image on the web"
  image:
    src: /favicon.svg
    alt: ZoomImage
  actions:
    - theme: brand
      text: Get Started
      link: /guide
    - theme: alt
      text: View on GitHub
      link: https://github.com/willnguyen1312/zoom-image

features:
  - title: Zoom on wheel
    details: Support mouse wheel zoom on image
    icon: 🛞
  - title: Zoom on hover
    details: Support mouse hover zoom on image
    icon: 🖱️
  - title: Zoom on pinch
    details: Support touch pinch zoom on image
    icon: 🤏
---

<script setup>
import Footer from './components/Footer.vue'
</script>

<Footer />
