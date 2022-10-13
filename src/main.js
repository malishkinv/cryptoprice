import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";
import ApiService from "@/services/api.service.js";
import './index.css'

const app = createApp(App);

app.use(router);
app.use(VueAxios, axios);

ApiService.init("https://min-api.cryptocompare.com/data");
ApiService.setHeader();

app.mount("#app");
