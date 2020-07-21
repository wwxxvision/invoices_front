import React from 'react';
import '../styles/index.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import ROUTER from './routes/router';
import BaseModal from './components/modal';
import { useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';

export default function App() {
  const modalShowing = useSelector(state => state.modalShowing);
  const state = useSelector(state => state);

  const {
    showingLoader
    }  = state;

  const getPageOverlays = () => (
    <>
      {showingLoader &&
          <div className="loader">
            <Spinner animation="border" variant="primary" />
           </div>
      }

      {modalShowing &&
        <BaseModal {...modalShowing} action={modalShowing.action} data={modalShowing.data} />
      }
    </>
  )

  return (
    <div className="page">
      {getPageOverlays()}
      <Router>
        <Switch>
          {ROUTER.map((route, i) =>
            <Route
              exact={route.exact}
              key={i}
              path={route.path}
              render={(props) =>
                (<route.component
                  {...props}
                  {...route}
                  state={state}
                />)}
            />
          )}
        </Switch>
      </Router>
    </div>
  );
}



