const axios = require('axios');

async function fetchSampleRemote() {
  // realistic external API call
  const res = await axios.get('https://jsonplaceholder.typicode.com/todos/', {
    timeout: 5000,
  });
  return res.data;
}

module.exports = { fetchSampleRemote };
