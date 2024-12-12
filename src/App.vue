<script setup lang="ts"></script>

<template>
  <div id="app">
    <div id="nav"><Navbar /></div>

    <router-view />
  </div>
</template>

<script lang="ts">
import Navbar from "../src/components/Navbar.vue";

export default {
  components: {
    Navbar,
  },
  data() {
    return {};
  },
};
</script>
