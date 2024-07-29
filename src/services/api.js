import axios from 'axios';

//const baseURL='http://102.130.114.194:10001'
//  const baseURL='http://192.168.196.21:5055'
const baseURL='http://196.41.72.247:8083/WardsCoreApi'


// Create an instance of Axios with custom configurations
export const AxiosInstance = axios.create({
  baseURL: baseURL, // Set a base URL for your API requests
  // timeout: 5000, // Set a timeout for requests (optional)
  headers: {
    'Content-Type': 'application/json',
    //   'Authorization': 'Bearer YourAccessTokenHere' // Example of setting an authorization header
  },
});
