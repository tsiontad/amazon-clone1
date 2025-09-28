import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Layout from "../LayOut/LayOut";
import ProductCard from "../Product/ProductCard";
import { CategoryInfo } from "../Category/CategoryInfo";
import classes from "./Results.module.css";
import { ImOpt } from "react-icons/im";
import {producturl} from "../../Api/EndPoints"
function Results() {
  const { categoryName } = useParams();
  const [results, setResults] = useState([]);

  
  const apiCategory = CategoryInfo.find(
    (c) => c.slug === categoryName
  )?.apiName;

  useEffect(() => {
    if (!apiCategory) return;

    axios
      .get(`${producturl}/products/category/${encodeURIComponent(apiCategory)}`)
      .then((res) => setResults(res.data))
      .catch((err) => console.error(err));
  }, [apiCategory]);

  return (
    <Layout>
      <h1>Results for {apiCategory}</h1>
      <div className={classes.product_container}>
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Layout>
  );
}

export default Results;
