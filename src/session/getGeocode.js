import axios from 'axios';
//ersi map
const GEOCODE_URL =
  'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';

export const getGeocode = async address => {
  const params = {
    SingleLine: address,
    f: 'json', // Return response as JSON
    // outFields: '*', // Fetch all available fields
    // maxLocations: 500, // Set limit for suggestions
    // Optionally include your API key here
    // token: 'YOUR_ESRI_API_KEY'
  };

  try {
    const response = await axios.get(GEOCODE_URL, {params});
    return response.data.candidates;
  } catch (error) {
    console.log('Error fetching geocode:', error);
    return [];
  }
};
