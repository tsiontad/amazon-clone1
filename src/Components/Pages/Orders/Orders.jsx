import React, { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../../utility/firebase";
import { useStateValue } from "../../DataProvider/DataProvider";
import classes from "./Orders.module.css";
import Header from "../../Header/Header";

function Orders() {
  const [{ user }] = useStateValue();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        // Order by created timestamp, most recent first
        const q = query(
          collection(db, "users", user.uid, "orders"),
          orderBy("created", "desc") 
        );

        const querySnapshot = await getDocs(q);
        const fetchedOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));

        // Remove .reverse() since we're already ordering in Firestore
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Format date helper function
  const formatDate = (timestamp) => {
    if (!timestamp) return "Date not available";

    try {
      // Handle Firestore timestamp
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Date not available";
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className={classes.ordersContainer}>
          <div className={classes.loading}>Loading your orders...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className={classes.ordersContainer}>
          <div className={classes.error}>{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={classes.ordersContainer}>
        <h2>Your Orders ({orders.length})</h2>
        {orders.length === 0 ? (
          <div className={classes.noOrders}>
            <p>You have no orders yet.</p>
            <button
              onClick={() => (window.location.href = "/")}
              className={classes.shopButton}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          orders.map((order, index) => (
            <div key={order.id} className={classes.orderCard}>
              {/* Show "Latest Order" badge for the first order */}
              {index === 0 && (
                <div className={classes.latestBadge}>Latest Order</div>
              )}

              <div className={classes.orderHeader}>
                <p>
                  <strong>Order ID:</strong> {order.id}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(order.data.created)}
                </p>
              </div>

              <p>
                <strong>Amount:</strong> $
                {order.data.amount?.toFixed(2) || "0.00"}
              </p>

              <p>
                <strong>Address:</strong>
                {order.data.address?.name && ` ${order.data.address.name}, `}
                {order.data.address?.street}, {order.data.address?.city},{" "}
                {order.data.address?.state} {order.data.address?.zip}
              </p>

              <p
                className={`${classes.paymentStatus} ${
                  order.data.paymentStatus === "Successful" ||
                  order.data.paymentStatus === "Mock Payment Successful"
                    ? classes.success
                    : classes.pending
                }`}
              >
                Payment: {order.data.paymentStatus}
              </p>

              <div className={classes.itemsList}>
                <h4>Items ({order.data.basket?.length || 0}):</h4>
                {order.data.basket?.map((item, itemIndex) => (
                  <div
                    key={`${item.id}-${itemIndex}`}
                    className={classes.orderItem}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className={classes.itemImage}
                    />
                    <div className={classes.itemDetails}>
                      <p className={classes.itemTitle}>{item.title}</p>
                      <p>
                        Qty: {item.quantity} × ${item.price?.toFixed(2)} = $
                        {(item.quantity * item.price)?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )) || <p>No items found</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Orders;
