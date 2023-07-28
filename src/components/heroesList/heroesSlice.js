import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';
import { useHttp } from '../../hooks/http.hook';

//при вызове эта функция вернет объект с разными методами
const heroesAdapter = createEntityAdapter();

/* const initialState = {
  heroes: [],
  heroesLoadingStatus: 'idle',
}; */

//создаем стейт на основании адаптера
const initialState = heroesAdapter.getInitialState({
  heroesLoadingStatus: 'idle',
});

export const fetchHeroes = createAsyncThunk('heroes/fetchHeroes', async () => {
  const { request } = useHttp();
  return await request('http://localhost:3001/heroes');
});

const heroesSlice = createSlice({
  name: 'heroes',
  initialState,
  reducers: {
    /* state.heroes = state.heroes.filter((item) => item.id !== action.payload); */
    //просто добавляем айтем

    heroCreated: (state, action) => {
      //(state, action.payload) state - это куда кладем, action.payload- что кладем
      heroesAdapter.addOne(state, action.payload);
    },
    heroDeleted: (state, action) => {
      /* state.heroes = state.heroes.filter((item) => item.id !== action.payload); */
      heroesAdapter.removeOne(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeroes.pending, (state) => {
        state.heroesLoadingStatus = 'loading';
      })
      .addCase(fetchHeroes.fulfilled, (state, action) => {
        state.heroesLoadingStatus = 'idle';
        //настраиваем через адаптер, первый аргумент - это то куда будем помещать данные, второе - это то, что будет туда приходить
        heroesAdapter.setAll(state, action.payload);
      })
      .addCase(fetchHeroes.rejected, (state) => {
        state.heroesLoadingStatus = 'error';
      })
      .addDefaultCase(() => {});
  },
});

//setAll - перетирает значения
//setMany - добавляет новые в существующий
const { actions, reducer } = heroesSlice;

export default reducer;

//есть два варианта получения стейта: все вместе,  как тут, или выдергивать по одиночке (см документацию)
//selectAll - достаем все, можно просмотреть все команды через cntrl + space
const { selectAll } = heroesAdapter.getSelectors((state) => state.heroes);

//компонентов где может понадобится такой функционал много , поэтому лучше перенести фильтр в slice
export const filteredHeroesSelector = createSelector(
  (state) => state.filters.activeFilter,
  /* (state) => state.heroes.entities, */
  //selectAll так же как и строчка выше вернет наш стейт
  //в selectAll стейт придет автоматически в этой функции но в других случаях его надо импортировать и получать отдельно
  //пример import store from '../../store'; const filters = selectAll(store.getState());
  selectAll,
  (filter, heroes) => {
    if (filter === 'all') {
      return heroes;
    } else {
      return heroes.filter((item) => item.element === filter);
    }
  }
);

export const {
  heroesFetching,
  heroesFetched,
  heroesFetchingError,
  heroCreated,
  heroDeleted,
} = actions;
