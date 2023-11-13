'use client'
import { createContext, useContext, useReducer, useState } from "react";

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

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  return <Context.Provider value={{ state, dispatch, url, setUrl, loading, setLoading }}>{children}</Context.Provider>;
}

export function useContextValue() {
  return useContext(Context);
}
