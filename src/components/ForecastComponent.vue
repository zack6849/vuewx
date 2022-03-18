<template>
  <div class="forecast-wrapper col-4" :class="expanded? 'forecast-expanded' : 'forecast-collapsed' " v-on:click="expanded = !expanded">
    <div class="row">
      <div class="col">
        <img v-bind:src="weather_icon_url" v-bind:alt="weather_description">
        <span class="forecast-description" v-text="forecast.weather.description"/>
      </div>
      <div class="col d-flex justify-content-end">
        <span v-if="!expanded" v-text="effective_time"/>
        <span v-if="expanded" v-text="full_time"/>
      </div>
      <div class="row">
        <div class="col">
          High: <span v-text="high_temp"/>
          Low: <span v-text="low_temp"/>
        </div>
      </div>
      <div class="row" v-if="expanded">
        <div class="col">
          Humidity: <span v-text="humidity"/>%
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "ForecastComponent",
  props: ['forecast'],
  data(){
    return {
      weather_icon_url: "",
      weather_description: "",
      effective_time: "",
      full_time: "",
      high_temp: 0,
      low_temp: 0,
      expanded: false,
    }
  },
  mounted() {
    let time = moment.unix(this.forecast.dt);
    if(this.forecast.weather && this.forecast.weather.length === 1){
      this.forecast.weather = this.forecast.weather[0];
      this.weather_icon_url = "http://openweathermap.org/img/wn/" + this.forecast.weather.icon + "@2x.png"
      this.weather_description = this.forecast.weather.description;
      this.effective_time = time.format('dddd @ h:mmA');
      this.full_time = time.format("dddd, MMMM Do [at] h:mmA")
      this.high_temp = Math.round(this.forecast.main.temp_max);
      this.low_temp = Math.round(this.forecast.main.temp_min);
      this.humidity = this.forecast.main.humidity;
    }else{
      if(!this.forecast.weather){
        this.weather_description = "Failed to fetch weather";
        this.high_temp = -1;
        this.low_temp = -1;
        this.humidity = -1;
        this.weather_icon_url = "";
      }
      console.log("Got unexpected weather data, length: " + this.forecast.weather.length);
    }
  }
}
</script>

<style scoped>
  .forecast-wrapper{
    background-color: rgba(255,255,255,0.15);
    margin-left: 10px;
    margin-right: 10px;
  }
  .forecast-description{
    text-transform: capitalize;
  }
  .forecast-wrapper{
    cursor: pointer;
  }
  /** make the expanded forecast lighter so it's clear it's been expanded. **/
  .forecast-expanded{
    background-color: rgba(255,255,255,0.40);
  }
</style>