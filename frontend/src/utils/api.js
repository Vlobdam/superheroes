import axios from "axios";

const BASE_URL = "http://localhost:3001";

export const fetchHeroesApi = async (page = 1, limit = 5) => {
  try {
    const response = await axios.get(`${BASE_URL}/heroes?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const fetchHeroDetailsApi = async (heroId) => {
  try {
    const response = await axios.get(`${BASE_URL}/heroes/${heroId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const addHeroApi = async (data) => {
  const formData = new FormData();

  formData.append('nickname', data.nickname);
  formData.append('real_name', data.real_name);
  formData.append('origin_description', data.origin_description);
  formData.append('superpowers', data.superpowers);
  formData.append('catch_phrase', data.catch_phrase);

  data.images.forEach((file) => {
    formData.append('images', file);
  });

  try {
    const response = await axios.post(`${BASE_URL}/heroes`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response
  } catch (error) {
    throw error;
  }
}

export const updateHeroApi = async (heroId, data) => {
  const formData = new FormData();

  formData.append('nickname', data.nickname);
  formData.append('real_name', data.real_name);
  formData.append('origin_description', data.origin_description);
  formData.append('superpowers', data.superpowers);
  formData.append('catch_phrase', data.catch_phrase);
  formData.append('deleted_images', data.deleted_images);
  
  data.images.forEach((file) => {
    formData.append('images', file);
  });

  try {
    const response = await axios.put(`${BASE_URL}/heroes/${heroId}`, formData);
    return response
  } catch (error) {
    throw error;
  }
}

export const deleteHeroApi = async (heroId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/heroes/${heroId}`);
    return response
  } catch (error) {
    throw error;
  }
}

