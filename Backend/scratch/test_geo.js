import axios from 'axios';

const apiKey = 'd86b24e5b1e69fe2073c0aa8eb38236f';
const query = 'London';

async function test() {
  try {
    const response = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
      params: {
        q: query,
        limit: 5,
        appid: apiKey
      }
    });
    console.log('Suggestions:', response.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

test();
