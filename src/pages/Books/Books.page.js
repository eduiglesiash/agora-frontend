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
  const closeModal = () => setIsOpen(false);
  const afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    console.log(`AfterOpenModal`)
  }


  const formBooksValues = useFormik({
    initialValues: intiValuesFormBooks,
    validate: values => {
      const errors = '';
      return errors
    },
    onSubmit: values => {
      // TODO: Aquí me he quedado. Tengo que guardar el libro que hayamos metido
      const { isbn } = values;
      // Comprobar si el libro ya existe en la BBDD. 
      // if (isFormCorrect()) {
      const filter = {
        isbn: formBooksValues.isbn,
      };
      token && strapi.findBooks(new URLSearchParams(filter).toString(), token)
        .then(res => {
          if (res.data.length > 0) {
            alert('El libro ya está guardado en la base de datos');
            return false;
          }
          token && strapi.createBook({ ...formBooksValues, available: formBooksValues.quantity > 0 }, token)
            .then(res => {
              if (res.status === 200)
                closeModal();
            })
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
      // }
      // Si existe lanzamos mensaje de aviso
      // Si no existe lo guardamos directamente en la BBDD

    },
    onReset: () => { }
  })

  const formISBNValues = useFormik({
    initialValues: intiValueISBN,
    onSubmit: values => {
      clearForm();
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

  const formErrors = useFormik({
    initialValues: initialValuesError,
    onSubmit: values => { },
    onReset: () => { }
  })


  const clearForm = () => {
    console.log(`clearForm`)
  };

  useEffect(() => {
    clearForm();
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

  // const searchIsbn = () => {
  //   clearForm();
  //   setLoadingForm(true);
  //   strapi.getBookByISBN(formBooksValues.isbn)
  //     .then((res) => {
  //       if (res.data.totalItems === 0) {
  //         setLoadingForm(false);
  //         return alert('ISBN NO ENCONTRADO, INTRODUCIR LOS DATOS EN EL FORMULARIO');
  //       }
  //       return updateFormData({ res: res.data.items[0] })
  //     });
  // }

  const isFormCorrect = () => {
    let error = false;
    let obj = {
      isbn: '',
      title: '',
      author: '',
      categories: '',
      description: '',
      quantity: '',
    };
    if (formBooksValues.isbn === '') {
      error = true;
      obj = { ...obj, isbn: 'El ISBN es obligatorio' };
    }
    if (formBooksValues.title === '') {
      error = true;
      obj = { ...obj, title: 'El título es obligatorio' };
    }
    if (formBooksValues.quantity === undefined || formBooksValues.quantity === '') {
      error = true;
      obj = { ...obj, quantity: 'Es obligatorio introducir el número de libros que se disponen' };
    }
    formErrors.setErrors(obj);
    return !error;
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
          <button className="a-btn__icon" onClick={() => { closeModal(); clearForm() }}>
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
            error={formErrors.title}
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
            error={formErrors.author}
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
            error={formErrors.categories}
          />
          <BooksTextarea
            id='description'
            classes='Book__description'
            name='description'
            layer='Descripción'
            value={formBooksValues.values.description}
            placeholder='Descripción del libro'
            onChange={formBooksValues.handleChange}
            error={formErrors.description}
          />
          <BooksInput
            id='quantity'
            name='quantity'
            type='number'
            layer='Cantidad'
            value={formBooksValues.values.quantity}
            placeholder='Cantidad de libros'
            onChange={formBooksValues.handleChange}
            error={formErrors.quantity}
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
