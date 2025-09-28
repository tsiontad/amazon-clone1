import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Components/Pages/Landing/Landing";
import Auth from "./Components/Pages/Auth/Auth";
import Payment from "./Components/Payment/Payment";
import Orders from "./Components/Pages/Orders/Orders";
import Cart from "./Components/Pages/Cart/Cart";
import Results from "./Components/Results/Result";
import ProductDetail from "./Components/ProductDetail/ProductDetail";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ProtectedRoute from "../src/Components/ProtectedRoute/ProtectedRoute";

function Routing() {
  const stripePromise = loadStripe(
    "pk_test_51SBTyWJBjxQ4dmQD1baIvT1Hi2cN7BTAGmONK9RnLIcloEOINKnVPqszykCPr0pjTaIQhzzRM69yz2iK16Ay6KkR00NTxNYG0v"
  );

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/category/:categoryName" element={<Results />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />

        {/* Protected Routes */}
        <Route
          path="/payment"
          element={
            <ProtectedRoute msg="You must login to pay" redirect="/payment">
              <Elements stripe={stripePromise}>
                <Payment />
              </Elements>
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute
              msg="You must login to view your orders"
              redirect="/orders"
            >
              <Orders />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default Routing;
