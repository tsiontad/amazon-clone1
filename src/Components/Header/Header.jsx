import React from "react";
import { Link } from "react-router-dom";
import { SlLocationPin } from "react-icons/sl";
import { FaSearch } from "react-icons/fa";
import { BiCart } from "react-icons/bi";
import { useStateValue } from "../DataProvider/DataProvider";
import { auth } from "../../utility/firebase";
import classes from "./Header.module.css";

function Header() {
  const [{ basket, user }, dispatch] = useStateValue();

  const handleSignOut = () => {
    auth.signOut().then(() => {
      dispatch({
        type: "SET_USER",
        user: null,
      });
    });
  };

  return (
    <header className={classes.header}>
      {/* Top Header */}
      <div className={classes.header_container}>
        {/* Logo */}
        <Link to="/">
          <img
            src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
            alt="Amazon Logo"
            className={classes.logo}
          />
        </Link>

        {/* Delivery Location */}
        <div className={classes.delivery}>
          <SlLocationPin />
          <div>
            <p>Deliver to</p>
            <span>United States</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className={classes.search}>
          <select>
            <option>All</option>
          </select>
          <input type="text" placeholder="Search Amazon" />
          <FaSearch className={classes.searchIcon} />
        </div>

        {/* Right Links */}
        <div className={classes.rightLinks}>
          {/* User Greeting or Sign In */}
          <div>
            {user ? (
              <div onClick={handleSignOut} style={{ cursor: "pointer" }}>
                <p>
                  Hello,{" "}
                  {user.displayName
                    ? user.displayName
                    : user.email.split("@")[0]}
                </p>
                <span>Sign Out</span>
              </div>
            ) : (
              <Link to="/auth">
                <div>
                  <p>Hello, Sign in</p>
                  <span>Account & Lists</span>
                </div>
              </Link>
            )}
          </div>

          <Link to="/orders">
            <p>Returns</p>
            <span>& Orders</span>
          </Link>

          <Link to="/cart" className={classes.cart}>
            <BiCart className={classes.cartIcon} />
            <span className={classes.cartCount}>
              {basket?.reduce((total, item) => total + (item.quantity || 1), 0)}
            </span>
          </Link>
          
        </div>
      </div>

      {/* Lower Header / Navigation */}
    </header>
  );
}

export default Header;
