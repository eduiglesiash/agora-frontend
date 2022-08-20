import './Menu.css';
import { config } from '../../config/config';
import { NavLink } from 'react-router-dom';
import React, { useState } from 'react';
import classNames from 'classnames';
import { FcMenu, FcTemplate, FcKindle, FcConferenceCall, FcReading } from "react-icons/fc";
import { useAuth } from '../../hooks/useAuth';


export default function Menu() {
  const auth = useAuth();
  const [state, setState] = useState(false);
  const isHide = classNames({ 'sr-only': state });

  const handleMenu = () => {
    if (state) document.body.classList.remove('is-collapse');
    else document.body.classList.add('is-collapse');

    setState(!state);
  };

  return (
    <>
      {
        auth.user &&
        <nav className="Menu">
          <button className="Menu__btn" onClick={handleMenu}>
            <FcMenu size="34px" />
          </button>
          <ul className="Menu__list">
            <li>
              <NavLink className="Menu__link" to={config.paths.dashboard}>
                <FcTemplate size="34px" />
                <span className={isHide}>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="Menu__link" to={config.paths.books}>
                <FcKindle size="34px" />
                <span className={isHide}>Libros</span>
              </NavLink>
            </li>
        <li>
          <NavLink className="Menu__link" to={config.paths.borrowedBooks}>
            <FcReading size="34px"/>
            <span className={isHide}>Prestados</span>
          </NavLink>
        </li>
            <li>
              <NavLink className="Menu__link" to={config.paths.users}>
                <FcConferenceCall size="34px" />
                <span className={isHide}>Usuarios</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      }
    </>
  );
}
