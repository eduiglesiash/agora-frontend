import axios from 'axios';
import { config } from '../config/config';

const headersFn = tokenString => {
    return {
        headers: {
            Authorization: `Bearer ${tokenString}`
        }
    }
}

export const getBooks = () => axios.get(`${config.strapi.production}/libraries`);
export const getBooksAvailabilityByISBN = (isbn) => axios.get(`${config.strapi.production}/libraries/availability/${isbn || ''}`);
export const findBooks = (filter, token) => axios.get(`${config.strapi.production}/libraries?${filter}`, headersFn(token));
export const createBook = (book, token) => axios.post(`${config.strapi.production}/libraries`, book, headersFn(token));
export const deleteBook = (bookId, token) => axios.delete(`${config.strapi.production}/libraries/${bookId}`, headersFn(token));
export const putBook = (bookId, update, token) => axios.put(`${config.strapi.production}/libraries/${bookId}`, update, headersFn(token));
export const getBookByISBNFromGoogle = (isbn) => axios.get(`${config.googleApi.url}${isbn}${config.googleApi.apiOptions}`)

