import axios from 'axios';
import {config} from '../config/config';

export const findBook = ({ filter }) => {
    console.log('FILTER', filter);
    return axios.get(`${config.strapi.production}/borrowed-books/${filter || ''}`)
}
export const borrowBook = ({ book, user }) => axios.post(`${config.strapi.production}/borrowed-books`, { library: book.id, users_library: user.id });
export const borrowedBookUsers = ({ book }) => axios.get(`${config.strapi.production}/borrowed-books/users/${book}`);