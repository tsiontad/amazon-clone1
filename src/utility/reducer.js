import { Type } from "../utility/actionTypes";
export const initialState = {
  basket: [],
  user:null
};

// Selector for total items
export const getBasketCount = (basket) =>
  basket?.reduce((total, item) => total + (item.quantity || 1), 0);

// Selector for total price
export const getBasketTotal = (basket) =>
  basket?.reduce(
    (amount, item) => amount + item.price * (item.quantity || 1),
    0
  );

export const reducer = (state, action) => {
  switch (action.type) {
    // ADD TO BASKET
    case "ADD_TO_BASKET": {
      const existingIndex = state.basket.findIndex(
        (item) => item.id === action.item.id
      );

      if (existingIndex >= 0) {
        // Item exists → increment quantity
        const newBasket = [...state.basket];
        newBasket[existingIndex] = {
          ...newBasket[existingIndex],
          quantity: (newBasket[existingIndex].quantity || 1) + 1,
        };
        return { ...state, basket: newBasket };
      }

      // Item not in basket → add new item
      return {
        ...state,
        basket: [...state.basket, { ...action.item, quantity: 1 }],
      };
    }

    // UPDATE QUANTITY
    case "UPDATE_QUANTITY": {
      const { id, amount } = action;
      const updatedBasket = state.basket
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max((item.quantity || 1) + amount, 0) }
            : item
        )
        .filter((item) => item.quantity > 0); // remove items with 0 quantity
      return { ...state, basket: updatedBasket };
    }

    // REMOVE FROM BASKET
    case "REMOVE_FROM_BASKET":
      return {
        ...state,
        basket: state.basket.filter((item) => item.id !== action.id),
      };
    case Type.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case "CLEAR_BASKET":
      return {
        ...state,
        basket: [],
      };

    default:
      return state;
  }
};
