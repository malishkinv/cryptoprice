<template>
  <div
    v-if="pages > 1"
    class="pagination fixed bottom-0 left-0 w-full p-5 md:p-0 md:relative border-t border-gray-300 md:border-gray-200 bg-white md:bg-transparent md:pt-4"
  >
    <div class="pagination__info text-sm text-gray-700 hidden md:block">
      Показано 6 результатов из {{ ticketsNumber }}
    </div>
    <div class="pagination__buttons w-full md:w-auto justify-between">
      <button
        v-if="currentPage > 1"
        class="mr-2 rounded border border-gray-300 bg-white text-sm text-gray-700 px-4 py-2"
        @click="prevPage()"
      >Назад</button>
      <button
        v-if="currentPage < pages"
        class="rounded border border-gray-300 bg-white text-sm text-gray-700 px-4 py-2"
        @click="nextPage()"
      >Вперед</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ticketsNumber: { type: Number, default: 0 },
    pages: { type: Number, default: 0 },
    currentPage: { type: Number, default: 1 }
  },
  methods: {
    prevPage() {
      if (this.currentPage > 1) {
        this.$emit('setCurrentPage', this.currentPage - 1)
      }
    },
    nextPage() {
      if (this.currentPage < this.pages) {
        this.$emit('setCurrentPage', this.currentPage + 1)
      }
    }
  }
}
</script>
