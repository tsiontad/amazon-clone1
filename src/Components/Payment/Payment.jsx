import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useStateValue } from "../DataProvider/DataProvider";
import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../utility/firebase";
import classes from "./Payment.module.css";

function Payment() {
  const stripe = useStripe();
  const elements = useElements();
  const [{ basket, user }, dispatch] = useStateValue();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [useMockPayment, setUseMockPayment] = useState(false);

  const [address, setAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const orderTotal = basket
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  // Initialize payment when component loads
  useEffect(() => {
    if (!user) {
      navigate("/auth", {
        state: { msg: "Please login to checkout", redirect: "/payment" },
      });
      return;
    }

    if (basket.length === 0) {
      navigate("/cart");
      return;
    }

    // Try real backend, fallback to mock
    const initializePayment = async () => {
      try {
        const response = await axios.post(
          "https://api-vbay4f3o7q-uc.a.run.app/",
          { total: Math.round(orderTotal * 100) },
          { timeout: 5000 }
        );
        setClientSecret(response.data.clientSecret);
        setUseMockPayment(false);
      } catch (error) {
        console.log("Using mock payment mode");
        setClientSecret("mock_client_secret_" + Date.now());
        setUseMockPayment(true);
      }
    };

    initializePayment();
  }, [basket, orderTotal, user, navigate]);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError("");

    // Simple validation
    if (
      !address.name ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zip
    ) {
      setError("Please fill all address fields");
      setProcessing(false);
      return;
    }

    try {
      let paymentResult;

      if (useMockPayment) {
        // Mock payment simulation
        await new Promise((resolve) => setTimeout(resolve, 2000));
        paymentResult = {
          paymentIntent: {
            id: "mock_payment_" + Date.now(),
            amount: Math.round(orderTotal * 100),
          },
        };
      } else {
        // Real Stripe payment
        const cardElement = elements.getElement(CardElement);
        paymentResult = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: { name: address.name },
          },
        });

        if (paymentResult.error) {
          throw new Error(paymentResult.error.message);
        }
      }

      // Save order to Firestore
      await setDoc(
        doc(
          collection(db, "users", user.uid, "orders"),
          paymentResult.paymentIntent.id
        ),
        {
          basket: basket,
          amount: paymentResult.paymentIntent.amount / 100,
          address: address,
          paymentStatus: useMockPayment
            ? "Mock Payment Successful"
            : "Successful",
          paymentId: paymentResult.paymentIntent.id,
          userEmail: user.email,
          created: serverTimestamp(),
        }
      );

      // Clear cart and redirect
      dispatch({ type: "CLEAR_BASKET" });
      setTimeout(() => {
        navigate("/orders", {
          state: {
            message: "Payment successful!",
            orderId: paymentResult.paymentIntent.id,
          },
        });
      }, 1500);
    } catch (err) {
      setError(`Payment failed: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  if (!clientSecret) {
    return (
      <>
        <Header />
        <div className={classes.container}>
          <div className={classes.loading}>Setting up payment...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={classes.container}>
        {useMockPayment && (
          <div className={classes.mockNotice}>
            🚧 Demo Mode: No real payment will be processed
          </div>
        )}

        <h1>Checkout (${orderTotal})</h1>

        {/* User Info */}
        <div className={classes.section}>
          <h3>Logged in as: {user.email}</h3>
        </div>

        {/* Address Form */}
        <div className={classes.section}>
          <h3>Delivery Address</h3>
          <div className={classes.addressForm}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={address.name}
              onChange={handleAddressChange}
              required
            />
            <input
              type="text"
              name="street"
              placeholder="Street Address"
              value={address.street}
              onChange={handleAddressChange}
              required
            />
            <div className={classes.row}>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={address.city}
                onChange={handleAddressChange}
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={address.state}
                onChange={handleAddressChange}
                required
              />
              <input
                type="text"
                name="zip"
                placeholder="ZIP"
                value={address.zip}
                onChange={handleAddressChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className={classes.section}>
          <h3>Items ({basket.length})</h3>
          {basket.map((item) => (
            <div key={item.id} className={classes.item}>
              <img src={item.image} alt={item.title} />
              <div>
                <p>{item.title}</p>
                <p>
                  Qty: {item.quantity} × ${item.price} = $
                  {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
          <div className={classes.total}>
            <strong>Total: ${orderTotal}</strong>
          </div>
        </div>

        {/* Payment */}
        <div className={classes.section}>
          <h3>Payment</h3>
          <form onSubmit={handleSubmit}>
            {!useMockPayment ? (
              <CardElement className={classes.cardElement} />
            ) : (
              <div className={classes.mockCard}>
                Mock Payment - No credit card needed for demo
              </div>
            )}

            {error && <div className={classes.error}>{error}</div>}

            <button
              type="submit"
              disabled={
                processing || (!useMockPayment && (!stripe || !elements))
              }
              className={classes.payButton}
            >
              {processing ? "Processing..." : `Pay $${orderTotal}`}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Payment;
