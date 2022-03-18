import { createApp } from 'vue'
import App from './App.vue'
import ForecastList from "./components/ForecastList.vue";
import ForecastListItem from "./components/ForecastListItem.vue";

const app = createApp(App);

app.component('forecasts-list', ForecastList);
app.component('forecast-list-item', ForecastListItem);
app.mount('#app');