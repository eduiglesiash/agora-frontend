import axios from 'axios';
import { config } from '../config/config';

const headersFn = tokenString => {
    return {
        headers: {
            Authorization: `Bearer ${tokenString}`
        }
    }
}

export const findBorrowBook = ({ filter }) => {
    console.log('FILTER', filter);
    return axios.get(`${config.strapi.production}/borrowed-books/${filter || ''}`)
}
export const borrowBook = ({ book, user }, token) => axios.post(`${config.strapi.production}/borrowed-books`, { library: book.id, users_library: user.id }, headersFn(token));

export const borrowBookDeleted = (id, token) => axios.delete(`${config.strapi.production}/borrowed-books/${id}`, headersFn(token));

export const borrowedBookUsers = ({ book }, token) => axios.get(`${config.strapi.production}/borrowed-books/users/${book}`, headersFn(token));