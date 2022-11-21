export const config = {
  paths: {
    tempPage: '/temp-page',
    root: '/',
    dashboard: '/',
    books: '/books',
    users: '/users',
    userDetail: '/detail',
    login: '/auth/login',
    bookDetail: '/bookDetail',
    borrowedBooks: '/borrowedBooks'
  },
  colorTags: {
    success: 'Tag__success',
    info: 'Tag__info',
    warning: 'Tag__warning',
    alert: 'Tag__alert'
  },
  strapi: {
    production: 'https://strapi.matadealcantara.com'
  },
  googleApi: {
    url: `https://www.googleapis.com/books/v1/volumes?q=isbn:`,
    apiOptions: `&maxResults=1`
  },
  toastMessage: {
    getUsersError: `No se ha podido establecer conexión con la BBDD correctamente \n`,
    getUserByIDError: `No se ha podido recuperar al información del usuario \n`,
    userRegistered: `El usuario ya está registrado, \n`,
    userRegisterSuccess: `El usuario se ha registrado correctamente \n`,
    userRegisterError: `No se ha podido registrar el usuario: \n`,
    userDeleteSuccess: `El usuario se ha eliminado correctamente \n`,
    userDeleteError: `El usuario no se ha podido eliminar \n`,
    userUpdateError: `No se ha podido actualizar la información del usuario \n`,
    userUpdateSuccess: `La información se ha actualizado correctamente \n`,
    getBooksErrors: `No hemos podido conectar con la BBDD de los libros \n`,
    loginError: `Usuario y/o contraseña incorrectos \n`,
    loginSuccess: `Usuario logado correctamente \n`,
    loginLogout: `Se ha cerrado la sesión correctamente \n`,
    ISBNNotFound: `ISBN no encontrado, introduce los datos en el formulario\n`,
    bookExist: `El libro ya está guardado en la base de datos\n`,
    bookCreated: `Libro añadido a la base de datos\n`,
    bookFindError: `No hemos podido buscar en libro en la BBDD, por favor, prueba de nuevo\n`,
    bookCreatedError: `No se ha podido guardar el libro en la base de datos\n`,
    bookDeleteError: `No se ha podido borrar el libro, por favor, inténtalo de nuevo\n`,
    bookNotExist: `El libro no existe en la base de datos\n`,
    bookQuantityUpdated: `La cantidad del libro se ha actualizado correctamente\n`,
    bookAvailabilityByISBN: `No se ha podido recuperar la disponibilidad del libro a través del ISBN\n`,
    bookUpdateQuantityError: `No se ha podido actualizar la cantidad de libros de la biblioteca\n`,
    bookBorrowOK: `El libro se ha prestado correctamente\n`,
    bookBorrowError: `No se ha podido prestar el libro correctamente \n`,
    borrowBookDeletedOK: `El Libro se ha devuelto correctamente\n`,
    borrowBookDeletedError: `El libro no se ha podido devolver 🤷‍♂️ \n`
  }
};
