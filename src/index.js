import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import { takeEvery, put } from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';
import axios from 'axios';

import App from './App';

// this startingPlantArray should eventually be removed
// const startingPlantArray = [
//   { id: 1, name: 'Rose' },
//   { id: 2, name: 'Tulip' },
//   { id: 3, name: 'Oak' }
// ];

const plantList = (state = [], action) => {
  switch (action.type) {
    case 'ADD_PLANT':
      return action.payload;
    default:
      return state;
  }
};

function* fetchPlants() {
  try {
    const plants = yield axios.get('/api/plant');
    yield put({ type: 'ADD_PLANT', payload: plants.data});
  } catch (error) { 
    console.log(`Error in fetchPlants: ${error}`);
    alert('Something went wrong.');
  }
}

function* postPlant(action) {
  try {
    yield axios.post('/api/plant', action.payload);
    yield put({ type: 'FETCH_PLANTS'});
    action.setPlant('');
  } catch (error) {
    console.log(`Error in postPlant: ${error}`);
    alert('Something went wrong')
  }
}

function* deletePlant(action) {
  try {
    yield axios.delete(`/api/plant/${action.playload}`);
    yield put({ type: 'FETCH_PLANTS' });
  } catch (error) {
    console.log(`Error in deletePlant ${error}`)
    alert('Something went wrong.');
  }
}

function* rootSaga() {
    yield takeEvery('FETCH_PLANTS', fetchPlants);
    yield takeEvery('NEW_PLANT', postPlant);
    yield takeEvery('REMOVE_PLANT', deletePlant)
}

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  combineReducers(
    { 
      plantList 
    }
    ),
    applyMiddleware(sagaMiddleware, logger)
);

sagaMiddleware.run(rootSaga);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);