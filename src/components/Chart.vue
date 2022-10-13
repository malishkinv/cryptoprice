<template>
  <div class="rounded bg-white p-4 py-6 h-72 md:h-96 mb-4">
    <div class="h-full flex flex-nowrap items-end">
      <div
        class="bg-yellow-300 mr-1 w-8 md:w-10"
        v-for="(item, idx) in data"
        :key="idx"
        :style="{height: `${item.perc}%`}"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: { type: Array, default: [] }
  }
}
</script>
