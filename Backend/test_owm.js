import { getWeatherData } from './src/services/weatherService.js';

async function testMapping() {
  try {
    console.log('Testing with real API (Adama)...');
    const data = await getWeatherData('Adama');
    console.log('Success!');
    console.log('Location:', data.location.name, data.location.country);
    console.log('Current Temp:', data.current.temp_c, 'Condition:', data.current.condition.text);
    console.log('Forecast Days:', data.forecast.forecastday.length);
    console.log('First Forecast Day:', data.forecast.forecastday[0].date, data.forecast.forecastday[0].day.maxtemp_c);
  } catch (error) {
    console.error('Test Failed:', error.message);
  }
}

testMapping();
