import './Books.page.css'
import * as strapi from '../../api/books.api'
import Book from '../../components/Book/Book'
import { useState, useEffect } from 'react'
import { VscChromeClose } from "react-icons/vsc";

import { toast } from 'react-toastify'
import { config } from '../../config/config'


import BooksInput from './BooksInput/BooksInput';
import BooksTextarea from './BooksTextarea/BooksTextarea';
import Modal from 'react-modal'
import { genericStylesModal } from '../../utils/customStylesModals';
import { useFormik } from 'formik';
import { useAuth } from '../../hooks/useAuth';


Modal.setAppElement('#root')

const intiValuesFormBooks = {
  isbn: '',
  title: '',
  author: '',
  imgURL: '',
  categories: '',
  description: '',
  quantity: undefined,
}

const intiValueISBN = {
  isbn: ''
}

const initialValuesError = {
  isbn: '',
  title: '',
  author: '',
  categories: '',
  description: '',
  quantity: '',
}

export default function BooksPage() {
  const [books, setBooks] = useState([])
  const [modalIsOpen, setIsOpen] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);

  const { token } = useAuth()

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false)
    resetForm()
  };
  const afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    console.log(`AfterOpenModal`)
  }
  const resetForm = () => {
    formBooksValues.resetForm(intiValuesFormBooks);
  }

  const formISBNValues = useFormik({
    initialValues: intiValueISBN,
    onSubmit: values => {
      setLoadingForm(true);
      strapi.getBookByISBNFromGoogle(values.isbn)
        .then((response) => {
          const { items } = response.data;
          if (items) {
            return updateFormData({ bookInfo: { ...items[0], isbn: values.isbn } })
          } else {
            setLoadingForm(false);
            toast.error(config.toastMessage.ISBNNotFound);
            return false
          }
        });
    },
    onReset: () => { },
    validate: () => { }
  })

  const formBooksValues = useFormik({
    initialValues: intiValuesFormBooks,
    validate: values => {
      const errors = '';
      return errors
    },
    onSubmit: values => {
      const { isbn } = values;

      const filter = { isbn };
      // Comprobar si el libro ya existe en la BBDD. 
      token && strapi.findBooks(new URLSearchParams(filter).toString(), token)
        .then(res => {
          if (res.data.length > 0) {
            // Si ya existe devolvemos un mensaje cerramos la modal
            toast.info(config.toastMessage.bookExist);
            closeModal();
            return false;
          }
          // Si no existe lo creamos. 
          token && strapi.createBook({ ...formBooksValues.values, available: formBooksValues.values.quantity > 0 }, token)
            .then(res => {
              if (res.status === 200) {
                toast.done(config.toastMessage.bookCreated);
                strapi.getBooksAvailabilityByISBN().then(res => setBooks(res.data))
              }
              closeModal();
            })
            .catch(err => {
              toast.error(config.toastMessage.bookCreatedError)
              console.error(err)
              closeModal();
            });
        })
        .catch(err => {
          toast.error(config.toastMessage.bookFindError)
          console.error(err)
          closeModal();
        });
      // }
      // Si existe lanzamos mensaje de aviso
      // Si no existe lo guardamos directamente en la BBDD

    },
    onReset: () => { }
  })



  const formErrors = useFormik({
    initialValues: initialValuesError,
    onSubmit: values => { },
    onReset: () => { }
  })


  useEffect(() => {
    strapi.getBooksAvailabilityByISBN().then(res => setBooks(res.data))
  }, []);


  const updateFormData = ({ bookInfo }) => {
    console.log({ bookInfo })
    const authors = bookInfo.volumeInfo.authors?.reduce((acc, elem) => {
      acc += `${elem}, `;
      return acc;
    }, '');
    const categories = bookInfo.volumeInfo.categories?.reduce((acc, elem) => {
      acc += `${elem}, `;
      return acc;
    }, '');

    const { isbn } = bookInfo;
    const { title, imageLinks, description } = bookInfo.volumeInfo

    const obj = {
      isbn,
      title,
      author: authors?.substring(0, authors.length - 2),
      imgURL: imageLinks?.thumbnail,
      categories: categories?.substring(0, categories.length - 2),
      description,
    }
    formBooksValues.setValues({ ...formBooksValues, ...obj });
    setLoadingForm(false);
  }

  return (
    <section className="a-p-16 a-flex a-flex-column">
      {
        books.map(book => <Book
          key={book.id}
          id={book.id}
          title={book.title}
          author={book.author}
          imgURL={book.imgURL}
          leftBooks={book.leftBooks}
          isbn={book.isbn}
        />)
      }
      <button type='button' className='a-btn__add' onClick={openModal}><span className='a-visually-hidden'>Añadir nuevo libro</span></button>

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={genericStylesModal}
        contentLabel="Añadir un nuevo libro"
      >
        <header className="Modal__header">
          <button className="a-btn__icon" onClick={() => { closeModal() }}>
            <VscChromeClose size="34px" />
            <span className="sr-only">Cerrar ventana de dialogo </span>
          </button>
        </header>
        <form className='Modal-form' onSubmit={formISBNValues.handleSubmit} onReset={formISBNValues.handleSubmit}>
          <BooksInput
            id='isbn'
            name='isbn'
            type='text'
            layer='Buscar por ISBN'
            value={formISBNValues.isbn}
            placeholder='ISBN'
            onChange={formISBNValues.handleChange}
          />
          <button className='a-cta Book__cta' type='submit'>Buscar por ISBN</button>
        </form>
        <form className='Modal-form' onSubmit={formBooksValues.handleSubmit} onReset={formBooksValues.handleSubmit}>
          <p className='a-fs-18 a-fw-700 Book__paragraph'>En caso que no se encuentre la información a través del ISBN o no dispongas del mismo, introduce los datos:</p>
          <BooksInput
            id='title'
            name='title'
            type='text'
            layer='Título'
            value={formBooksValues.values.title}
            placeholder='Título del libro'
            onChange={formBooksValues.handleChange}
            error={formErrors.values.title}
          />
          <BooksInput
            id='author'
            name='author'
            type='text'
            layer='Autor'
            value={formBooksValues.values.author}
            placeholder='Autor del libro'
            helpText='Si hay varios autores, separar por comas'
            onChange={formBooksValues.handleChange}
            error={formErrors.values.author}
          />
          <BooksInput
            id='imgURL'
            name='imgURL'
            type='text'
            layer='Imagen'
            value={formBooksValues.values.imgURL}
            placeholder='Url de la imagen del libro'
            helpText='Si no se dispone de imagen, dejar en blanco'
            onChange={formBooksValues.handleChange}
          />
          <BooksInput
            id='categories'
            name='categories'
            type='text'
            layer='Categorías'
            value={formBooksValues.values.categories}
            placeholder='Categorías a las que pertenece el libro'
            helpText='Si hay varias categorías, separar por comas'
            onChange={formBooksValues.handleChange}
            error={formErrors.values.categories}
          />
          <BooksTextarea
            id='description'
            classes='Book__description'
            name='description'
            layer='Descripción'
            value={formBooksValues.values.description}
            placeholder='Descripción del libro'
            onChange={formBooksValues.handleChange}
            error={formErrors.values.description}
          />
          <BooksInput
            id='quantity'
            name='quantity'
            type='number'
            layer='Cantidad'
            value={formBooksValues.values.quantity}
            placeholder='Cantidad de libros'
            onChange={formBooksValues.handleChange}
            error={formErrors.values.quantity}
          />
          <button className='a-btn__action' type='submit'>Guardar libro</button>
          {
            loadingForm && (<span className='Modal-loading' aria-hidden='true'><span className="Modal__loading"></span></span>)
          }
        </form>
      </Modal>
    </section>
  )
}
