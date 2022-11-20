import './BookDetail.page.css'

import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { toast } from 'react-toastify';

import Modal from 'react-modal'

import { genericStylesModal } from '../../utils/customStylesModals';
import { VscChromeClose } from "react-icons/vsc";

import { useAuth } from '../../hooks/useAuth';

import BooksInput from '../Books/BooksInput/BooksInput';
import { getBooksAvailabilityByISBN, putBook, deleteBook } from '../../api/books.api';
import { borrowedBookUsers, borrowBook, findBorrowBook, borrowBookDeleted } from '../../api/borrowedBooks.api';
import { config } from '../../config/config'


Modal.setAppElement('#root')


const BookDetailField = ({ label, value }) => {
  return (
    <div className='a-margin-bottom-16'>
      <span className='a-block a-fs-18'><strong>{label}</strong></span>
      <span className='a-block a-fs-18'>{value}</span>
    </div>
  )
}

export default function BookDetailPage() {
  const [book, setBook] = useState({});
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const { isbn } = useParams();
  const { token } = useAuth()

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    console.log(`AfterOpenModal`)
    refreshBookUsers();
  }


  const findBorrowBookUser = ({ data, user }) => {
    console.log({ data, user })
    const borrowBookFind = data.find(borrowBook => borrowBook.users_library = user);
    return borrowBookFind.id
  }

  const getBookByISBN = isbn => {
    getBooksAvailabilityByISBN(isbn)
      .then(res => {
        console.log({ res })
        if (res.data.length === 0) {
          toast.info(config.toastMessage.bookNotExist)
          return false;
        }
        setBook(res.data[0]);
      })
      .catch(err => {
        toast.error(config.toastMessage.bookAvailabilityByISBN)
        console.error(err)
      });
  }


  const refreshBookUsers = () => {
    borrowedBookUsers({ book: book.isbn }, token)
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }

  const updateQuantity = () => {
    putBook(book.id, { quantity: book.quantity }, token)
      .then(() => {
        toast.info(config.toastMessage.bookQuantityUpdated);
        getBookByISBN(isbn)
      })
      .catch(err => {
        toast.error(config.toastMessage.bookUpdateQuantityError)
        console.log({ err })
      });
  }

  const removeBook = () => {
    if (window.confirm('¿Estás seguro de eliminar el libro?')) {
      deleteBook(book.id, token)
        .then(() => navigate(config.paths.books))
        .catch(err => {
          toast.error(config.toastMessage.bookDeleteError)
          console.error(err)
        });
    }
  }

  const borrowBookUser = ({ user }) => {
    console.log({ book })
    borrowBook({ book, user }, token)
      .then(res => {
        if (res.status === 200) {
          toast.info(config.toastMessage.bookBorrowOK)
        }
        refreshBookUsers();
      })
      .catch(err => {
        toast.error(config.toastMessage.bookBorrowError)
        console.error(err)
      });
  }
  const borrowBookUserDeleted = ({ user }) => {
    console.log({ user })

    const filter = {
      isbn: book.isbn
    }
    // Buscamos el prestamos que tenemos que devolver. 
    findBorrowBook(filter)
      .then(response => {
        console.log({ response })
        const { data } = response
        // Buscamos el ID del libro que queremos devolver 
        const borrowBookDeletedID = findBorrowBookUser({ data, user })
        borrowBookDeleted(borrowBookDeletedID, token)
          .then(res => {
            console.log(`Préstamo devuelto correctamente`)
            refreshBookUsers();
          })
          .catch(err => console.log({ err }))
      })
      .catch(err => console.log(err))


  }

  useEffect(() => {
    getBookByISBN(isbn)
  }, [isbn]);

  const ModalContent = () => {
    return (
      <>
        <header className="Modal__header">
          <button className="a-btn__icon" onClick={closeModal}>
            <VscChromeClose size="34px" />
            <span className="sr-only">Cerrar ventana de dialogo </span>
          </button>
        </header>
        <div className='a-flex a-flex-align-item BookDetailPage__modal-header'>
          <div className='a-flex a-flex-basis-25 BookDetailPage__modal-name'><strong>Nombre</strong></div>
          <div className='a-flex a-flex-basis-50 BookDetailPage__modal-surname'><strong>Apellidos</strong></div>
        </div>
        <ul className='BookDetailPage__modal-list'>
          {
            users.map(user =>
              <li className='a-flex a-flex-align-item a-margin-top-16 BookDetailPage__modal-element' key={user.codeUser}>
                <div className='a-flex a-flex-basis-25 BookDetailPage__modal-name'>{user.name}</div>
                <div className='a-flex a-flex-basis-50 BookDetailPage__modal-surname'>{user.surname}</div>
                <div className='a-flex a-flex-basis-25 BookDetailPage__modal-button-container'>
                  <button className={`a-cta ${user.borrowed || book.leftBooks === 0 ? 'a-cta--disabled' : 'a-cta--blue'} Book__cta BookDetailPage__modal-button`} type='button' disabled={user.borrowed || book.leftBooks === 0} onClick={() => borrowBookUser({ user })}>{user.borrowed ? 'Libro prestado' : 'Prestar libro'}</button>
                  {user.borrowed && (<button className={`a-cta a-cta--blue Book__cta BookDetailPage__modal-button`} onClick={() => borrowBookUserDeleted({ user })}>Devolver Libro</button>)}
                </div>
              </li>
            )
          }
        </ul>
      </>
    )
  }

  return (
    <section className="a-flex">
      <section className="a-p-16 a-flex-basis-25 BookDetailPage__col--left">
        <img src={book.imgURL || 'assets/images/no-image.jpg'} alt='Portada de libro' />
        <form className='a-margin-top-16'>
          <BooksInput
            id='quantity'
            name='quantity'
            type='number'
            layer='Cantidad en la biblioteca:'
            value={book.quantity}
            placeholder='Cantidad de libros en la biblioteca'
            onChange={(e) => setBook({ ...book, quantity: e.target.value })}
          />
          <button className='a-cta Book__cta' type='button' onClick={updateQuantity}>Actualizar cantidad</button>
          <button className={`a-cta ${book.leftBooks === 0 ? 'a-cta--disabled' : 'a-cta--blue'} a-margin-top-16 Book__cta`} type='button' onClick={openModal}>{book.leftBooks > 0 ? 'Prestar libro' : 'Todos prestados'}</button>
          <button className='a-cta a-cta--red a-margin-top-16 Book__cta' type='button' onClick={removeBook}>Eliminar libro</button>
        </form>
      </section>
      <section className="a-p-16 a-flex-basis-75">
        <BookDetailField label='Título' value={book.title} />
        <BookDetailField label='Autor(es)' value={book.author} />
        <BookDetailField label='Categoría(s)' value={book.categories} />
        <BookDetailField label='Descripción' value={book.description} />
      </section>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={genericStylesModal}
        contentLabel="Información del usuario"
      >
        <ModalContent />
      </Modal>

    </section>
  )
}
