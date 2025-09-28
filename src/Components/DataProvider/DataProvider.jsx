import React, { createContext, useContext, useReducer } from "react";
import { initialState, reducer } from "../../utility/reducer";

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const value = useReducer(reducer, initialState); // ✅ hook inside function body

  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
};

export const useStateValue = () => useContext(StateContext);
