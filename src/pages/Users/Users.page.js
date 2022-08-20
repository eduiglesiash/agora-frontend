import './Users.page.css';
import { config } from '../../config/config';
import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid'
import { toast } from 'react-toastify';
import Modal from 'react-modal'
import { VscChromeClose } from "react-icons/vsc";

import CardUser from '../../components/CardUser/CardUser';
import * as strapi from '../../api/users.api';
import { useFormik } from 'formik';
import { useAuth } from '../../hooks/useAuth';
import { genericStylesModal } from '../../utils/customStylesModals';

Modal.setAppElement('#root')

const initialValues = {
  name: '',
  surname: '',
  phone: '',
  email: '',
  isMinor: 'false'
}

export default function UsersPage() {

  const [users, setUsers] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const resetForm = () => {
    registerUser.resetForm({
      name: '',
      surname: '',
      phone: '',
      email: '',
      isMinor: ''
    });
  }
  const afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    console.log(`AfterOpenModal`)
  }

  const auth = useAuth();

  useEffect(() => {
    auth.token && strapi.getUsers(auth.token)
      .then(users => {
        setUsers(users.data);
      })
      .catch(err => toast.error(`${config.toastMessage.getUsersError}: \n ${err}`));
  }, [auth, modalIsOpen]);

  const registerUser = useFormik({
    initialValues,
    onSubmit: values => {
      const isUserRegistred = users.find(user => values.phone === Number(user.phone));
      console.log({ isUserRegistred })
      console.log({ values })
      if (!isUserRegistred || values.isMinor === 'true') {
        const codeUser = nanoid();
        strapi.addUser({ ...values, codeUser, 'totalBookRead': 0 })
          .then(user => {
            setUsers([...users, user.data]);
            toast.success(config.toastMessage.userRegisterSuccess);
          })
          .catch(err => toast.error(`${config.toastMessage.userRegisterError}\n ${err}`, {
            position: toast.POSITION.BOTTOM_CENTER
          }));
      } else {
        toast.error(config.toastMessage.userRegistered, {
          position: toast.POSITION.TOP_CENTER
        });
      }
    },
    onReset: () => {
      console.log('Reset form');
      closeModal()
    }
  });

  return (
    <>
      <section className="a-p-16 a-flex a-flex-center">
        <button type='button' className='a-btn__add a-btn--blue ' onClick={openModal}><span className='a-visually-hidden'>Dar de alta un usuario</span></button>
      </section>
      <section className="a-p-16 a-flex a-flex-column">
        {
          users.map(user => (<CardUser
            key={user.id}
            userId={user.id}
            codeUser={user.codeUser}
            email={user.email}
            name={user.name}
            phone={user.phone}
            surname={user.surname}
            totalBookRead={user.totalBookRead}
            avatar={user.avatar}
            created_at={user.created_at}
          />))
        }
      </section>

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={genericStylesModal}
        contentLabel="Información del usuario"
      >
        <header className="Modal__header">
          <button className="a-btn__icon" onClick={resetForm}>
            <VscChromeClose size="34px" />
            <span className="sr-only">Cerrar ventana de dialogo </span>
          </button>
        </header>
        <section>
          <form onSubmit={registerUser.handleSubmit} onReset={registerUser.handleReset}>
            <fieldset>
              <legend className="a-text-center a-margin-bottom-16 a-form__legend">Registro de usuarios de la biblioteca</legend>

              <fieldset className="a-form__fieldset-radio">
                <legend className="a-form__legend-radio">¿Es menor de edad? (Obligatorio)</legend>
                <label className="a-form__radio">
                  <span className="a-form__radio-text">SI</span>
                  <input name="isMinor" type="radio"
                    onChange={registerUser.handleChange}
                    value='true' required />
                </label>
                <label className="a-form__radio">
                  <span className="a-form__radio-text">NO</span>
                  <input name="isMinor" type="radio"
                    onChange={registerUser.handleChange}
                    value="false" required />
                </label>
              </fieldset>


              <label><span>Nombre (Obligatorio)</span>
                <input name="name" type="text"
                  onChange={registerUser.handleChange}
                  value={registerUser.values.name} required />
              </label>

              <label htmlFor="surname">
                <span>Apellidos (Obligatorio)</span>
                <input name="surname" type="text"
                  value={registerUser.values.surname}
                  onChange={registerUser.handleChange} required />
              </label>

              <label>
                <span>Teléfono (Obligatorio)</span>
                <input name="phone" type="number"
                  maxLength="9"
                  value={registerUser.values.phone}
                  onChange={registerUser.handleChange} required />
              </label>

              <label>
                <span>Dirección de email</span>
                <input name="email" type="email"
                  value={registerUser.values.email}
                  onChange={registerUser.handleChange} />
              </label>


            </fieldset>
            <div className="a-flex a-flex-center a-flex-gap16">
              <button type="reset" className="a-btn__cancel">Cancelar</button>
              <button type="submit" className="a-btn__action">Registrar</button>
            </div>
          </form>
        </section>

      </Modal>
    </>
  );
}
