import webPush from "web-push";
import envar from "../lib/envar";
import User from "../models/user";

export const subscribe = (req, res, next) => {
  // Get pushSubscription object
  // const subscription = req.body;
  console.log(`::::::::::::::: ____________update subscription for ${req.user.name}`);
  console.log(req.deviceDetected);
  console.log(req.body.subscription);
  const date = new Date();
  date.setDate(date.getDate() + 90);
  req.body.subscription.expirationTime = date;
  User.findByIdAndUpdate(req.user._id, { $addToSet: { "webpush.devices": { name: req.deviceDetected.device.model, subscription: req.body.subscription, isActive: true } } }).exec(
    (err, user) => {
      if (err) next(err);

      res.status(201).json({});
    }
  );
  // Send 201 - resource created

  // // Create payload
  // const payload = JSON.stringify({ title: "Push Test" });

  // // Pass object into sendNotification
  // webpush.sendNotification(subscription, payload).catch(err => console.error(err));
};

export const pushTest = async (req, res, next) => {
  // Create payload
  const payload = JSON.stringify({ title: req.body.title, body: req.body.text });

  // Pass object into sendNotification
  for await (let data of req.user.webpush.devices) {
    webPush.sendNotification(data.subscription, payload).catch(err => console.error(err));
  }

  res.status(201).json({});
};
