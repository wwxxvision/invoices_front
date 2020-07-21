import React, { useEffect, useState } from 'react';
import User from '../classes/Models/User';
import { useDispatch } from 'react-redux'
import FormBase from '../components/form';
import Service from '../classes/System/Service';
import { Spinner } from 'react-bootstrap';
import DispatchWrapper from '../classes/System/DispatchWrapper';
import { CONSTANT } from '../contants';


function Auth(props) {
  const dispatch = useDispatch();
  const dispatchWrapper = new DispatchWrapper(dispatch);
  const [schema, setSchema] = useState(null);

  useEffect(() => {
    Service.getting('/auth', { 'Content-type': 'application/json' })
      .then(res => setSchema(res.schema));
  }, []);

  const sendForm = (fields) => {
    dispatchWrapper.makeAction('SETUP_FIELD', { showingLoader: true });
    Service.post('/auth', fields, { 'Content-type': 'application/json' })
      .then(res => {
        if (!res.status) {
          dispatchWrapper.makeAction(
            'SHOW_MODAL',
            {
              options: {
                name: 'answer',
                message: `Ошибка ${res.message}`,
                action: 'Сообщение',
                buttons: [],
                timeLife: CONSTANT.TIME_LIFE_WINDOW_MODAL
              }
            }
          );

          return;
        }

        if (res?.token) {
          new User(res.token);
          dispatchWrapper.makeAction('SET_USER_STATUS', { status: true });
          props.history.push('/');
        }
      })
      .catch(err => {
        dispatchWrapper.makeAction(
          'SHOW_MODAL',
          {
            options: {
              name: 'answer',
              message: `Ошибка ${err}`,
              action: 'Сообщение',
              buttons: [],
              timeLife: CONSTANT.TIME_LIFE_WINDOW_MODAL
            }
          }
        )
      })
      .then(() => dispatchWrapper.makeAction('SETUP_FIELD', { showingLoader: false }));
  }

  return (
    <>
      <div className="content full_height content-auth">
        <div className="wrapper">
          {schema ?
            (<FormBase sendForm={sendForm} schema={schema} data={null} titleButton="Войти" />)
            :
            (<span class="table__preloader"><Spinner animation="border" variant="primary" /></span>)
          }
        </div>
      </div>
    </>
  )
}

export default Auth;