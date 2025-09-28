import React from "react";
import CategoryCard from "./CategoryCard";
import { CategoryInfo } from "./CategoryInfo";
import "./Category.css";

function Category() {
  return (
    <section className="category-grid">
      {CategoryInfo.map((info) => (
        <CategoryCard key={info.name} data={info} />
      ))}
    </section>
  ); 
}

export default Category;
