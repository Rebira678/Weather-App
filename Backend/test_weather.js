import axios from 'axios';

const WEATHER_API_KEY = "057603310e472705a99339cea9230b58";
const location = "Adama";

async function testWeather() {
  try {
    const response = await axios.get('http://api.weatherapi.com/v1/forecast.json', {
      params: {
        key: WEATHER_API_KEY,
        q: location,
        days: 5,
        aqi: 'no',
        alerts: 'no'
      }
    });
    console.log('Success:', response.data.location.name, response.data.current.temp_c);
  } catch (error) {
    console.log('Error:', error.response?.data?.error?.message || error.message);
  }
}

testWeather();
