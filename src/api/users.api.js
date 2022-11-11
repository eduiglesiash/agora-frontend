import axios from 'axios';
import { config } from '../config/config';


export const getUsers = (token) => axios.get(`${config.strapi.production}/users-libraries`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
export const countUsers = () => axios.get(`${config.strapi.production}/libraries/countexit`)
export const getUserByID = (userId) => axios.get(`${config.strapi.production}/users-libraries/${userId}`)
export const updateUser = (user, token) => axios.put(`${config.strapi.production}/users-libraries/${user.id}`, user, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
export const addUser = (user, token) => axios.post(`${config.strapi.production}/users-libraries`, user, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
export const deleteUser = (userId) => axios.delete(`${config.strapi.production}/users-libraries/${userId}`)
