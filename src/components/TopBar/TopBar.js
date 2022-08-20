import { toast } from 'react-toastify';
import { config } from '../../config/config';
import { useAuth } from '../../hooks/useAuth';
import {RiLogoutCircleRLine} from "react-icons/ri";
import './TopBar.css';

export default function TopBar(){
  const auth = useAuth();


  const handleLogout = ()=>{
    toast.info(config.toastMessage.loginLogout)
    auth.signout();
  }

  return (
    <>
    {
      auth.user && 
      <section className="TopBar">
        <button className="TopBar__button" type="button" onClick={handleLogout}>
          <RiLogoutCircleRLine size="34px"/>
        </button>
      </section>
    }
    </> 
  )
}
