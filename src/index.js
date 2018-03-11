import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import 'rxjs';
import { createEpicMiddleware } from 'redux-observable';
import { throttle } from 'lodash';
import { loadStorage, saveStorage } from './localStorage';
import App from './App';
import app, { epic } from './Reducer/app';
import registerServiceWorker from './registerServiceWorker';
import initState from './initState';

const epicMiddleware = createEpicMiddleware(epic);

const state = loadStorage({ initState });
const store = createStore(
    app,
    state,
    composeWithDevTools(applyMiddleware(logger, epicMiddleware)),
);

store.subscribe(throttle(() => {
    saveStorage({ state: store.getState() });
}, 5000));

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'),
);
registerServiceWorker();
