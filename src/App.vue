<template>
  <div class="p-5">
    <RouterView />
  </div>
</template>

<script>
import { RouterView } from "vue-router";

export default {
  components: {
    RouterView
  }
}
</script>

<style>
body {
  background-color: #F3F4F6;
}
</style>
