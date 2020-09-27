const express = require("express");
const forceSsl = require('force-ssl-heroku');
const Razorpay = require('razorpay');
const request = require('request');
const cors = require("cors");
const path = require('path');
const firestore = require('./firestore');
require('dotenv').config()
const app = express();
app.use(cors());
app.use(forceSsl);

const port = process.env.PORT || 5000;

// Initializing Razorpay instance
const instance = new Razorpay({
  key_id: process.env.RAZOR_PAY_KEY_ID,
  key_secret: process.env.RAZOR_PAY_KEY_SECRET,
});

// Server Api's
// API for creating orders using Razorpay SDK
app.get("/order", (req, res) => {
  try {
    const db = firestore.firestore.firestore();
    var docRef = db.collection("metadata").doc("razorpay-testing");
    docRef.get().then(function (razorpay_details) {
      if (razorpay_details.exists) {
        let credencials = razorpay_details.data();
        const options = {
          amount: credencials.amount * 100, // amount == Rs 10
          currency: "INR",
          receipt: "receipt#1",
          payment_capture: 0,
          // 1 for automatic capture // 0 for manual capture
        };
        instance.orders.create(options, async function (err, order) {
          if (err) {
            return res.status(500).json({
              message: "Something Went Wrong 1",
            });
          }
          return res.status(200).json(order);
        });
      } else {
        return res.status(500).json({
          message: "Something Went Wrong 2",
        });
      }
    }).catch(function (error) {
      return res.status(500).json({
        message: "Something Went Wrong 3",
      });
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something Went Wrong 4",
    });
  }
});

// API to captures the payment
app.post("/capture/:paymentId", (req, res) => {
  try {
    const db = firestore.firestore.firestore();
    var docRef = db.collection("metadata").doc("razorpay-testing");
    docRef.get().then(function (razorpay_details) {
      if (razorpay_details.exists) {
        let credencials = razorpay_details.data();
        return request(
          {
            method: "POST",
            url: `https://${process.env.RAZOR_PAY_KEY_ID}:${process.env.RAZOR_PAY_KEY_SECRET}@api.razorpay.com/v1/payments/${req.params.paymentId}/capture`,
            form: {
              amount: credencials.amount * 100, // amount == Rs 10 // Same As Order amount
              currency: "INR",
            },
          },
          async function (err, response, body) {
            if (err) {
              return res.status(500).json({
                message: "Something Went Wrong...",
              });
            }
            console.log("Status:", response.statusCode);
            console.log("Headers:", JSON.stringify(response.headers));
            console.log("Response:", body);
            return res.status(200).json(body);
          });
      } else {
        return res.status(500).json({
          message: "Something Went Wrong 2",
        });
      }
    }).catch(function (error) {
      return res.status(500).json({
        message: "Something Went Wrong 3",
      });
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something Went Wrong",
    });
  }
});

// If Production Mode On
if (process.env.NODE_ENV === 'production') {

  app.use(express.static(path.join(__dirname, 'build')));
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server Running at ${port}`);
});