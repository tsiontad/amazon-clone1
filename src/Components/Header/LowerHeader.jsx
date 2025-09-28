
import { MdMenu } from "react-icons/md";
import { RiArrowDropDownFill } from "react-icons/ri";
import classes from "./Header.module.css";

function LowerHeader() {
  return (
    <div className={classes.lowerHeader}>
      <ul>
        <li className={classes.menuAll}>
          <MdMenu className={classes.menuIcon} />
          <p>All</p>
        </li>
        <li>Amazone Halu</li>
        <li>Every prime Deals</li>
        <li>
          Medical Care
          <RiArrowDropDownFill />
        </li>
        <li>Best sellers</li>
        <li>Amazone Basics</li>
        <li>new realeses</li>
        <li>
          Groceries
          <RiArrowDropDownFill />
        </li>
        <li>
          prime
          <RiArrowDropDownFill />
        </li>
        <li>Registry</li>
        <li className={classes.bigDeal}>Prime Big Deal Days is October 6-8</li>
      </ul>
    </div>
  );
}

export default LowerHeader;
