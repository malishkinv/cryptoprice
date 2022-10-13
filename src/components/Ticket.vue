<template>
  <div class="ticket rounded bg-white p-4 w-full border border-gray-300 cursor-pointer mb-3 md:mb-0">
    <div class="flex justify-between mb-1">
      <div class="ticket__name text-sm text-gray-900">{{ ticket.name }}</div>
      <div class="ticket__remove" @click="removeTicket">
        <icon-trash class="w-4 h-4 cursor-pointer"></icon-trash>
      </div>
    </div>
    <div class="ticket__value text-4xl text-gray-900">{{ticket.price }}$</div>
  </div>
</template>

<script>
import IconTrash from "../components/icons/iconTrash.vue";
export default {
  components: {
    IconTrash
  },
  props: {
    ticket: { type: Object }
  },
  methods: {
    removeTicket() {
      this.$emit('removeTicket', this.ticket.name)
    }
  }
}
</script>

<style scoped>
.flex {
  display: flex;
  align-items: center;
}
.justify-between {
  justify-content: space-between;
}
.ticket__remove {}
</style>
