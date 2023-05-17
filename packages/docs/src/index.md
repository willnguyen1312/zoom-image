---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Zoom Image"
  tagline: "A little yet powerful framework agnostic library to zoom image on the web"
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
  - title: Zoom on scroll / pinch
    details: Support scroll / pinch on image
    icon: 🤏
  - title: Zoom on hover
    details: Support hover on image
    icon: 🖱️
  - title: Zoom on move
    details: Support pointer move on image
    icon: 🎢
  - title: Zoom on click
    details: Support click on image
    icon: 💻
---

<script setup>
import HomePageShow from './components/HomePageShow.vue'
import Footer from './components/FooterComp.vue'
</script>

<HomePageShow />
<Footer />
