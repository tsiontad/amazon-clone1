import React, { useEffect } from "react";
import "./App.css";
import Routing from "./Router";
import "./App.css";
import { useStateValue } from "../src/Components/DataProvider/DataProvider";
import { auth } from "../src/utility/firebase";
function App() {
  const [, dispatch] = useStateValue();

  useEffect(() => {
    // Check if user is logged in on refresh
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is signed in
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        // User is signed out
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <>
      <Routing />
    </>
  );
}

export default App;
