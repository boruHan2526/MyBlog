import { createApp, provide } from "vue";
import "./style.css";
import App from "./App.vue";
import naive from "naive-ui";
import { createPinia } from "pinia";
import { router } from "./common/router";
import axios from 'axios'

/**
 * axios
 * pinia
 * sass
 * vue-router
 * navie-ui
 * wangeditor
 */

axios.defaults.baseURL = "http://localhost:8080"

const app = createApp(App);

app.provide("axios", axios)
app.use(naive);
app.use(createPinia());
app.use(router);
app.mount("#app");
