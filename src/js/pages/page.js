import React, { useEffect } from 'react';
import TableCrud from '../components/table';
import { useDispatch } from 'react-redux';
import User from '../classes/Models/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolderOpen,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';



export default function Page(props) {
  const dispatch = useDispatch();
  useEffect(() => {
    const { pathname } = props.location;

    const isNotPublicPath = pathname !== '/auth';
    const userIsAuth = new User().isAuth;

    if (isNotPublicPath && !userIsAuth) {
      props.history.push('/auth');

      dispatch({ type: 'SET_USER_STATUS', status: false });
      window.location.reload();
    }

    if (userIsAuth && pathname === '/auth') {
      props.history.push('/');
    }
  }, []);

  return (
    <>
      <div className="tab-panel">
        <div className="tab-panel__tab">
          <div className="tab__wrapper">
            <NavLink exact  to="/clients" activeClassName="active">
              <div className="tab__icon">
                <FontAwesomeIcon icon={faUsers} />
              </div>
            </NavLink>
          </div>
        </div>

         <div className="tab-panel__tab">
          <div className="tab__wrapper">
            <NavLink exact  to="/" activeClassName="active">
              <div className="tab__icon">
                <FontAwesomeIcon icon={faFolderOpen} />
              </div>
            </NavLink>
          </div>
        </div>
      </div>

      <div className="content full_height">
        <div className="wrapper">
          <h2>{props.title}</h2>
          <TableCrud type={props.name} />
        </div>
      </div>
    </>
  )
}