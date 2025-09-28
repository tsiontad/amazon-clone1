// src/utility/StateProvider.jsx
import React, { createContext, useContext, useReducer } from "react";
import { initialState, reducer } from "./reducer";

const DataContext = createContext();

export const DataProvider = ({ children }) => (
  <DataContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </DataContext.Provider>
);

export const useStateValue = () => useContext(DataContext);
