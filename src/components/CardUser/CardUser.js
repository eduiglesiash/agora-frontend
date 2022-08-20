import './CardUser.css'
import { useState } from 'react';
import { Link } from 'react-router-dom'
import Avatar from '../Avatar/Avatar'
import Modal from 'react-modal'
import { FcInfo, FcDataConfiguration } from "react-icons/fc";
import { VscChromeClose } from "react-icons/vsc";
import { genericStylesModal } from '../../utils/customStylesModals';


Modal.setAppElement('#root');

export default function CardUser({ codeUser, email, name, phone, surname, totalBookRead, avatar, created_at, userId }) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    console.log(`AfterOpenModal`)
  }

  
  return (
    <article className="Card__users a-fade-in">
      <Avatar thumbnail={avatar} />
      <div className="a-flex a-flex-column a-flex-align-self-center">
        <h3>{name} {surname}</h3>
        {/* <p>{codeUser}</p> */}
        <p>Desde: {created_at}</p>
      </div>
      <div className="a-flex a-flex-column a-flex-align-self-center">
        <p>Libros totales: {totalBookRead}</p>
        <p>Libros prestados: 2</p>
      </div>
      <div className="a-flex-align-self-center a-flex-align-self-center">
        <h4>Próximo vencimiento: </h4>
        <ul>
          <li>4/OCT/2021</li>
        </ul>
      </div>
      <div className="a-flex-align-self-center a-flex a-flex-center">
        <ul className="a-flex a-flex-row">
          <li className="a-margin-right-16">
            <button className="a-btn__icon" onClick={openModal}>
              <FcInfo size="30px" />
              <span className="sr-only">Ver ficha de usuario</span>
            </button>
          </li>
          <li>
            <Link to={`${userId}`} className="a-btn__icon a-lh-2 a-flex a-flex-center a-flex-align-item">
              <FcDataConfiguration size="30px" />
              <span className="sr-only">Editar ficha de usuario</span>
            </Link>
          </li>
        </ul>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={genericStylesModal}
        contentLabel="Información del usuario"
      >
        <header className="Modal__header">
          <button className="a-btn__icon" onClick={closeModal}>
            <VscChromeClose size="34px" />
            <span className="sr-only">Cerrar ventana de dialogo </span>
          </button>
        </header>
        <section>
          <div className="a-flex">
            <Avatar thumbnail={avatar} />
            <div>
              <h3>{name} {surname}</h3>
              <ul>
                <li>{codeUser}</li>
                <li>{phone}</li>
                <li> {email}</li>
              </ul>
            </div>
          </div>
          <ul className="Card__users-table a-flex a-flex-sBetween">
            <li>Desde: <span>{created_at}</span></li>
            <li>Libros totales: <span>{totalBookRead}</span></li>
            <li>Libros prestados: <span>2</span></li>
          </ul>
        </section>
      </Modal>
    </article>
  )
}


// TODO: Formatear la fecha de alta
