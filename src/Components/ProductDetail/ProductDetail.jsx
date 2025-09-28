import React, { useState, useEffect } from "react";
import classes from "./ProductDetail.module.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { producturl } from "../../Api/EndPoints";
import ProductCard from "../Product/ProductCard";
import Layout from "../LayOut/LayOut";
import Loader from "../Loader/Loader"; // Fixed the folder name

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${producturl}/products/${productId}`)
      .then((res) => {
        setProduct(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching product:", err);
        setIsLoading(false);
      });
  }, [productId]);

  return (
    <Layout>
      {isLoading ? (
        <Loader />
      ) : product ? (
          <ProductCard product={product} flex={true} RenderDesc={ true} />
      ) : (
        <p className={classes.error}>Product not found.</p>
      )}
    </Layout>
  );
}

export default ProductDetail;
