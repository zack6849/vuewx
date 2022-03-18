import { createApp } from 'vue'
import App from './App.vue'
import ForecastsComponent from "./components/ForecastsComponent.vue";
import ForecastComponent from "./components/ForecastComponent.vue";

const app = createApp(App);

app.component('forecasts-component', ForecastsComponent);
app.component('forecast-component', ForecastComponent);
app.mount('#app');