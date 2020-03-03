import webPush from "web-push";
import envar from "../lib/envar";
import User from "../models/user";

export const subscribe = (req, res, next) => {
  // Get pushSubscription object
  // const subscription = req.body;
  User.findByIdAndUpdate(req.user._id, { "webpush.subscription": req.body.subscription }).exec((err, user) => {
    if (err) next(err);

    res.status(201).json({});
  });
  // Send 201 - resource created

  // // Create payload
  // const payload = JSON.stringify({ title: "Push Test" });

  // // Pass object into sendNotification
  // webpush.sendNotification(subscription, payload).catch(err => console.error(err));
};

export const pushTest = (req, res, next) => {
  // Create payload
  const payload = JSON.stringify({ title: req.body.title, body: req.body.text });

  // Pass object into sendNotification
  webpush.sendNotification(req.user.webpush.subscription, payload).catch(err => console.error(err));

  res.status(201).json({});
};
