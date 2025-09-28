import React from "react";
import classes from "./Cart.module.css";
import { useStateValue } from "../../DataProvider/DataProvider";
import { Type } from "../../../utility/actionTypes";
import CurrencyFormat from "../../CurrencyFormat/CurrencyFormat";
import { getBasketTotal } from "../../../utility/reducer";
import Header from "../../Header/Header";
import { Link } from "react-router-dom";

function Cart() {
  const [{ basket }, dispatch] = useStateValue();

  const removeItem = (id) => dispatch({ type: Type.REMOVE_FROM_BASKET, id });
  const increaseQty = (id) =>
    dispatch({ type: Type.UPDATE_QUANTITY, id, amount: +1 });
  const decreaseQty = (id) =>
    dispatch({ type: Type.UPDATE_QUANTITY, id, amount: -1 });

  return (
    <>
      <Header />
      <div className={classes.cartContainer}>
        <div className={classes.cartItems}>
          <h2>Your Cart</h2>
          {basket.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            basket.map((item) => (
              <div className={classes.cartItem} key={item.id}>
                <img
                  src={item.image}
                  alt={item.title}
                  className={classes.cartImg}
                />
                <div className={classes.cartDetails}>
                  <h3>{item.title}</h3>
                  <p>{item.description.split(" ").slice(0, 20).join(" ")}...</p>
                  <div className={classes.quantity}>
                    <button onClick={() => decreaseQty(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQty(item.id)}>+</button>
                  </div>
                  <div className={classes.price}>
                    <CurrencyFormat amount={item.price * item.quantity} />
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className={classes.removeBtn}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {basket.length > 0 && (
          <div className={classes.subtotalBox}>
            
              Subtotal ({basket.reduce((acc, item) => acc + item.quantity, 0)}{" "}
              items):{" "}
              <strong>
                <CurrencyFormat amount={getBasketTotal(basket)} />
              </strong>
           
            <div className={classes.gift}>
              <input type="checkbox" id="gift" />
              <label htmlFor="gift">This order contains a gift</label>
            </div>
            <Link to="/payment"but className={classes.checkoutBtn}>Proceed to Checkout</Link>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
