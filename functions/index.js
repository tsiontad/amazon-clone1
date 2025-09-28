// index.js
const { onRequest } = require("firebase-functions/v2/https"); // v2 is recommended
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { setGlobalOptions } = require("firebase-functions");
dotenv.config();

const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();
setGlobalOptions({ maxInstances: 10 });
// Allow all origins (you can restrict to your frontend URL)
app.use(cors({ origin: true }));

// Parse JSON bodies
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend is working!" });
});

// Create Stripe PaymentIntent
app.post("/payment/create", async (req, res) => {
  const { total } = req.body;

  console.log("Payment request received for amount:", total);

  if (!total || total <= 0) {
    return res.status(400).json({ message: "Total must be greater than 0" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total, // in cents
      currency: "usd",
    });

    res.status(201).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe Payment Error:", err);
    res.status(500).json({ message: "Payment failed", error: err.message });
  }
});

exports.api = onRequest(app);
