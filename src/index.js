import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App.jsx';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import axios from 'axios';
// "takeEvery" will inform watcher saga, "put" will allow us to make dispatches from this file (since usually we send dispatches up to the index.js file). "put" can have sagas talk to reducers
import { takeEvery, put } from 'redux-saga/effects'; 

const elementList = (state = [], action) => {
    switch (action.type) {
        case 'SET_ELEMENTS':
            return action.payload;
        default:
            return state;
    }
};    

const ships = (state = [], action) => {
    if(action.type === 'SET_SHIPS') {
        return action.payload;
    }
    return state;
}

// this is the saga that will watch for actions
function* watcherSaga() { // aka the "rootSaga". our saga's receive dispatches but only for the ones it's watching. * for asynch. generator function can use yield
    yield takeEvery('GET_ELEMENTS', getElements); // when we receive a type of 'GET_ELEMENTS, run this function getElements. kind of like conditional in a reducer. 'yield every time you get an action of 'GET_ELEMENTS, and when you do, run getElements.
    yield takeEvery('GET_SHIPS', getShips);
}

// sagas use function syntax with *. reducers use arrow function
function* getElements() {
    try{
        // get call for our data
        const response = yield axios.get('/api/element');
        // send data to our reducer
        console.log('back from server:', response.data);
        yield put ({type: 'SET_ELEMENTS', payload: response.data});
    }catch(err) {
        console.log(err);
        alert('uh oh');
    }
}

function* getShips() {
    try{
        const response = yield axios.get('https://swapi.dev/api/starships');
        yield put({type: 'SET_SHIPS', payload: response.data});

    }catch(err) {
        console.log(err);
        alert('nope');
    }
}

const sagaMiddleware = createSagaMiddleware();

// This is creating the store
// the store is the big JavaScript Object that holds all of the information for our application
const storeInstance = createStore(
    // This function is our first reducer
    // reducer is a function that runs every time an action is dispatched
    combineReducers({
        elementList,
        ships
    }),
    applyMiddleware(sagaMiddleware, logger),
);

sagaMiddleware.run(watcherSaga);

ReactDOM.render(
    <Provider store={storeInstance}>
        <App/>
    </Provider>, 
    document.getElementById('root')
);

registerServiceWorker();
