import React, { useState, useEffect } from "react";
import { auth } from "../../../utility/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import classes from "../Auth/Auth.module.css";
import { Link, useNavigate, useLocation} from "react-router-dom";
import { useStateValue } from "../../DataProvider/DataProvider";

function Auth() {
  const [{ user }, dispatch] = useStateValue();
  const navigate = useNavigate();
const navStateData = useLocation()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      dispatch({
        type: "SET_USER",
        user: userCredential.user,
      });
      console.log("Logged in user:", userCredential.user);
      navigate(navStateData?.state?.redirect || "/"); // redirect after sign-in
    } catch (err) {
      if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      dispatch({
        type: "SET_USER",
        user: userCredential.user,
      });
      console.log("Created user:", userCredential.user);
      navigate(navStateData?.state?.redirect || "/"); 
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already in use.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak (min 6 characters).");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.auth}>
      <Link to="/">
        <img
          className={classes.logo}
          src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
          alt="Amazon"
        />
      </Link>

      <div className={classes.formContainer}>
        <h1>Welcome</h1>
        {navStateData?.state?.msg && (
          <small style={{
            padding: "5px",
            textAlign: "center",
            color: "red",
            fontWeight: "bold",
          }}>{navStateData.state.msg}</small>
        )}
        <form>
          <label>Email or mobile phone number</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <label>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          {error && <p className={classes.error}>{error}</p>}

          <button
            type="submit"
            className={classes.continueBtn}
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <button
            type="button"
            className={classes.continueBtn}
            onClick={handleSignUp}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create your Amazon account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Auth;
