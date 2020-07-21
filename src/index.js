import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/App';
import * as serviceWorker from './serviceWorker';
import { createStore } from 'redux'
import reducers from './js/redux/reducers/reducer';
import { Provider } from 'react-redux';

const isDev = process.env.NODE_ENV === 'development';
const toolsRedux = isDev ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() : null;
const store = createStore(reducers, toolsRedux);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
