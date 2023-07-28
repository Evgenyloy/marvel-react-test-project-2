//более простой способ создания стора через тулкит
import { configureStore } from '@reduxjs/toolkit';

import heroes from '../components/heroesList/heroesSlice';
import filters from '../components/heroesFilters/filtersSlice';

const stringMiddleware = (store) => (dispatch) => (action) => {
  if (typeof action === 'string') {
    return dispatch({
      type: action,
    });
  }
  return dispatch(action);
};

const enhancer =
  (createStore) =>
  (...args) => {
    const store = createStore(...args);
    const oldDispatch = store.dispatch;
    store.dispatch = (action) => {
      if (typeof action === 'string') {
        return oldDispatch({
          type: action,
        });
      }
      return oldDispatch(action);
    };
    return store;
  };
//более простой способ создания стора через тулкит
const store = configureStore({
  reducer: { heroes, filters },
  //в тулките уже встроены несколько Middleware (getDefaultMiddleware), включение их ниже + через concat подключаем наш
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(stringMiddleware),
  //devtools принимае true/false но это работает и в продакшн билде, поэтому пишем process.env.NODE_ENV !== 'production',
  devTools: process.env.NODE_ENV !== 'production',
});

/* const store = createStore(
  combineReducers({ heroes, filters }),
  compose(
    applyMiddleware(ReduxThunk, stringMiddleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
); */

export default store;
