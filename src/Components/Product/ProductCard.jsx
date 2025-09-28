import React from "react";
import { Rating } from "@mui/material";
import CurrencyFormat from "../CurrencyFormat/CurrencyFormat";
import classes from "./ProductCard.module.css";
import { Link } from "react-router-dom";
import { useStateValue } from "../../Components/DataProvider/DataProvider";
import { Type } from "../../utility/actionTypes";

function ProductCard({ product, flex, RenderDesc, renderAdd = true }) {
  if (!product) return null;

  const [{ basket }, dispatch] = useStateValue();

  const addToBasket = () => {
    dispatch({ type: Type.ADD_TO_BASKET, item: { ...product } });
  };

  return (
    <div className={`${classes.card} ${flex ? classes.product_flex : ""}`}>
      <div className={classes.image_section}>
        <Link to={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.title}
            className={flex ? classes.product_fleximg : classes.default_img}
          />
        </Link>
      </div>
      <div className={classes.details_section}>
        <h3>{product.title}</h3>
        {RenderDesc && (
          <div style={{ maxWidth: "750px" }}>{product.description}</div>
        )}
        <div className={classes.rating}>
          <Rating value={product.rating?.rate || 0} precision={0.1} readOnly />
          <small>({product.rating?.count || 0})</small>
        </div>
        <div className={classes.price}>
          <CurrencyFormat amount={product.price} />
        </div>
        {renderAdd && (
          <button className={classes.button} onClick={addToBasket}>
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
