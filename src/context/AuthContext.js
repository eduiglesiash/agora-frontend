import React, { useEffect, useState } from "react"
import axios from 'axios'
import { config } from "../config/config";
import { useNavigate } from "react-router-dom";


let AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const userStorage = 'agora-user';
  const tokenStorage = 'agora-jwt';

  const getUserSessionStorage = ()=>{
    const user = sessionStorage.getItem(userStorage);
    const token = sessionStorage.getItem(tokenStorage);
    if (user) setUser(JSON.parse(user));
    if (token) setToken(JSON.parse(token));
  }
  const setUserLocalStorage = ({user, token})=>{
    sessionStorage.setItem(userStorage, JSON.stringify(user));
    sessionStorage.setItem(tokenStorage, JSON.stringify(token));
  }
  const deleteUserSessionStorage = ()=>{
    sessionStorage.removeItem(userStorage)
    sessionStorage.removeItem(tokenStorage)
  }

  useEffect(() => {
    getUserSessionStorage();
  }, [])

  const signin = ({ identifier, password }) => {
    const data = { identifier, password };
  
    return axios.post(`${config.strapi.path}/auth/local`, data)
      .then(({data}) => {
        setUser(data.user);
        setToken(data.jwt);
        setUserLocalStorage({
          user: data.user,
          token: data.jwt
        })
        return {
          status: 'success',
          user: data.user
        }
      })
      .catch(err => {
        console.error(`${config.toastMessage.loginError}`, err)
        return {
          status: 'error',
          message: err.response.data.message[0].messages[0].message
        }
      })
  }

  const signout = () => {
    setUser(null)
    setToken(null)
    deleteUserSessionStorage()
    navigate(config.paths.login)
  };

  let value = { user, token, signin, signout };

  return <AuthContext.Provider value={value}> {children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider }
