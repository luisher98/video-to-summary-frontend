'use client'
import { createContext, useContext, useReducer } from "react";

const initialState = { data: null };

function reducer(state, action) {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, data: action.payload };
    default:
      return state;
  }
}

const Context = createContext({});

export function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>;
}

export function useContextValue() {
  return useContext(Context);
}
