import './UserDetail.page.css';
import { useState, useEffect } from 'react';
import Avatar from '../../components/Avatar/Avatar';
import Book from '../../components/Book/Book';
import * as strapi from '../../api/users.api';
import Modal from 'react-modal';
import { VscChromeClose } from 'react-icons/vsc';
import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import { config } from '../../config/config';
import { genericStylesModal } from '../../utils/customStylesModals';



Modal.setAppElement('#root');

const initialValues = {
  name: '',
  surname: '',
  phone: '',
  email: ''
}

export default function UserDetailPage() {
  const [user, setUser] = useState({});
  const [formModified, setFormModified] = useState(false)
  const [modalIsOpen, setIsOpen] = useState(false);
  const navigation = useNavigate();
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  let { id } = useParams();

  const getUserId = () => {
    strapi.getUserByID(id)
      .then(user => {
        const { name, surname, phone, email } = user.data
        setUser(user.data);
        updateFormUser.setValues({ name, surname, phone, email });
      })
      .catch(err => toast.error(`${config.toastMessage.getUserByIDError} ${err}`));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  const formDeleteUser = useFormik({
    initialValues: { confirm: '' },
    validate: values => {
      const VALIDATED = 'borrar/usuario';
      const valueFormat = values.confirm.toLowerCase().trim();
      const errors = {};
      if (!values.confirm) {
        errors.confirm = 'Tiene que rellenar el campo';
      } else if (valueFormat !== VALIDATED) {
        errors.confirm = 'La validación no coincide';
      }
      return errors;
    },
    onSubmit: () => {
      console.log(`On Submit`);
      strapi.deleteUser(user.id)
        .then(() => {
          // console.log({ user })
          navigation(config.paths.users);
          closeModal();
          toast.success(config.toastMessage.userDeleteSuccess);
        })
        .catch(err => toast.error(`${config.toastMessage.userDeleteError} ${err}`));

    },
    onReset: () => closeModal()
  });

  const formValidateClassError = classNames({
    'a-form__errorInput': formDeleteUser.errors.confirm,
    'a-form__success': !formDeleteUser.errors.confirm
  });

  const updateFormUser = useFormik({
    initialValues,
    validate: val => {

      const isModified = val.name !== user.name ||
        val.surname !== user.surname ||
        val.phone !== user.phone ||
        val.email !== user.email;

      setFormModified(isModified)
      const errors = {};
      return errors;
    },
    onSubmit: values => {
      strapi.updateUser({ ...user, ...values })
        .then(userUpdated => {
          setUser(userUpdated.data);
          toast.info(`${config.toastMessage.userUpdateSuccess}`)
        })
        .catch(err => toast.error(`${config.toastMessage.userUpdateError}\n ${err}`));
    },
    onReset: () => {
      getUserId()
    }
  });

  useEffect(() => {
    getUserId()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <section className="Upd__content">
        <section className="a-p-16">
          <Avatar thumbnail={user.avatar} />
          <form onSubmit={updateFormUser.handleSubmit} onReset={updateFormUser.handleReset}>
            <fieldset>
              <legend className="sr-only"> Datos Personales</legend>
              <div>
                <label htmlFor="mainName">Nombre</label>
                <input id="name" name="name" type="text"
                  value={updateFormUser.values.name}
                  onChange={updateFormUser.handleChange} />
              </div>
              <div>
                <label htmlFor="surname">Apellidos</label>
                <input id="surname" name="surname" type="text"
                  value={updateFormUser.values.surname}
                  onChange={updateFormUser.handleChange} />
              </div>
              <div>
                <label htmlFor="phone">Teléfono</label>
                <input id="phone" name="phone" type="number"
                  value={updateFormUser.values.phone}
                  onChange={updateFormUser.handleChange} />
              </div>
              <div>
                <label htmlFor="email">Dirección de email</label>
                <input id="email" name="email" type="email"
                  value={updateFormUser.values.email}
                  onChange={updateFormUser.handleChange} />
              </div>
            </fieldset>
            {
              formModified &&
              <div className="Upd__content-btn">
                <button type="reset" className="Upd__btn Upd__btn--cancel a-bk-red">Descartar cambios</button>
                <button type="submit" className="Upd__btn Upd__btn--success a-bk-green">Guardar cambios</button>
              </div>
            }
          </form>
        </section>
        <section className="a-p-16">
          <ul className="Upd__table">
            <li>
              <p>112132342-M</p>
              <p>Desde: 1/Ago/2020</p>
            </li>
            <li>
              <p>Libros totales: 88</p>
              <p>Libros prestados: 2</p>
            </li>
            <li>
              <p>Próximo vencimiento: </p>
              <p>4/OCT/2021</p>
            </li>
          </ul>
        </section>
        <section className="a-p-16">
          <h2>Libros leídos</h2>
          <Book />
        </section>
      </section>
      <section className="Upd__warning-zone a-flex a-flex-column a-flex-center a-margin-bottom-16">
        <h2 className="a-red a-text-center a-margin-bottom-16">Zona peligrosa</h2>
        <button type="button" className="a-btn__delete" onClick={openModal}>Borrar usuario</button>
      </section>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={genericStylesModal}
        contentLabel="Zona peligrosa | Borrar usuario"
      >
        <header className="a-flex a-flex-end">
          <button className="a-btn__icon" onClick={closeModal}>
            <VscChromeClose size="34px" />
            <span className="sr-only">Cerrar ventana de dialogo </span>
          </button>
        </header>
        <section>

          <form onSubmit={formDeleteUser.handleSubmit} onReset={formDeleteUser.handleReset}>
            <fieldset>
              <legend className="a-form__legend">
                <h4>¿Estas seguro/a que deseas eliminar este usuario?</h4>
                <p>La eliminación del usuario es irreversible</p>
              </legend>
              <div className="a-margin-bottom-16">
                <label htmlFor="email">
                  Para eliminar el usuario tienes que escribir el siguiente texto en el
                  campo: <strong>borrar/usuario</strong>
                </label>
                <input id="confirm" name="confirm" type="text" className={formValidateClassError}
                  value={formDeleteUser.values.confirm}
                  onChange={formDeleteUser.handleChange} required />
                {
                  formDeleteUser.errors.confirm
                  && <p className="a-form__errorText">{formDeleteUser.errors.confirm}</p>
                }
              </div>

            </fieldset>
            <div className="a-flex a-flex-center">
              <button type="reset" className="a-btn__cancel">Cancelar</button>
              <button type="submit" className="a-btn__action">Borrar</button>
            </div>
          </form>
        </section>
      </Modal>
    </>
  );
}
