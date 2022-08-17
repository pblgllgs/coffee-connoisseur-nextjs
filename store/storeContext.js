import { createContext, useReducer } from 'react';

export const StoreContext = createContext();

export const ACTION_TYPES = {
  SET_LAT_LONG: 'SET_LAT_LONG',
  SET_COFFEE_STORES: 'SET_COFFEE_STORES',
  ADD_VOTES: 'ADD_VOTES'
};

const storeReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LAT_LONG: {
      return {
        ...state,
        latLong: action.payload.latLong
      };
    }
    case ACTION_TYPES.SET_COFFEE_STORES: {
      return {
        ...state,
        coffeeStores: action.payload.coffeeStores
      };
    }
    case ACTION_TYPES.ADD_VOTES: {
      return {
        ...state,
        votes: [...state.votes, action.payload.id]
      };
    }
    default:
      throw new Error(`Unhandled action type:${action.type}`);
  }
};

export const StoreProvider = ({ children }) => {
  const initialState = {
    latLong: '',
    votes: [],
    coffeeStores: []
  };
  const [state, dispatch] = useReducer(storeReducer, initialState);

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
};
