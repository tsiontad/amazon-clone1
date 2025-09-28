import classes from "./CategoryCard.module.css";
import { Link } from "react-router-dom";

function CategoryCard({ data: { title, imgLink, slug } }) {
  return (
    <div className={classes.card}>
      <Link to={`/category/${slug}`}>
        <h2 className={classes.title}>{title}</h2>
        <img className={classes.image} src={imgLink} alt={title} />
        <p className={classes.link}>Shop now</p>
      </Link>
    </div>
  );
}
export default CategoryCard;
