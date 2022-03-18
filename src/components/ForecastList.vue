<template>
  <div class="row">
    <div class="col">
      <div class="row my-4">
        <div class="col">
          <h1 v-if="!has_error">Forecast for <span v-text="city_info.name"></span></h1>
          <h1 v-if="has_error">Failed to find location <code>'<span v-text="current_location"/>'</code>: <span v-text="error_message"/></h1>
        </div>
        <div class="col col-xl-3">
          <div class="input-group mb-3">
            <input type="text" v-model="search" v-on:keyup.enter="searchCity" class="form-control" placeholder="Search for a City" aria-label="Search for a City" aria-describedby="search_button">
            <button class="btn btn-info" type="button" id="search_button" v-on:click="searchCity">Search</button>
          </div>
        </div>
      </div>
      <div class="row" v-if="!has_error">
        <div v-for="day in Object.keys(forecasts_by_day)" class="forecast_day mb-5">
          <h1 v-text="day"></h1>
          <div class="row d-flex flex-nowrap overflow-scroll pb-5 forecast-list-container">
            <forecast-list-item v-for="forecast in forecasts_by_day[day]" v-bind:key="forecast.dt" v-bind:forecast="forecast"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
export default {
  name: "ForecastList",
  props: ['api_key', 'default_location'],
  mounted(){
    //copy the default into the current location and then load the weather info.
    this.current_location = this.default_location;
    this.loadWeather();
  },
  data(){
    return {
      current_location: "",
      search: "",
      has_error: false,
      error_message: "",
      forecasts_by_day: {},
      city_info: {}
    };
  },
  methods: {
    loadWeather(){
      this.forecasts_by_day = {}
      this.error_message = "";
      this.has_error = false;
      let wx_api_url = 'https://api.openweathermap.org/data/2.5/forecast';
      wx_api_url += "?q=" + encodeURIComponent(this.current_location);
      wx_api_url += '&appid=' + encodeURIComponent(this.api_key);
      wx_api_url += "&units=imperial";
      axios.get(wx_api_url).then(response => {
        //we should have weather info back.
        if(response.status === 200 && response.data.cod === "200"){
          this.city_info = response.data.city;
          for (const forecast_index in response.data.list){
            let forecast = response.data.list[forecast_index];
            let forecast_date = moment.unix(forecast.dt).format('dddd, MMMM Do');
            if(!this.forecasts_by_day.hasOwnProperty(forecast_date)){
              this.forecasts_by_day[forecast_date] = [];
            }
            this.forecasts_by_day[forecast_date].push(forecast);
            document.title = "Weather for " + this.city_info.name;
          }
        }
      }).catch(error => {
        this.has_error = true;
        this.error_message = "Failed to fetch weather forecast for " + this.current_location;
        document.title = "Weather Search";
        if(error.response){
          if(error.response.data.message){
            this.error_message = error.response.data.message;
          }
        }
      });
    },
    searchCity(){
      this.current_location = this.search;
      this.loadWeather();
    },
  }
}
</script>
<style scoped>
.forecast-list-container{
  max-height: 100%;
  overflow-y: hidden !important;
}
</style>