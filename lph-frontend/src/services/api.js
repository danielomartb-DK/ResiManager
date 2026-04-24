import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Amenities / Calendar
export const getAmenities = async () => {
  const { data } = await axios.get(`${API_URL}/api/amenities`);
  return data;
};

export const createAmenity = async (amenityData) => {
  const { data } = await axios.post(`${API_URL}/api/amenities`, amenityData);
  return data;
};

// Se pueden añadir más servicios aquí (PQRS, Unidades, etc.)
