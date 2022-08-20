import axios from 'axios';
import {config} from '../config/config';

export const getBooks = () => axios.get(`${config.strapi.production}/libraries`);
export const getBooksAvailabilityByISBN = (isbn) => axios.get(`${config.strapi.production}/libraries/availability/${isbn || ''}`);
export const findBooks = (filter) => axios.get(`${config.strapi.production}/libraries?${filter}`);
export const createBook = (book) => axios.post(`${config.strapi.production}/libraries`, book);
export const deleteBook = (bookId) => axios.delete(`${config.strapi.production}/libraries/${bookId}`);
export const putBook = (bookId, update) => axios.put(`${config.strapi.production}/libraries/${bookId}`, update);
export const getBookByISBNFromGoogle = (isbn) => axios.get(`${config.googleApi.url}${isbn}${config.googleApi.apiOptions}`)

