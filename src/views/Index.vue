<template>
  <div>
    <div class="card rounded rounded-lg p-5 mb-4">
      <div class="mb-4 relative">
        <input
          v-model="ticket"
          id="ticket"
          type="text"
          class="rounded w-full md:w-96 px-2.5 pb-2.5 pt-7 text-gray-900 dark:text-white border-gray-300 dark:focus:border-blue-500 focus:outline-none focus:border-blue-600 peer"
          placeholder="Например DOGE"
        />
        <label
          for="ticket"
          class="absolute text-sm text-gray-500 duration-300 transform top-2 z-10 left-2.5 text-blue-600 scale-100"
        >
          Тикер
        </label>
      </div>
      <div>
        <button
          class="p-3 px-6 bg-purple-900 text-white rounded rounded-lg"
          @click="addTicket"
        >
          Добавить
        </button>
      </div>
    </div>
    <div class="content block md:grid grid-cols-3 gap-3 mb-4">
      <div class="mb-4 relative">
        <div class="flex absolute -inset-y-5 left-0 items-center pl-3 pointer-events-none">
          <svg aria-hidden="true" class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input
          v-model="searchQuery"
          type="search"
          class="text-sm rounded w-full pl-9 border-gray-300"
          placeholder="Найти тикер"
        />
      </div>
      <div></div><div></div>
      <template v-for="(ticket, idx) in ticketsFiltered" :key="ticket.name">
        <ticket
          v-if="(idx+1) <= (6*currentPage) && (idx+1) >= (((currentPage*6)-6)+1)"
          :ticket="ticket"
          @setSelected="setSelectedTicket($event)"
          @removeTicket="removeTicket($event)"
        ></ticket>
      </template>
    </div>
    <Chart
      v-if="selectedTicketName"
      :data="chartData"
    ></Chart>
    <Pagination
      :tickets-number="this.ticketsFiltered.length"
      :pages="pages"
      :current-page="currentPage"
      @setCurrentPage="setCurrentPage($event)"
    ></Pagination>
  </div>
</template>

<script>
import Ticket from "../components/Ticket.vue";
import Chart from "../components/Chart.vue"
import ApiService from "../services/api.service";
import Pagination from "../components/Pagination.vue";

export default {
  components: {
    Pagination,
    Ticket,
    Chart
  },
  data() {
    return {
      ticket: '',
      tickets: [],
      searchQuery: '',
      selectedTicketName: '',
      selectedTicketPrices: [],
      ws: null,
      currentPage: 1
    }
  },
  computed: {
    ticketsFiltered() {
      return this.tickets.filter((item) => item.name.toUpperCase().includes(this.searchQuery.toUpperCase()))
    },
    chartData() {
      const prices = this.selectedTicketPrices;
      let max = 0;
      prices.forEach((item) => {
        if (item > max) {
          max = item
        }
      })
      return prices.map((item) => {
        return {
          price: item,
          perc: item / max * 100
        }
      })
    },
    pages() {
      return Math.ceil(this.ticketsFiltered.length / 6)
    }
  },
  mounted() {
    this.initSocket();
  },
  methods: {
    addTicket() {
      ApiService.get(`/price?fsym=${this.ticket}&tsyms=USD`)
        .then(({ data }) => {
          if (!data.Response) {
            const ticket = this.ticket.toUpperCase()
            const ticketIdx = this.tickets.findIndex((item) => item.name === ticket)
            if (ticketIdx === -1) {
              this.tickets.push({
                name: ticket,
                price: data.USD
              })
              this.addSubscription(ticket)
            }
            this.ticket = ''
          }
        })
    },
    removeTicket(ticketName) {
      console.log('remove', ticketName)
      const ticketIdx = this.tickets.findIndex((item) => item.name === ticketName)
      if (ticketName === this.selectedTicketName) {
        this.setSelectedTicket({name: '', price: ''})
      }
      this.tickets.splice(ticketIdx, 1)
      this.removeSubscription(ticketName)
    },
    setSelectedTicket(ticket) {
      console.log('set')
      this.selectedTicketName = ticket.name;
      this.selectedTicketPrices = [ticket.price];
      console.log(this.selectedTicketName, this.selectedTicketPrices)
    },
    initSocket() {
      if (!this.ws) {
        this.ws = new WebSocket("wss://streamer.cryptocompare.com/v2?api_key=3fd910df59aec1532f0d628006650038c746f4a62731a5cf04c3d59f7a31296a")
        this.setSocketEvents()
      }
    },
    setSocketEvents() {
      this.ws.onmessage = (e) => {
        const response = JSON.parse(e.data)
        const responseType = response.TYPE
        const ticket = response.FROMSYMBOL
        const price = response.PRICE
        if (responseType === '5') {
          const ticketIdx = this.tickets.findIndex((item) => item.name === ticket)
          if (price) {
            this.tickets[ticketIdx].price = price
            if (this.selectedTicket.name === ticket) {
              this.selectedTicket.prices.push(price)
            }
          }
        }
        if (responseType === '429') {
          console.log(response)
          // this.closeSocket()
        }
      }
      this.ws.onopen = () => {
        console.log('opened')
      }
      this.ws.onclose = () => {
        console.log('closed')
        this.closeSocket()
      }
    },
    addSubscription(ticket) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        const subMessage = {
          "action": "SubAdd",
          "subs": [`5~CCCAGG~${ticket}~USD`]
        }
        this.ws.send(JSON.stringify(subMessage));
      }
    },
    removeSubscription(ticket) {
      if(this.ws && this.ws.readyState === WebSocket.OPEN) {
        const subMessage = {
          "action": "SubRemove",
          "subs": [`5~CCCAGG~${ticket}~USD`]
        }
        this.ws.send(JSON.stringify(subMessage));
      }
    },
    closeSocket() {
      if (this.ws) {
        this.ws.close()
        this.ws = null
      }
      setTimeout(() => {
        this.initSocket()
      }, 5000)
    },
    setCurrentPage(page) {
      this.currentPage = page
    }
  }
}
</script>
<style scoped>
.card {
  background-color: white;
}
.tickets {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pagination__info {}
.pagination__buttons {
  display: flex;
}
</style>
