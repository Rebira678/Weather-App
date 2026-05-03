import axios from 'axios';

const KEY_1 = "057603310e472705a99339cea9230b58";
const KEY_2 = "d86b24e5b1e69fe2073c0aa8eb38236f";
const location = "London";

async function testWeatherAPI(key) {
  try {
    const response = await axios.get('http://api.weatherapi.com/v1/current.json', {
      params: { key, q: location }
    });
    console.log(`WeatherAPI with ${key}: Success`);
    return true;
  } catch (error) {
    console.log(`WeatherAPI with ${key}: Error - ${error.response?.data?.error?.message || error.message}`);
    return false;
  }
}

async function testOpenWeather(key) {
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { appid: key, q: location }
    });
    console.log(`OpenWeather with ${key}: Success`);
    return true;
  } catch (error) {
    console.log(`OpenWeather with ${key}: Error - ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function runTests() {
  console.log("Testing Key 1:");
  await testWeatherAPI(KEY_1);
  await testOpenWeather(KEY_1);
  
  console.log("\nTesting Key 2:");
  await testWeatherAPI(KEY_2);
  await testOpenWeather(KEY_2);
}

runTests();
